import { Request } from "express";

export interface IGetUserAuthInfoRequest extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
    team: string;
  };
}

