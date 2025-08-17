import { AppDataSource } from "../data-source";
import { DisabledTokens } from "../entity/users";

export async function checkDisabled(token: string) {
    const disabledRepository = AppDataSource.getRepository(DisabledTokens)
    if (await disabledRepository.findOneBy({ token })) {
        return true
    }
    return false
}