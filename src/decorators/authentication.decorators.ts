import { Request } from "express";
import * as jwt from "jsonwebtoken";
import { checkDisabled } from "../helpers/checkDisabled";

export async function expressAuthentication(
  request: Request,
  securityName: string,
  scopes?: string[]

): Promise<void | Error> {
    if (securityName !== 'jwt') {
        throw new Error('Invalid security scheme' );
    }
    const token =  request.headers["access_token"] as string;

    if (!token) {
        throw new Error("No token provided" );
    }

    let decoded;
    try {
        decoded = jwt.verify(token, 'your-secret-key') as { id: string, role: string };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
        throw new Error("Invalid token" );
    }
    const isDisabled = await checkDisabled(token);
    if (isDisabled) {
        throw new Error("You dont have an access. User was disabled" );
    }

    if (scopes && scopes.length > 0) {
        if (decoded.role !== scopes[0]) {
            //console.log("Access denied for role:", decoded);
            
            throw new Error("You dont have an access" );
        }

        if (decoded.role === 'user') {
            const userId = request.url.split('/').pop();
            if (userId !== decoded.id) {
                throw new Error("User are only allowed to get info about himself");
                // return Promise.reject({ status: 403, message: 'User are only allowed to get info about himself' });
            }
        }

    }
    return Promise.resolve();
}
