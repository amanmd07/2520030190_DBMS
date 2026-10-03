-- ==============================================================================
-- SMART EVENT MANAGEMENT PLATFORM - PostgreSQL Schema Initialization
-- ==============================================================================

-- Create Enums for Statuses and Roles
CREATE TYPE user_role AS ENUM ('USER', 'ORGANIZER', 'ADMIN');
CREATE TYPE event_status AS ENUM ('DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED');
CREATE TYPE seat_status AS ENUM ('AVAILABLE', 'SELECTED', 'RESERVED', 'SOLD');
CREATE TYPE booking_status AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'REFUNDED');
CREATE TYPE payment_status AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED');

-- ==========================================
-- 1. USERS TABLE
-- ==========================================
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'USER',
    city VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- 2. CATEGORIES TABLE
-- ==========================================
CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT
);

-- ==========================================
-- 3. VENUES TABLE
-- ==========================================
CREATE TABLE venues (
    venue_id SERIAL PRIMARY KEY,
    venue_name VARCHAR(255) NOT NULL,
    location TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    capacity INTEGER CHECK (capacity > 0)
);

-- ==========================================
-- 4. EVENTS TABLE
-- ==========================================
CREATE TABLE events (
    event_id SERIAL PRIMARY KEY,
    event_name VARCHAR(255) NOT NULL,
    description TEXT,
    category_id INTEGER REFERENCES categories(category_id) ON DELETE SET NULL,
    venue_id INTEGER REFERENCES venues(venue_id) ON DELETE RESTRICT,
    organizer_id INTEGER REFERENCES users(user_id) ON DELETE RESTRICT,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME,
    image_url TEXT,
    status event_status DEFAULT 'DRAFT',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for searching events by city, category, and date
CREATE INDEX idx_events_date ON events(date);
CREATE INDEX idx_events_category ON events(category_id);

-- ==========================================
-- 5. TICKET_TYPES TABLE
-- ==========================================
CREATE TABLE ticket_types (
    ticket_type_id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(event_id) ON DELETE CASCADE,
    ticket_name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
    total_quantity INTEGER NOT NULL CHECK (total_quantity > 0),
    available_quantity INTEGER NOT NULL CHECK (available_quantity >= 0),
    CONSTRAINT check_quantity_validity CHECK (available_quantity <= total_quantity)
);

-- ==========================================
-- 6. SEATS TABLE (For Mode 2: Seat Selection)
-- ==========================================
CREATE TABLE seats (
    seat_id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(event_id) ON DELETE CASCADE,
    section VARCHAR(50),
    row_name VARCHAR(10),
    seat_number VARCHAR(10),
    status seat_status DEFAULT 'AVAILABLE',
    UNIQUE(event_id, section, row_name, seat_number)
);

-- ==========================================
-- 7. BOOKINGS TABLE
-- ==========================================
CREATE TABLE bookings (
    booking_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE RESTRICT,
    event_id INTEGER REFERENCES events(event_id) ON DELETE RESTRICT,
    booking_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0),
    convenience_fee DECIMAL(10, 2) NOT NULL CHECK (convenience_fee >= 0),
    total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount >= 0),
    booking_status booking_status DEFAULT 'PENDING'
);

-- ==========================================
-- 8. BOOKING_DETAILS TABLE
-- ==========================================
CREATE TABLE booking_details (
    booking_detail_id SERIAL PRIMARY KEY,
    booking_id INTEGER REFERENCES bookings(booking_id) ON DELETE CASCADE,
    ticket_type_id INTEGER REFERENCES ticket_types(ticket_type_id) ON DELETE RESTRICT,
    seat_id INTEGER REFERENCES seats(seat_id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL CHECK (unit_price >= 0),
    subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0)
);

-- ==========================================
-- 9. PAYMENTS TABLE
-- ==========================================
CREATE TABLE payments (
    payment_id SERIAL PRIMARY KEY,
    booking_id INTEGER REFERENCES bookings(booking_id) ON DELETE CASCADE,
    payment_method VARCHAR(50) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 0),
    transaction_id VARCHAR(255) UNIQUE,
    payment_status payment_status DEFAULT 'PENDING',
    paid_at TIMESTAMP WITH TIME ZONE
);

