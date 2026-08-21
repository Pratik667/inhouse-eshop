import express from 'express';
import {
  getFlightSubscriptions,
  subscribeToFlight,
} from '../controllers/flightSubscriptionController';

const router = express.Router();

router.post('/subscribe', subscribeToFlight);
router.get('/subscriptions', getFlightSubscriptions);

export default router;
