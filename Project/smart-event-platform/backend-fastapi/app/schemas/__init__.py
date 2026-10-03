from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import date, time, datetime
from ..models import UserRole, EventStatus, BookingStatus, SeatStatus

# -----------------
# User Schemas
# -----------------
class UserBase(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    city: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    user_id: int
    role: UserRole
    created_at: datetime

    class Config:
        from_attributes = True

# -----------------
# Event Schemas
# -----------------
class EventBase(BaseModel):
    event_name: str
    description: Optional[str] = None
    date: date
    start_time: time
    end_time: Optional[time] = None
    image_url: Optional[str] = None
    status: EventStatus = EventStatus.DRAFT

class EventCreate(EventBase):
    category_id: int
    venue_id: int

class EventResponse(EventBase):
    event_id: int
    category_id: int
    venue_id: int
    organizer_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# -----------------
# Ticket Schemas
# -----------------
class TicketTypeBase(BaseModel):
    ticket_name: str
    price: float
    total_quantity: int

class TicketTypeCreate(TicketTypeBase):
    pass

class TicketTypeResponse(TicketTypeBase):
    ticket_type_id: int
    event_id: int
    available_quantity: int

    class Config:
        from_attributes = True

# -----------------
# Booking Schemas
# -----------------
class BookingDetailCreate(BaseModel):
    ticket_type_id: int
    seat_id: Optional[int] = None
    quantity: int = Field(gt=0)

class BookingCreate(BaseModel):
    event_id: int
    details: List[BookingDetailCreate]

class BookingResponse(BaseModel):
    booking_id: int
    user_id: int
    event_id: int
    booking_date: datetime
    subtotal: float
    convenience_fee: float
    total_amount: float
    booking_status: BookingStatus

    class Config:
        from_attributes = True