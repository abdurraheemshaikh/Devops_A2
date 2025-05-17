from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import psycopg2
import pika
import json
import requests

app = FastAPI()

# ✅ CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

# ✅ Database connection for bookings
try:
    booking_conn = psycopg2.connect(
        database="bookingdb",
        user="postgres",
        password="678678",
        host="localhost",
        port="5432"
    )
    booking_cur = booking_conn.cursor()
    print("✅ Connected to bookingdb")
except Exception as e:
    print(f"❌ Error connecting to bookingdb: {e}")

# ✅ Database connection for users
try:
    user_conn = psycopg2.connect(
        database="userdb",
        user="postgres",
        password="678678",
        host="localhost",
        port="5432"
    )
    user_cur = user_conn.cursor()
    print("✅ Connected to userdb")
except Exception as e:
    print(f"❌ Error connecting to userdb: {e}")

# ✅ Define Pydantic Model for Booking Request
class BookingRequest(BaseModel):
    user_id: int
    event_id: int
    tickets: int

@app.get("/events/{event_id}/availability")
def check_event_availability(event_id: int):
    try:
        response = requests.get("http://localhost:3002/events", timeout=5)
        response.raise_for_status()
        events = response.json()

        event = next((e for e in events if e["event_id"] == event_id), None)
        if event:
            return {"event_id": event_id, "available_tickets": event["available_tickets"], "price_per_ticket": event["price"]}

        raise HTTPException(status_code=404, detail="Event not found")

    except requests.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Error fetching event details: {str(e)}")

@app.post("/bookings")
def create_booking(request: BookingRequest):  
    try:
        print("📌 Received Booking Request:", request.dict())

        # ✅ Check if user exists
        try:
            user_cur.execute('SELECT user_id FROM public.users WHERE user_id = %s', (request.user_id,))
            user = user_cur.fetchone()
            if not user:
                raise HTTPException(status_code=404, detail="User does not exist")
        except Exception as e:
            print(f"❌ Database error while checking user: {e}")
            raise HTTPException(status_code=500, detail="Database error")

        # ✅ Check Event Availability
        try:
            response = requests.get("http://localhost:3002/events", timeout=5)
            response.raise_for_status()
            events = response.json()
            event = next((e for e in events if e["event_id"] == request.event_id), None)

            if not event:
                raise HTTPException(status_code=404, detail="Event not found")
            
            if event["available_tickets"] < request.tickets:
                raise HTTPException(status_code=400, detail="Not enough tickets available")

            price_per_ticket = event["price"]
            total_payment = price_per_ticket * request.tickets

        except requests.RequestException as e:
            print(f"❌ Event service error: {e}")
            raise HTTPException(status_code=500, detail="Error checking event availability")

        # ✅ Insert booking into database with `payment_amount`
        try:
            booking_cur.execute(
                '''INSERT INTO bookings (user_id, event_id, tickets, payment_amount, status) 
                   VALUES (%s, %s, %s, %s, %s) 
                   RETURNING booking_id''',
                (request.user_id, request.event_id, request.tickets, total_payment, "CONFIRMED")
            )

            booking_data = booking_cur.fetchone()
            if not booking_data:
                raise HTTPException(status_code=500, detail="Booking failed")
            
            booking_id = booking_data[0]
            booking_conn.commit()
            print(f"📌 Booking {booking_id} inserted successfully!")
        except Exception as e:
            print(f"❌ Database error while inserting booking: {e}")
            booking_conn.rollback()
            raise HTTPException(status_code=500, detail="Database error while inserting booking")

        # ✅ Decrease Available Tickets in Event Database
        try:
            update_response = requests.patch(
                f"http://localhost:3002/events/{request.event_id}/book", 
                json={"tickets": request.tickets}
            )
            update_response.raise_for_status()
            print(f"📌 Tickets updated in event database for Event ID: {request.event_id}")
        except requests.RequestException as e:
            print(f"❌ Error updating event tickets: {e}")
            raise HTTPException(status_code=500, detail="Error updating event tickets")

        # ✅ Send Notification to RabbitMQ
        try:
            connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
            channel = connection.channel()
            channel.queue_declare(queue='notification_queue')
            message = json.dumps({
                "booking_id": booking_id,
                "user_id": request.user_id,
                "event_id": request.event_id,
                "tickets": request.tickets,
                "payment_amount": total_payment,
                "status": "CONFIRMED"
            })
            channel.basic_publish(exchange='', routing_key='notification_queue', body=message)
            channel.close()  # ✅ Ensure RabbitMQ channel closes
            print("📌 Notification sent to RabbitMQ")
        except Exception as e:
            print(f"❌ RabbitMQ error: {e}")

        return {"message": f"Booking {booking_id} confirmed, tickets updated, and notification sent"}

    except HTTPException as http_err:
        print("❌ HTTP Error:", http_err)
        raise http_err  # Re-raise HTTP exceptions

    except Exception as e:
        print("❌ Unexpected Error:", str(e))
        raise HTTPException(status_code=500, detail="An unexpected error occurred")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3003)