-- ==========================================
-- 10. REVIEWS TABLE
-- ==========================================
CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    event_id INTEGER REFERENCES events(event_id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, event_id)
);

-- ==========================================
-- 11. FAVORITES TABLE
-- ==========================================
CREATE TABLE favorites (
    favorite_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    event_id INTEGER REFERENCES events(event_id) ON DELETE CASCADE,
    UNIQUE(user_id, event_id)
);

-- ==========================================
-- 12. NOTIFICATIONS TABLE
-- ==========================================
CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================================
-- DATABASE ENGINEERING: VIEWS & TRIGGERS (CO1)
-- ==============================================================================

-- VIEW 1: Event Sales View
CREATE OR REPLACE VIEW event_sales_view AS
SELECT
    e.event_id,
    e.event_name,
    COUNT(DISTINCT b.booking_id) as total_bookings,
    SUM(bd.quantity) as tickets_sold,
    SUM(b.total_amount) as total_revenue
FROM events e
LEFT JOIN bookings b ON e.event_id = b.event_id AND b.booking_status = 'CONFIRMED'
LEFT JOIN booking_details bd ON b.booking_id = bd.booking_id
GROUP BY e.event_id, e.event_name;

-- VIEW 2: Booking Summary View
CREATE OR REPLACE VIEW booking_summary_view AS
SELECT
    b.booking_id,
    b.user_id,
    u.name as user_name,
    u.email,
    e.event_name,
    e.date as event_date,
    v.venue_name,
    b.booking_status,
    b.total_amount,
    p.payment_status
FROM bookings b
JOIN users u ON b.user_id = u.user_id
JOIN events e ON b.event_id = e.event_id
JOIN venues v ON e.venue_id = v.venue_id
LEFT JOIN payments p ON b.booking_id = p.booking_id;

-- TRIGGER FUNCTION: Update ticket availability after booking
CREATE OR REPLACE FUNCTION update_ticket_availability()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.booking_status = 'CONFIRMED' AND (OLD.booking_status = 'PENDING' OR OLD.booking_status IS NULL) THEN
        -- Decrease availability
        UPDATE ticket_types
        SET available_quantity = available_quantity - (
            SELECT SUM(quantity)
            FROM booking_details
            WHERE booking_id = NEW.booking_id AND ticket_type_id = ticket_types.ticket_type_id
        )
        WHERE ticket_type_id IN (
            SELECT ticket_type_id
            FROM booking_details
            WHERE booking_id = NEW.booking_id
        );

        -- Update seat status to SOLD
        UPDATE seats
        SET status = 'SOLD'
        WHERE seat_id IN (
            SELECT seat_id
            FROM booking_details
            WHERE booking_id = NEW.booking_id AND seat_id IS NOT NULL
        );
    END IF;

    -- Handle cancellations
    IF NEW.booking_status = 'CANCELLED' AND OLD.booking_status = 'CONFIRMED' THEN
        -- Restore availability
        UPDATE ticket_types
        SET available_quantity = available_quantity + (
            SELECT SUM(quantity)
            FROM booking_details
            WHERE booking_id = NEW.booking_id AND ticket_type_id = ticket_types.ticket_type_id
        )
        WHERE ticket_type_id IN (
            SELECT ticket_type_id
            FROM booking_details
            WHERE booking_id = NEW.booking_id
        );

        -- Update seat status to AVAILABLE
        UPDATE seats
        SET status = 'AVAILABLE'
        WHERE seat_id IN (
            SELECT seat_id
            FROM booking_details
            WHERE booking_id = NEW.booking_id AND seat_id IS NOT NULL
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_ticket_availability
AFTER UPDATE OF booking_status ON bookings
FOR EACH ROW
EXECUTE FUNCTION update_ticket_availability();

-- TRIGGER FUNCTION: Update timestamps
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_user_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();
