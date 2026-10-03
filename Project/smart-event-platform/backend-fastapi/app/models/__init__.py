import enum
from sqlalchemy import Column, Integer, String, Text, ForeignKey, Numeric, DateTime, Date, Time, Enum, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base

class UserRole(str, enum.Enum):
    USER = "USER"
    ORGANIZER = "ORGANIZER"
    ADMIN = "ADMIN"

class EventStatus(str, enum.Enum):
    DRAFT = "DRAFT"
    PUBLISHED = "PUBLISHED"
    CANCELLED = "CANCELLED"
    COMPLETED = "COMPLETED"

class SeatStatus(str, enum.Enum):
    AVAILABLE = "AVAILABLE"
    SELECTED = "SELECTED"
    RESERVED = "RESERVED"
    SOLD = "SOLD"

class BookingStatus(str, enum.Enum):
    PENDING = "PENDING"
    CONFIRMED = "CONFIRMED"
    CANCELLED = "CANCELLED"
    REFUNDED = "REFUNDED"

class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    phone = Column(String(20))
    password_hash = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), default=UserRole.USER)
    city = Column(String(100))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    events = relationship("Event", back_populates="organizer")
    bookings = relationship("Booking", back_populates="user")

class Category(Base):
    __tablename__ = "categories"

    category_id = Column(Integer, primary_key=True, index=True)
    category_name = Column(String(100), unique=True, nullable=False)
    description = Column(Text)

    events = relationship("Event", back_populates="category")

class Venue(Base):
    __tablename__ = "venues"

    venue_id = Column(Integer, primary_key=True, index=True)
    venue_name = Column(String(255), nullable=False)
    location = Column(Text, nullable=False)
    city = Column(String(100), nullable=False)
    capacity = Column(Integer)

    events = relationship("Event", back_populates="venue")

class Event(Base):
    __tablename__ = "events"

    event_id = Column(Integer, primary_key=True, index=True)
    event_name = Column(String(255), nullable=False)
    description = Column(Text)
    category_id = Column(Integer, ForeignKey("categories.category_id"))
    venue_id = Column(Integer, ForeignKey("venues.venue_id"))
    organizer_id = Column(Integer, ForeignKey("users.user_id"))
    date = Column(Date, nullable=False)
    start_time = Column(Time, nullable=False)
    end_time = Column(Time)
    image_url = Column(Text)
    status = Column(Enum(EventStatus), default=EventStatus.DRAFT)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    category = relationship("Category", back_populates="events")
    venue = relationship("Venue", back_populates="events")
    organizer = relationship("User", back_populates="events")
    ticket_types = relationship("TicketType", back_populates="event")
    seats = relationship("Seat", back_populates="event")

class TicketType(Base):
    __tablename__ = "ticket_types"

    ticket_type_id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("events.event_id"))
    ticket_name = Column(String(100), nullable=False)
    price = Column(Numeric(10, 2), nullable=False)
    total_quantity = Column(Integer, nullable=False)
    available_quantity = Column(Integer, nullable=False)

    event = relationship("Event", back_populates="ticket_types")

class Seat(Base):
    __tablename__ = "seats"

    seat_id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("events.event_id"))
    section = Column(String(50))
    row_name = Column(String(10))
    seat_number = Column(String(10))
    status = Column(Enum(SeatStatus), default=SeatStatus.AVAILABLE)

    event = relationship("Event", back_populates="seats")

class Booking(Base):
    __tablename__ = "bookings"

    booking_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"))
    event_id = Column(Integer, ForeignKey("events.event_id"))
    booking_date = Column(DateTime(timezone=True), server_default=func.now())
    subtotal = Column(Numeric(10, 2), nullable=False)
    convenience_fee = Column(Numeric(10, 2), nullable=False)
    total_amount = Column(Numeric(10, 2), nullable=False)
    booking_status = Column(Enum(BookingStatus), default=BookingStatus.PENDING)

    user = relationship("User", back_populates="bookings")
    details = relationship("BookingDetail", back_populates="booking")

class BookingDetail(Base):
    __tablename__ = "booking_details"

    booking_detail_id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.booking_id"))
    ticket_type_id = Column(Integer, ForeignKey("ticket_types.ticket_type_id"))
    seat_id = Column(Integer, ForeignKey("seats.seat_id"), nullable=True)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Numeric(10, 2), nullable=False)
    subtotal = Column(Numeric(10, 2), nullable=False)

    booking = relationship("Booking", back_populates="details")