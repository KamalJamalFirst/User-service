// src/users/usersController.ts
import {
  Body,
  Controller,
  Get,
  Path,
  Post,
  Res,
  Route,
  Security,
  SuccessResponse,
  TsoaResponse,
} from "@tsoa/runtime";
import { UsersService } from "../service/usersService";
import { GetUser, Register, Registered } from "../interface/user";

@Route("users")
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
  public async getUsers(
    @Res() res403: TsoaResponse<403, { message: string }>
  ): Promise<GetUser[]> {
    const result = await new UsersService().get();
    if (result && 'error' in result) {
      return res403(403, { message: result.message });
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