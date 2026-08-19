import { Request, Response } from 'express';
import mongoose from 'mongoose';

export const getHealth = async (req: Request, res: Response): Promise<any> => {
  const uptime = process.uptime();
  const dbState = mongoose.connection.readyState; // 0 disconnected, 1 connected, 2 connecting, 3 disconnecting
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];

  return res.status(200).json({
    status: 'ok',
    uptime,
    timestamp: new Date().toISOString(),
    db: states[dbState] || dbState,
  });
};
