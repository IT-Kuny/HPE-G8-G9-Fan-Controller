import type { NextApiRequest, NextApiResponse } from "next";
import { withSessionRoute } from "../../../lib/session";

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        res.setHeader("Allow", ["POST"]);
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    const { username, password } = req.body;

    if (
        username === process.env.AUTH_USERNAME &&
        password === process.env.AUTH_PASSWORD
    ) {
        req.session.user = {
            username,
            isLoggedIn: true,
        };
        await req.session.save();
        return res.status(200).json({ message: "ok" });
    }

    return res.status(401).json({ message: "Invalid credentials" });
}

export default withSessionRoute(loginRoute);
