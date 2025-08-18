import { Request } from "express";
import * as jwt from "jsonwebtoken";
import { checkDisabled } from "../helpers/checkDisabled";

export async function expressAuthentication(
  request: Request,
  securityName: string,
  scopes?: string[]

): Promise<void> {
    if (securityName !== 'jwt') {
        return Promise.reject({ status: 401, message: 'Invalid security scheme' });
    }
    const token =  request.headers["access_token"] as string;
    console.log(request.headers);

    if (!token) {
        return Promise.reject({ status: 401, message: "No token provided" });
    }

    let decoded;
    try {
        decoded = jwt.verify(token, 'your-secret-key') as { id: string, role: string };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
        return Promise.reject({ status: 401, message: "Invalid token" });
    }
    const isDisabled = await checkDisabled(token);
    if (isDisabled) {
        return Promise.reject({ status: 403, message: "You don't have an access. User was disabled" });
    }

    if (scopes && scopes.length > 0) {
        if (decoded.role !== scopes[0]) {
            console.log("Access denied for role:", decoded.role);
            return Promise.reject({ status: 403, message: "You don't have an access" });
        }

        if (decoded.role === 'user') {
            const userId = request.url.split('/').pop();
            if (userId !== decoded.id) {
                return Promise.reject({ status: 403, message: 'User are only allowed to get info about himself' });
            }
        }

    }
    return Promise.resolve();
}
