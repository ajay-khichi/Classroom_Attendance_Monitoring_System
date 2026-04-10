FROM python:3.11-slim

RUN apt-get update && apt-get install -y \
    cmake \
    gcc \
    g++ \
    build-essential \
    libx11-6 \
    libx11-dev \
    libopenblas-dev \
    liblapack-dev \
    libboost-python-dev \
    libboost-thread-dev \
    git \
    && rm -rf /var/lib/apt/lists/*

# CMake upgrade karo — dlib ko 3.5+ chahiye
RUN pip install --no-cache-dir --upgrade cmake pip

WORKDIR /app

COPY requirements.txt .

# dlib latest version install karo (version pin mat karo — cmake conflict hota hai)
RUN pip install --no-cache-dir dlib

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE $PORT

CMD gunicorn -w 4 -b 0.0.0.0:$PORT app:app --timeout 120 --preload
