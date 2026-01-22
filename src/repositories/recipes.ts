import { pool } from "../config/db"


export const findAllRecipes = async ()=>{
    const [rows] = await pool.query('SELECT * FROM recipes where is_private = 0;');
    return rows;
}