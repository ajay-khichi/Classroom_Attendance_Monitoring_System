import React from 'react';

export default function DashboardTab({ stats, departments, students, stuAttendance, recentActivity, user, today }) {
  return (
    <div className="fade-in">
      {/* Top Banner Area */}
      <div style={{ background: 'var(--topbar-gradient)', padding: '32px 32px 48px', color: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '4px' }}>
              Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening'}, {user?.name?.split(' ')[0] || 'Admin'}!
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', opacity: 0.9 }}>
              <span>📅 {today}</span>
            </div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', padding: '6px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>🛡️</span> Admin
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', padding: '20px', borderRadius: '12px' }}>
            <div style={{ fontSize: '13px', opacity: 0.8 }}>Total Students</div>
            <div style={{ fontSize: '28px', fontWeight: '700', margin: '4px 0' }}>{stats.students}</div>
            <div style={{ fontSize: '11px', opacity: 0.7 }}>Registered students</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', padding: '20px', borderRadius: '12px' }}>
            <div style={{ fontSize: '13px', opacity: 0.8 }}>Total Faculties</div>
            <div style={{ fontSize: '28px', fontWeight: '700', margin: '4px 0' }}>{stats.teachers}</div>
            <div style={{ fontSize: '11px', opacity: 0.7 }}>Active teaching staff</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', padding: '20px', borderRadius: '12px' }}>
            <div style={{ fontSize: '13px', opacity: 0.8 }}>Total Rooms</div>
            <div style={{ fontSize: '28px', fontWeight: '700', margin: '4px 0' }}>{stats.rooms}</div>
            <div style={{ fontSize: '11px', opacity: 0.7 }}>Classrooms + Labs</div>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', padding: '20px', borderRadius: '12px' }}>
            <div style={{ fontSize: '13px', opacity: 0.8 }}>Avg. Attendance</div>
            <div style={{ fontSize: '28px', fontWeight: '700', margin: '4px 0' }}>{stats.avg}%</div>
            <div style={{ fontSize: '11px', opacity: 0.7 }}>Overall average</div>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 32px 32px', marginTop: '-24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="card">
          <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '16px' }}>Department-wise Attendance</div>
          {departments.map(d => {
            const deptStudents = students.filter(st => st.department_id === d.id);
            let totalPct = 0; let count = 0;
            deptStudents.forEach(st => {
              const pct = stuAttendance[st.id];
              if (pct !== null && pct !== undefined) { totalPct += pct; count++; }
            });
            const pct = count > 0 ? Math.round(totalPct / count) : 0;
            return (
              <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', width: '60px', flexShrink: 0 }}>{d.code}</div>
                <div style={{ flex: 1, height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: deptStudents.length === 0 ? 'var(--border)' : 'var(--primary)', borderRadius: '4px', transition: 'width 0.5s ease-out' }} />
                </div>
                <div style={{ fontSize: '12px', fontWeight: '500', width: '36px', textAlign: 'right' }}>
                  {deptStudents.length === 0 ? '—' : `${pct}%`}
                </div>
              </div>
            );
          })}
          {departments.length === 0 && <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No departments data</div>}
        </div>
        <div className="card">
          <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '16px' }}>Recent Class Activity</div>
          {recentActivity.map((a, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px 0', borderBottom: i < recentActivity.length - 1 ? '1px solid var(--border)' : 'none' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: a.is_active ? 'var(--success)' : 'var(--warning)', marginTop: '6px', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '13px', color: 'var(--text-main)' }}>
                  <span style={{fontWeight: 600}}>{a.users?.name || 'Class'}</span> started session for <strong>{a.subjects?.name || 'Subject'}</strong>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {new Date(a.created_at).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          {recentActivity.length === 0 && <div style={{ fontSize: '13px', color: 'var(--text-muted)', padding: '10px 0' }}>No recent activity.</div>}
        </div>
      </div>
      </div>
    </div>
  );
}
