// src/users/usersController.ts
import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Route,
  Security,
  SuccessResponse,
} from "@tsoa/runtime";
import { UsersService } from "../service/usersService";
import { GetUser, Register, Registered } from "../interface/user";

@Route("api/users")
export class UsersController extends Controller {
  @SuccessResponse("200", "OK") // Custom success response
  @Security('jwt', ['user'])
  @Get("{userId}")
  public async getUser(
    @Path() userId: string,
  ): Promise<GetUser | { message: string }> {
    console.log("userId received:", userId)
    const result = await new UsersService().get(userId);
    if ('error' in result) {
      this.setStatus(403); // or another appropriate status
      return { message: result.message };
    }
    return result as GetUser;
  }

  @SuccessResponse("200", "OK") // Custom success response
  @Security('jwt', ['admin'])
  @Get("")
  public async getUsers(): Promise<GetUser[] | { message: string }> {
    const result = await new UsersService().get();
    if ('error' in result) {
      this.setStatus(403); // or another appropriate status
      return { message: result.message };
    }
    return result as GetUser[];
  }
}

@Route("api/register")
export class RegisterController extends Controller {
  @SuccessResponse("201", "Created") // Custom success response
  @Post()
  public async createUser(
    @Body() requestBody: Register
  ): Promise<Registered | Error> {
      try {
        console.log(requestBody)
        return await new UsersService().create(requestBody);
      } catch (error) {
          this.setStatus(404);
          return error as Error;
      }
  }
}