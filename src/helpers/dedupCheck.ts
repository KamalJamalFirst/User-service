import { AppDataSource } from "../data-source";
import { DisabledTokens, Users } from "../entity/users";

export async function dedupCheck(
    email?: string,
    id?: string
): Promise<boolean> {
    if (email) {
        const userRepository = AppDataSource.getRepository(Users);
        const existingUser = await userRepository.findOneBy({ email });
        if (existingUser) {
            return false; // User already exists
        }
        return true;
    }
    const disabledRepository = AppDataSource.getRepository(DisabledTokens);
    const existingUser = await disabledRepository.findOneBy({ token: id });
    if (existingUser) {
        return false; // User already exists
    }
    return true;

}