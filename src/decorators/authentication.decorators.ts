import { Request } from "express";
import * as jwt from "jsonwebtoken";
import { isTokenDisabled } from "../helpers/checkDisabled";

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
    const isDisabled = await isTokenDisabled(decoded.id);
    if (isDisabled) {
        throw new Error("Access denied. User already disabled" );
    }

    if (scopes && scopes.length > 0) {
        console.log("Decoded JWT:", decoded, "Scopes:", scopes);


        if (decoded.role === 'user' || scopes[1]) {
            const userId = request.url.split('/').pop();
            if (userId !== decoded.id) {
                throw new Error("User are only allowed to get info about himself");
                // return Promise.reject({ status: 403, message: 'User are only allowed to get info about himself' });
            }
            return Promise.resolve();
        }


        if (decoded.role !== scopes[0]) {
            //console.log("Access denied for role:", decoded);
            
            throw new Error("You dont have an access" );
        }

    }
    return Promise.resolve();
}
