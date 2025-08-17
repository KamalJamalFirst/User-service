import { DisabledTokens, Users } from "./entity/users"
import { DataSource } from "typeorm"

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "users",
    synchronize: true,
    logging: true,
    entities: [Users, DisabledTokens],
    subscribers: [],
    migrations: [],
})