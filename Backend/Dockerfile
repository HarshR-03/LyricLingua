# backend/Dockerfile

# 1️ Base image
FROM python:3.10-alpine

# 2️ Set working directory inside container
WORKDIR /app

# 3️ Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 4️ Copy project files
COPY . .

# 5️ Collect static files (optional)
# RUN python manage.py collectstatic --noinput

# 6️ Run server
CMD ["uvicorn", "Backend.asgi:application", "--host", "0.0.0.0", "--port", "8000"]