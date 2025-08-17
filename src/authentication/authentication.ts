import { Request } from "express";
import * as jwt from "jsonwebtoken";
import { checkDisabled } from "../helpers/checkDisabled";

export function expressAuthentication(
  request: Request,
  securityName: string,
  scopes?: string[]
): Promise<void | Error> {
    if (securityName !== 'jwt') {
        return Promise.reject('Invalid security scheme');
    }
    const token =  request.headers["access_token"] as string;
    console.log(request.headers);
    const userId = request.url.split('/')[-1];

    return new Promise((resolve, reject) => {
        try {
            if (!token) {
                reject(new Error("No token provided"));
            }
            const decoded = jwt.verify(token, 'your-secret-key') as { id: string, role: string };
            console.log("Decoded JWT:", decoded);
            if (scopes && scopes.length > 0) {
                checkDisabled(token).then(res => {
                    if (!res) {
                        if (scopes[0] === decoded.role && decoded.role === 'admin') {
                        resolve();
                        }
                        if (scopes[0] === decoded.role && decoded.role === 'user') {
                            if (!(userId === decoded.id)) {
                                throw new Error('User are only allowed to get info about himself')
                            }
                            resolve();
                        }
                    }
                    throw new Error("You don't have an access. User was disabled")
                })
            }
        } catch (error) {
            reject(error);
        }
    });
}
