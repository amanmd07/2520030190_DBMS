const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const { Kafka } = require('kafkajs');

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/smart_events_notifications';
const KAFKA_BROKER = process.env.KAFKA_BOOTSTRAP_SERVERS || 'localhost:9092';

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB for Notifications'))
  .catch(err => console.error('MongoDB connection error:', err));

// Basic notification model
const notificationSchema = new mongoose.Schema({
  userId: Number,
  title: String,
  message: String,
  type: String,
  createdAt: { type: Date, default: Date.now }
});
const Notification = mongoose.model('Notification', notificationSchema);

app.get('/notifications/:userId', async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/notifications', async (req, res) => {
  try {
    const newNotification = new Notification(req.body);
    const saved = await newNotification.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Kafka Consumer (CO5)
const kafka = new Kafka({
  clientId: 'notification-service',
  brokers: [KAFKA_BROKER]
});

const consumer = kafka.consumer({ groupId: 'notification-group' });

const runKafka = async () => {
  try {
    await consumer.connect();
    await consumer.subscribe({ topic: 'booking-events', fromBeginning: true });
    console.log('Connected to Kafka and listening to booking-events');

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const value = message.value.toString();
        console.log(`Received Kafka message: ${value}`);
        try {
          const event = JSON.parse(value);
          if (event.type === 'BOOKING_CREATED') {
            const newNotif = new Notification({
              userId: event.userId,
              title: 'Booking Confirmed!',
              message: `Your booking for event ID ${event.eventId} is successful.`,
              type: 'BOOKING'
            });
            await newNotif.save();
            console.log('Notification saved to MongoDB');
          }
        } catch (e) {
          console.error('Error processing Kafka message:', e);
        }
      },
    });
  } catch (e) {
    console.error('Failed to connect to Kafka (this is expected if Kafka is not running locally).');
  }
};

runKafka();

app.listen(PORT, () => {
  console.log(`Notification service listening on port ${PORT}`);
});