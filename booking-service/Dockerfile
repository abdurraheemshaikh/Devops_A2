# Use official Python image
FROM python:3.10
#booking-service
# Set working directory inside the container
WORKDIR /app

# Copy the requirements file into the container
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the entire application to the container
COPY . .

# Expose the port FastAPI runs on
EXPOSE 3003

# Command to run the service
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "3003", "--reload"]
