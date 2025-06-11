import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

declare global {
  namespace Express {
    interface Request {
      accessToken?: string | null;
      user?: any;
    }
  }
}

// Removes 'Bearer' from token
const accessTokenExtractor = (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    request.accessToken = authorization.replace("Bearer ", "");
  } else {
    request.accessToken = null;
  }

  next();
};

const apiRequestLog = (req: Request, res: Response, next: NextFunction) => {
  console.log("Request Method:", req.method);
  console.log("Request URL:", req.originalUrl);
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);

  next();
};

const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.log("--- [DEBUG] Inside authenticateToken ---");

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    console.log("[DEBUG] FAILED: No token provided.");
    res.sendStatus(401);
    return;
  }

  console.log("[DEBUG] Token found. Verifying...");

  // Ensure the secret is loaded to prevent crashes
  if (!process.env.ACCESS_TOKEN_SECRET) {
    console.error("[FATAL] ACCESS_TOKEN_SECRET is not defined!");
    res.status(500).send("Server configuration error: JWT Secret is missing.");
    return;
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err: any, user: any) => {
    if (err) {
      console.error("[DEBUG] FAILED: JWT verification error!", err);
      res.sendStatus(403);
      return;
    }

    console.log("[DEBUG] SUCCESS: JWT is valid. Calling next().");
    req.user = user;
    next();
  });
};

export { authenticateToken, apiRequestLog };
