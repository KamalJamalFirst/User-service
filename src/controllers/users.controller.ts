// src/users/usersController.ts
import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Put,
  //Res,
  Route,
  Security,
  SuccessResponse,
  //TsoaResponse,
} from "@tsoa/runtime";
import { UsersService } from "../service/usersService";
import { GetUser, MissingParam, Register, Registered } from "../interface/user";

@Route("api/users")
export class UsersController extends Controller {
  @SuccessResponse("200", "OK") // Custom success response
  @Security('jwt', ['user'])
  @Get("{userId}")
  public async getUser(
    @Path() userId: string,
  ): Promise<GetUser> {
    const result = await new UsersService().get(userId);
    return result as GetUser;
  }
  

  @SuccessResponse("200", "OK") // Custom success response
  @Security('jwt', ['admin'])
  @Get("")
  public async getUsers(): Promise<GetUser[]> {
    const result = await new UsersService().get();
    return result as GetUser[];
  }
}

@Route("api/register")
export class RegisterController extends Controller {
  @SuccessResponse("201", "Created") // Custom success response
  @Post("")
  public async createUser(
    @Body() request: Register
  ): Promise<Registered | { message: string | MissingParam[]}> {
    const result = await new UsersService().create(request);
    if (result && 'error' in result) {

      return { message: result.message };
    }
    return result;
    }
}

@Route("api/disable")
export class DisableController extends Controller {
  @SuccessResponse("201", "Created") // Custom success response
  @Security('jwt', ['admin'])
  @Put("{userId}")
  public async disableUser(
    @Path() userId: string
  ): Promise<{ message: string }> {
    const result = await new UsersService().disable(userId);
    if (result && 'error' in result) {

      return { message: result.message };
    }
    return result;
    }
}