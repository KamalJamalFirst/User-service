import { Request } from "express";
import * as jwt from "jsonwebtoken";
import { checkDisabled } from "../helpers/checkDisabled";

export function expressAuthentication(
  request: Request,
  securityName: string,
  scopes?: string[]
): Promise<void | { error: boolean; message: string }> {
    if (securityName !== 'jwt') {
        return Promise.reject('Invalid security scheme');
    }
    const token =  request.headers["access_token"] as string;
    console.log(request.headers);
    const userId = request.url.split('/')[-1];

    return new Promise((resolve) => {
        if (!token) {
            resolve({ error: true, message: "No token provided" });
        }
        const decoded = jwt.verify(token, 'your-secret-key') as { id: string, role: string };
        console.log("Decoded JWT:", decoded);
        if (scopes && scopes.length > 0) {
            checkDisabled(token).then(res => {
                console.log("Check disabled response:", res);
                if (res) {
                    resolve({ error: true, message: "You don't have an access. User was disabled" });
                } else {
                    if (scopes[0] === decoded.role && decoded.role === 'admin') {
                    resolve();
                    }
                    if (scopes[0] === decoded.role && decoded.role === 'user') {
                        if (!(userId === decoded.id)) {
                            resolve({ error: true, message: 'User are only allowed to get info about himself' });
                        }
                        resolve();
                    }
                }
                
            })
        }
    });
}
