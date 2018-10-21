import { Entity, Column, PrimaryColumn, BeforeInsert } from "typeorm";
import * as uuidv4 from 'uuid/v4';

@Entity("users")
export class User {

    @PrimaryColumn("uuid")
    id: string;

    @Column("varchar", { length: 255 })
    email: string;

    @Column("text")
    password: string;

    @BeforeInsert()
    addId() {
        this.id = uuidv4();
    }

}
