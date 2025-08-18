import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import { AppDataSource } from "../data-source";
import { DisabledTokens, Users } from "../entity/users";
import { ErrorResponse, GetUser, Register } from "../interface/user";
import { dedupCheck } from "../helpers/dedupCheck";
import { RegSchema } from "../schema/user.schema";

export class UsersService {
  public async get(id?: string): Promise<ErrorResponse | GetUser | GetUser[]> {
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
        return { error: true, message: "User wasn't found" };
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
    return { error: true, message: "Users wasn't found" };

  }
//Registered | ErrorResponse | MissingParam[]
  public async create(userCreationParams: Register): Promise<any> {
    console.log("User creation params:", userCreationParams);
    const check = await RegSchema.safeParseAsync(userCreationParams);

    if (!check.success) {
      const issues = check.error.issues.map(issue => ({
        missing: `${issue.path}`,
        message: issue.message,
      }));

      return { error: true, message: issues }
    }
    if (
      userCreationParams.firstname 
      && userCreationParams.lastname
      && userCreationParams.email
      && userCreationParams.password
      && userCreationParams.dateOfBirth
    ) {
      const userUnique = await dedupCheck(userCreationParams.email)
      if (!userUnique) {
        return { error: true, message: "User already exists" };
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
  
  public async disable(id?: string ): Promise<any> {
    if (!id) {
      return { error: false, message: "User id is required" };
    }
    const userUnique = await dedupCheck(id)
    if (!userUnique) {
      return { error: false, message: "User already disabled" };
    }
    const userRepository = AppDataSource.getRepository(Users);
    const existingUser = await userRepository.findOneBy({ id });
    if (!existingUser) {
      return { error: false, message: "User not found" };
    }
    existingUser.status = 'disabled';
    await userRepository.save(existingUser);
    const disabledRepository = AppDataSource.getRepository(DisabledTokens);
    disabledRepository.insert({ token: id });
    return { message: `User ${id} was disabled` };
  }

  
}