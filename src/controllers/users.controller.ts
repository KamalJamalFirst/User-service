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
  ): Promise<GetUser | GetUser[] | Error> {
    console.log("userId received:", userId)
    try {
      return await new UsersService().get(userId);
    } catch (error) {
      this.setStatus(404);
      return error as Error;
    }
  }

  @SuccessResponse("200", "OK") // Custom success response
  @Security('jwt', ['admin'])
  @Get("")
  public async getUsers(): Promise<GetUser | Error | GetUser[]> {
    try {
      return await new UsersService().get();
    } catch (error) {
        this.setStatus(404);
        return error as Error;
    }
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