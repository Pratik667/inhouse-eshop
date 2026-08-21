import { Request, Response } from 'express';
import mongoose from 'mongoose';
import FlightSubscription from '../models/flightSubscriptionModel';

const IATA_PATTERN = /^[A-Za-z]{3}$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const getString = (value: unknown): string =>
  typeof value === 'string' ? value : '';

const isNonNegativeNumber = (value: unknown): boolean =>
  typeof value === 'number' && Number.isFinite(value) && value >= 0;

const getCheapestPrice = (flightResponse: any): number | undefined => {
  const flights = [
    ...(Array.isArray(flightResponse?.best_flights)
      ? flightResponse.best_flights
      : []),
    ...(Array.isArray(flightResponse?.other_flights)
      ? flightResponse.other_flights
      : []),
  ];
  const prices = flights
    .map((flight) => flight?.price)
    .filter(isNonNegativeNumber);

  return prices.length > 0 ? Math.min(...prices) : undefined;
};

export const subscribeToFlight = async (
  req: Request,
  res: Response
): Promise<any> => {
  const {
    from,
    to,
    date,
    currentPrice,
    targetPrice,
    currency = 'INR',
  } = req.body;
  const origin = getString(from).toUpperCase();
  const destination = getString(to).toUpperCase();

  if (!IATA_PATTERN.test(origin) || !IATA_PATTERN.test(destination)) {
    return res.status(400).json({ message: 'from and to must be 3-letter airport codes' });
  }

  if (!DATE_PATTERN.test(date)) {
    return res.status(400).json({ message: 'date must use YYYY-MM-DD format' });
  }

  if (currentPrice !== undefined && !isNonNegativeNumber(currentPrice)) {
    return res.status(400).json({ message: 'currentPrice must be a non-negative number' });
  }

  if (targetPrice !== undefined && !isNonNegativeNumber(targetPrice)) {
    return res.status(400).json({ message: 'targetPrice must be a non-negative number' });
  }

  const apiKey = process.env.SERP_API_KEY || process.env.SERPAPI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ message: 'SerpApi configuration is missing' });
  }

  try {
    const searchParams = new URLSearchParams({
      engine: 'google_flights',
      type: '2',
      departure_id: origin,
      arrival_id: destination,
      outbound_date: date,
      currency: getString(currency).toUpperCase(),
      gl: 'in',
      hl: 'en',
      api_key: apiKey,
    });
    const flightResponse = await fetch(
      `https://serpapi.com/search.json?${searchParams.toString()}`
    );
    const responseData = await flightResponse.json();

    if (!flightResponse.ok) {
      return res.status(502).json({
        message: 'Unable to fetch flights from SerpApi',
        error: responseData?.error || 'SerpApi request failed',
      });
    }

    const subscription = await FlightSubscription.create({
      origin,
      destination,
      departureDate: new Date(`${date}T00:00:00.000Z`),
      currentPrice: getCheapestPrice(responseData) ?? currentPrice,
      targetPrice,
      currency: getString(currency).toUpperCase(),
      flightResponse: responseData,
      lastCheckedAt: new Date(),
    });

    return res.status(201).json({
      message: 'Flight subscription created successfully',
      subscription,
    });
  } catch (error: any) {
    console.error('Error creating flight subscription:', error);
    return res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};

export const getFlightSubscriptions = async (
  _req: Request,
  res: Response
): Promise<any> => {
  try {
    const subscriptions = await FlightSubscription.find({
      isActive: true,
    }).sort({ createdAt: -1 });

    return res.status(200).json(subscriptions);
  } catch (error: any) {
    console.error('Error fetching flight subscriptions:', error);
    return res.status(500).json({
      message: 'Server error',
      error: error.message,
    });
  }
};
