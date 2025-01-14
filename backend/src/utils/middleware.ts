import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

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

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  // ensure that token is present; split 'Bearer' prefix off
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    res.sendStatus(401);
    return;
  }
  // verify token
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

export { authenticateToken };
