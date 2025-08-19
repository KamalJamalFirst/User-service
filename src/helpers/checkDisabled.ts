import { AppDataSource } from "../data-source";
import { DisabledTokens, Users } from "../entity/users";

export async function isTokenDisabled(userId: string) {
    const disabledRepository = AppDataSource.getRepository(DisabledTokens)
    const userRepository = AppDataSource.getRepository(Users)
    // console.log("Checking if token is disabled:", token, typeof token);
    const isDisabledDisableRep = await disabledRepository.findOneBy({ userId: userId });
    const isDisabledUserRep = await userRepository.findOneBy({ id: userId, status: 'disabled' });
    console.log("isDisabledDisableRep:", isDisabledDisableRep, "isDisabledUserRep:", isDisabledUserRep);
    if (isDisabledDisableRep && isDisabledUserRep) {
        //console.log(isDisabled)
        return true
    }
    console.log("Checking if token is disabled:", userId, typeof userId);
    return false
}