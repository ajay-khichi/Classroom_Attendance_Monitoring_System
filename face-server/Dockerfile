FROM python:3.10-slim
 
# System dependencies (cmake apt se nahi — pip se lenge)
RUN apt-get update && apt-get install -y \
    build-essential \
    gcc \
    g++ \
    libopenblas-dev \
    liblapack-dev \
    libx11-6 \
    libx11-dev \
    libboost-python-dev \
    libboost-thread-dev \
    python3-dev \
    git \
    && rm -rf /var/lib/apt/lists/*
 
WORKDIR /app
 
COPY requirements.txt .
 
# pip + setuptools upgrade
RUN pip install --no-cache-dir --upgrade pip setuptools wheel
 
# cmake latest pip se install karo (3.25+ chahiye dlib ke liye)
RUN pip install --no-cache-dir "cmake>=3.25"
 
# dlib cmake policy fix ke saath install karo
RUN CMAKE_POLICY_VERSION_MINIMUM=3.5 pip install --no-cache-dir dlib
 
# baaki dependencies (requirements.txt mein dlib nahi hona chahiye)
RUN pip install --no-cache-dir -r requirements.txt
 
COPY . .
 
EXPOSE $PORT
 
CMD gunicorn -w 4 -b 0.0.0.0:$PORT app:app --timeout 120 --preload