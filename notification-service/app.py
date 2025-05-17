from fastapi import FastAPI
import pika
import pymongo
import threading
import json

app = FastAPI()

# Connect to MongoDB
client = pymongo.MongoClient("mongodb://localhost:27017/")
db = client["notificationservicedb"]


# Function to process messages from RabbitMQ
def callback(ch, method, properties, body):
    try:
        message_data = json.loads(body.decode())  # Convert JSON string to dictionary
        
        # Store notification in MongoDB
        db.notifications.insert_one({
            "booking_id": message_data["booking_id"],
            "user_id": message_data["user_id"],
            "event_id": message_data["event_id"],
            "status": message_data["status"],
            "message": f"Booking {message_data['booking_id']} confirmed"
        })
        
        print(f"✅ Stored Notification: {message_data}")

    except Exception as e:
        print(f"❌ Error processing message: {e}")

# Start RabbitMQ Consumer in a separate thread
def start_rabbitmq():
    try:
        connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
        channel = connection.channel()
        channel.queue_declare(queue='notification_queue')
        channel.basic_consume(queue='notification_queue', on_message_callback=callback, auto_ack=True)
        print(" [*] Waiting for messages...")
        channel.start_consuming()
    except Exception as e:
        print(f"❌ RabbitMQ error: {e}")

threading.Thread(target=start_rabbitmq, daemon=True).start()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3004)
