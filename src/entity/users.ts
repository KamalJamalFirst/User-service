import "reflect-metadata";
import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Users {

    @PrimaryColumn()
    id: string

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    dateOfBirth: string

    @Column()
    email: string

    @Column()
    password: string

    @Column()
    role: 'admin' | 'user'

    @Column()
    status: "active" | "disabled"
}

@Entity()
export class DisabledTokens {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: string;
}