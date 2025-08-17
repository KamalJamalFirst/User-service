import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import { AppDataSource } from "../data-source";
import { Users } from "../entity/users";
import { GetUser, Register, Registered } from "../interface/user";
import { dedupCheck } from "../helpers/dedupCheck";

export class UsersService {
  public async get(id?: string): Promise<GetUser | GetUser[]> {
    const usersRepository = AppDataSource.getRepository(Users)
    
    if (id) {
        const user = await usersRepository.findOneBy({ id: `${id}` });
        if (user) {
            return ({
                id: user.id,
                firstname: user.firstName,
                lastname: user.lastName,
                dateOfBirth: user.dateOfBirth,
                email: user.email,
                status: user.status
            })
        }
        throw new Error("User wasn't found");
    }
    

    const users = await usersRepository.find({ take: 10 });
    if (users) {
        return users.map((user: Users) => ({
            id: user.id,
            firstname: user.firstName,
            lastname: user.lastName,
            dateOfBirth: user.dateOfBirth,
            email: user.email,
            status: user.status
        }))
    }
    throw new Error("Users wasn't found")

  }

  public async create(userCreationParams: Register): Promise<Registered> {
    const userUnique = await dedupCheck(userCreationParams.email)
    if (!userUnique) {
        throw new Error("User already exists");
    }
    const hashedpwd = bcrypt.hashSync(userCreationParams.password, 10)
    const newId = uuidv4()
    const newJwt = jwt.sign({ id: newId, role: 'user' }, 'your-secret-key')
    const userRepository = AppDataSource.getRepository(Users)
    const user = new Users();
    user.id = newId;
    user.role = 'user';
    user.status = 'active';
    user.firstName = userCreationParams.firstname;
    user.lastName = userCreationParams.lastname;
    user.dateOfBirth = userCreationParams.dateOfBirth;
    user.email = userCreationParams.email;
    user.password = hashedpwd;
    await userRepository.save(user);
    

    return {id: newId, token: newJwt};
  }
}