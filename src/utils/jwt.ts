import jwt from "jsonwebtoken";
import crypto from "crypto";
import "dotenv/config";

const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET!;

const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET!;

export function generateAccessToken(
  payload: {
    userId: string;
    email: string;
    role: string;
  }
) {
  return jwt.sign(
    payload,
    ACCESS_TOKEN_SECRET,
    {
      expiresIn: "15m",
    }
  );
}

export function generateRefreshToken(
  payload: {
    userId: string;
  }
) {
  return jwt.sign(
    payload,
    REFRESH_TOKEN_SECRET,
    {
      expiresIn: "7d",
      jwtid: crypto.randomUUID(),
    }
  );
}

export function verifyAccessToken(
  token: string
) {
  return jwt.verify(
    token,
    ACCESS_TOKEN_SECRET
  );
}

export function verifyRefreshToken(
  token: string
) {
  return jwt.verify(
    token,
    REFRESH_TOKEN_SECRET
  );
}