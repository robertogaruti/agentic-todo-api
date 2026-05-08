import type { NextFunction, Request, Response } from "express";
export declare const authenticateRequest: (req: Request, res: Response, next: NextFunction) => void;
export declare const requireAuthenticatedUserId: (req: Request) => string;
