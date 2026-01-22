import { pool } from "../config/db";
import { Request, Response } from "express";
import { hashPassword } from "../utils/auth";

export const registerUser = async (req: Request, res: Response) => {

    try {
        //Getting the values from the request 
        const { name, lastname, username, email, password } = req.body;

        //Hashing the password
        const hashedPassword = await hashPassword(password);

        //Inserting the data in the database
        const [fields, rows] = await pool.query(
            'INSERT INTO users (name,lastname,username,email,password,created_at) values (?,?,?,?,?,now())',
            [name, lastname, username, email, hashedPassword]);

        res.status(200).json({fields: fields, rows: rows});
    } catch (error) {
        return res.status(500).send(error)
    }
}
