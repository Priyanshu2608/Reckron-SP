import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-reckron-pharma";

export interface IAdminSession {
  userId: string;
  username: string;
  email: string;
  role: string;
}

export function signToken(payload: IAdminSession): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
}

export function verifyToken(token: string): IAdminSession | null {
  try {
    return jwt.verify(token, JWT_SECRET) as IAdminSession;
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<IAdminSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("admin_session")?.value;
    if (!token) return null;
    return verifyToken(token);
  } catch {
    return null;
  }
}

export async function setAdminSession(session: IAdminSession) {
  const token = signToken(session);
  const cookieStore = await cookies();
  cookieStore.set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24, // 1 day
    path: "/",
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
}
