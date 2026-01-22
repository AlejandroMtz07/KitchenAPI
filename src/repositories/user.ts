import { pool } from "../config/db";
import { User, UserRegisterData } from "../models/user";
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

//Save the user in the database
export const saveUser = async (user: UserRegisterData) => {
    const hashedPassword = await hashPassword(user.password);
    return await pool.query(
        'INSERT INTO users (name,lastname,username,email,password,created_at) values (?,?,?,?,?,now())',
        [user.name, user.lastname, user.username, user.email, hashedPassword])

}

export const getUser = async (email: string):Promise<User>=>{
    const [rows] = await pool.query('SELECT * FROM users where email = ?;',[email]);
    return rows[0];
}
