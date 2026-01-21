import { pool } from "../config/db";
import { Request, Response } from "express";

export const registerUser = async (req: Request, res: Response) => {

    try {
        const { name, lastname, username, email, password } = req.body;
        const [fields, rows] = await pool.query(
            'INSERT INTO users (name,lastname,username,email,password,created_at) values (?,?,?,?,?,now())',
            [name, lastname, username, email, password]);
        res.status(200).json({fields: fields, rows: rows});
    } catch (error) {
        return res.status(500).send(error)
    }
}
