-- Seed data for Smart Event Platform

-- 1. Create Demo Users
INSERT INTO users (name, email, phone, password_hash, role, city) VALUES
('System Admin', 'admin@example.com', '1234567890', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'ADMIN', 'Hyderabad'),
('Event Organizer', 'organizer@example.com', '0987654321', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'ORGANIZER', 'Bangalore'),
('Regular User', 'user@example.com', '1122334455', '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', 'USER', 'Mumbai');
-- Note: Password hash is a generic placeholder for 'Password123' (bcrypt)

-- 2. Create Categories
INSERT INTO categories (category_name, description) VALUES
('Music', 'Concerts, festivals, and live music'),
('Technology', 'Tech conferences, hackathons, and meetups'),
('Sports', 'Local and international sports tournaments'),
('Comedy', 'Stand-up comedy and improv shows'),
('Education', 'Workshops, seminars, and bootcamps'),
('Business', 'Networking, startup pitches, and corporate events');

-- 3. Create Venues
INSERT INTO venues (venue_name, location, city, capacity) VALUES
('KL Convention Hall', 'Plot 4, Tech Park Road', 'Hyderabad', 2000),
('City Auditorium', 'MG Road', 'Bangalore', 500),
('Tech Park Arena', 'Phase 1, Cyber City', 'Pune', 1500),
('University Ground', 'Main Campus', 'Delhi', 5000);

-- 4. Create Sample Events (Assuming Organizer ID is 2)
INSERT INTO events (event_name, description, category_id, venue_id, organizer_id, date, start_time, end_time, status) VALUES
('Live Music Night', 'Experience the best local bands live.', 1, 2, 2, CURRENT_DATE + INTERVAL '10 days', '19:00:00', '23:00:00', 'PUBLISHED'),
('AI Innovation Summit', 'Explore the future of Artificial Intelligence.', 2, 1, 2, CURRENT_DATE + INTERVAL '15 days', '09:00:00', '18:00:00', 'PUBLISHED'),
('University Football Cup', 'Inter-college football championship finals.', 3, 4, 2, CURRENT_DATE + INTERVAL '5 days', '16:00:00', '20:00:00', 'PUBLISHED'),
('Stand-up Comedy Night', 'Laugh out loud with top comedians.', 4, 2, 2, CURRENT_DATE + INTERVAL '2 days', '20:00:00', '22:30:00', 'PUBLISHED');

-- 5. Create Ticket Types for Events
-- For Event 1: Live Music Night
INSERT INTO ticket_types (event_id, ticket_name, price, total_quantity, available_quantity) VALUES
(1, 'Regular', 199.00, 300, 300),
(1, 'VIP', 799.00, 50, 50);

-- For Event 2: AI Summit
INSERT INTO ticket_types (event_id, ticket_name, price, total_quantity, available_quantity) VALUES
(2, 'Early Bird', 999.00, 100, 100),
(2, 'Standard', 1499.00, 1500, 1500);

-- 6. Generate Seats for a Seated Event (e.g., Stand-up Comedy, Event 4)
INSERT INTO seats (event_id, section, row_name, seat_number)
SELECT 4, 'Balcony', 'A', generate_series(1, 20)::varchar;

INSERT INTO seats (event_id, section, row_name, seat_number)
SELECT 4, 'Stalls', 'B', generate_series(1, 50)::varchar;