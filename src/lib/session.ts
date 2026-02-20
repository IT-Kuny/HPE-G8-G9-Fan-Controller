import type { IronSessionOptions } from "iron-session";
import { getIronSession } from "iron-session";
import type {
    NextApiHandler,
    NextApiRequest,
    NextApiResponse,
    GetServerSidePropsContext,
    GetServerSidePropsResult,
} from "next";

export const sessionOptions: IronSessionOptions = {
    password: process.env.SESSION_SECRET as string,
    cookieName: "ilo_fan_controller_session",
    cookieOptions: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 24,
    },
};

if (
    !process.env.SESSION_SECRET ||
    process.env.SESSION_SECRET.length < 32 ||
    !process.env.AUTH_USERNAME ||
    !process.env.AUTH_PASSWORD
) {
    throw new Error(
        "Environment variables SESSION_SECRET (at least 32 characters long), AUTH_USERNAME, and AUTH_PASSWORD must all be set"
    );
}

declare module "iron-session" {
    interface IronSessionData {
        user?: {
            username: string;
            isLoggedIn: boolean;
        };
    }
}

export function withSessionRoute(handler: NextApiHandler) {
    return async function (req: NextApiRequest, res: NextApiResponse) {
        req.session = await getIronSession(req, res, sessionOptions);
        return handler(req, res);
    };
}

export function withSessionSsr<P extends Record<string, unknown>>(
    handler: (
        context: GetServerSidePropsContext
    ) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>
) {
    return async function (context: GetServerSidePropsContext) {
        context.req.session = await getIronSession(
            context.req,
            context.res,
            sessionOptions
        );
        return handler(context);
    };
}
