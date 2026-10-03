from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from .. import models, schemas
from ..dependencies.auth_deps import get_current_user

router = APIRouter()

@router.post("/", response_model=schemas.BookingResponse, status_code=status.HTTP_201_CREATED)
def create_booking(
    booking_in: schemas.BookingCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # CO1 Transaction handling
    try:
        # Check event
        event = db.query(models.Event).filter(models.Event.event_id == booking_in.event_id).first()
        if not event:
            raise HTTPException(status_code=404, detail="Event not found")

        subtotal = 0.0

        # Calculate subtotal and verify inventory
        for item in booking_in.details:
            ticket = db.query(models.TicketType).filter(models.TicketType.ticket_type_id == item.ticket_type_id).first()
            if not ticket or ticket.available_quantity < item.quantity:
                raise HTTPException(status_code=400, detail=f"Not enough tickets available for {ticket.ticket_name if ticket else 'unknown'}")

            subtotal += float(ticket.price) * item.quantity

            # If seat is selected, check if available
            if item.seat_id:
                seat = db.query(models.Seat).filter(models.Seat.seat_id == item.seat_id, models.Seat.status == models.SeatStatus.AVAILABLE).first()
                if not seat:
                    raise HTTPException(status_code=400, detail="One or more selected seats are not available")

        convenience_fee = subtotal * 0.05 # 5% fee
        total_amount = subtotal + convenience_fee

        # Create Booking
        db_booking = models.Booking(
            user_id=current_user.user_id,
            event_id=booking_in.event_id,
            subtotal=subtotal,
            convenience_fee=convenience_fee,
            total_amount=total_amount,
            booking_status=models.BookingStatus.PENDING # Will be confirmed upon payment
        )
        db.add(db_booking)
        db.flush() # Get booking ID

        # Create Booking Details
        for item in booking_in.details:
            ticket = db.query(models.TicketType).filter(models.TicketType.ticket_type_id == item.ticket_type_id).first()
            detail = models.BookingDetail(
                booking_id=db_booking.booking_id,
                ticket_type_id=item.ticket_type_id,
                seat_id=item.seat_id,
                quantity=item.quantity,
                unit_price=ticket.price,
                subtotal=float(ticket.price) * item.quantity
            )
            db.add(detail)

        db.commit()
        db.refresh(db_booking)

        # In a real microservice, we would publish a Kafka event here:
        # kafka_producer.send('BOOKING_CREATED', value=db_booking.booking_id)

        return db_booking

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/", response_model=List[schemas.BookingResponse])
def get_user_bookings(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    bookings = db.query(models.Booking).filter(models.Booking.user_id == current_user.user_id).all()
    return bookings