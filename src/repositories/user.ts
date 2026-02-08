import { FieldPacket } from "mysql2";
import { pool } from "../config/db";
import { DatabaseUsernames, User, UserRegisterData } from "../models/user";
import { hashPassword } from "../utils/auth";


//Check if an email exists in the database
export const emailExists = async (email: String) => {
    const [rows] = await pool.query('SELECT * FROM users where email = ?;', [email]);
    return rows[0];
}

//Check if an username exists in the database
export const usernameExists = async (username: string) => {
    const [rows] = await pool.query('SELECT * FROM users where username = ?;', [username]);
    return rows[0];
}

//Get all the usernames in the database
export const findUsernames = async (username : string)=>{
    const [rows] = await pool.query(`
        SELECT username FROM users WHERE username LIKE ? LIMIT 10;
    `,['%'+username+'%']);
    return rows;
}

//Save the user in the database
export const saveUser = async (user: UserRegisterData) => {
    const hashedPassword = await hashPassword(user.password);
    return await pool.query(
        'INSERT INTO users (name,lastname,username,email,password,created_at) values (?,?,?,?,?,now())',
        [user.name, user.lastname, user.username, user.email, hashedPassword])

}

//Get the user bassed in the email (method just for exist validation)
export const getUser = async (email: string):Promise<User>=>{
    const [rows] = await pool.query('SELECT * FROM users where email = ?;',[email]);
    return rows[0];
}

//Get the user bassed in his id used in the token validation
export const getUserById = async (id: number) => {
    const [rows] = await pool.query('SELECT * FROM users where id = ?;',[id]);
    return rows[0];
}
