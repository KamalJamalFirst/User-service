import { AppDataSource } from "../data-source";
import { Users } from "../entity/users";

export async function dedupCheck(
    email: string
): Promise<boolean> {
    const userRepository = AppDataSource.getRepository(Users);
    
    const existingUser = await userRepository.findOneBy({ email });
    if (existingUser) {
        return false; // User already exists
    }
    return true;
}