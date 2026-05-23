import { createClient, type User } from "@supabase/supabase-js";
import type{ NextFunction, Request, Response } from "express";
import { prisma } from "./db";
import { AuthProvider } from "./generated/prisma/client";

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SECRET_KEY!);

export default async function middleware(req: Request, res: Response, next: NextFunction) {
    const accessToken = req.headers.authorization?.split(" ")[1];
    if (!accessToken) {
        console.log("No access token");
        return res.status(401).json({ error: "Unauthorized" });
    }
    const { data, error } = await supabase.auth.getUser(accessToken);
    if (error) {
        return res.status(401).json({ error: "Unauthorized" });
    }
    (req as Request & { userId: string }).userId = data.user.id;
    next();
}

declare global {
    namespace Express {
        interface Request {
            userId: string;
            user: User | null;
        }
    }
}