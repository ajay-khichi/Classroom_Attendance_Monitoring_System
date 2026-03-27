const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const authMiddleware = require('../middleware/auth');

// create Session (teacher)
// FIX: session create hone ke baad us section ke sabhi approved students ke liye
//      attendance table mein 'absent' rows insert karo.
//      Jab student khud mark karega, upsert se 'absent' -> 'present' ho jaega.
router.post('/create', authMiddleware, async (req, res) => {
  const { subject_id, room_id, date, start_time, end_time, section } = req.body;
  const teacher_id = req.user.id;

  try {
    // Robust time parsing — handle both HH:MM and HH:MM:SS
    const fullStartTime = start_time.split(':').length === 2 ? `${start_time}:00` : start_time;
    const start_timestamp = new Date(`${date}T${fullStartTime}`).toISOString();

    // Step 1: Session create karo
    const { data: session, error } = await supabase
      .from('sessions')
      .insert({
        teacher_id,
        subject_id,
        room_id,
        date,
        start_time: start_timestamp,
        end_time,
        section: section || null,
      })
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });

    // Step 2: Session's target group details fetch karo (Dept, Semester, Section Letter)
    // subject_id se department aur semester milega
    const { data: subject, error: subErr } = await supabase
      .from('subjects')
      .select('department_id, semester')
      .eq('id', subject_id)
      .single();

    if (!subErr && subject && section) {
      // Section string se last letter nikal lo (e.g., 'CSE VI A' -> 'A')
      const sectionLetter = section.trim().slice(-1).toUpperCase();

      // Step 3: Target students fetch karo (Right Dept + Right Sem + Matching Section Letter)
      const { data: targetStudents, error: stuErr } = await supabase
        .from('students')
        .select('id')
        .eq('status', 'approved')
        .eq('department_id', subject.department_id)
        .eq('semester', subject.semester)
        .ilike('section', `%${sectionLetter}`);

      if (!stuErr && targetStudents && targetStudents.length > 0) {
        // Step 4: Bulk absent rows insert karo
        const absentRows = targetStudents.map(st => ({
          session_id: session.id,
          student_id: st.id,
          status: 'absent',
          qr_verified: false,
          gps_verified: false,
          face_verified: false,
          marked_at: new Date().toISOString(),
        }));

        const { error: insertErr } = await supabase
          .from('attendance')
          .upsert(absentRows, { onConflict: 'session_id,student_id', ignoreDuplicates: true });

        if (insertErr) console.error('Absent pre-fill failed:', insertErr.message);
      }
    }

    res.json(session);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// all sessions of teacher
router.get('/teacher/:teacher_id', authMiddleware, async (req, res) => {
  const { teacher_id } = req.params;
  try {
    const { data, error } = await supabase
      .from('sessions')
      .select('*, subjects(name, code), rooms(name)')
      .eq('teacher_id', teacher_id)
      .order('created_at', { ascending: false });

    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/all', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
  try {
    const { data, error } = await supabase
      .from('sessions')
      .select('*, subjects(name), users!sessions_teacher_id_fkey(name)')
      .order('created_at', { ascending: false })
      .limit(5);
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/subjects', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('subjects')
      .select('*');
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/rooms', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('rooms')
      .select('*');
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Room add (for admin)
router.post('/rooms/add', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
  const { name, type, latitude, longitude, radius_meters } = req.body;
  try {
    const { data, error } = await supabase
      .from('rooms')
      .insert({
        name: name.trim(),
        type: type || 'Classroom',
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        radius_meters: parseInt(radius_meters),
      })
      .select()
      .single();
    if (error) return res.status(400).json({ error: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Room delete (for admin)
router.delete('/rooms/:id', authMiddleware, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin only' });
  try {
    const { error } = await supabase
      .from('rooms')
      .delete()
      .eq('id', req.params.id);
    if (error) return res.status(400).json({ error: error.message });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/end/:session_id', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('sessions')
      .update({ is_active: false })
      .eq('id', req.params.session_id)
      .select()
      .single();

    if (error) return res.status(400).json({ error: error.message });
    res.json({ success: true, session: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
