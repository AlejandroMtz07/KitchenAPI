import { pool } from "../config/db"
import { Recipe } from "../models/recipe";


export const findAllRecipes = async ()=>{
    const [rows] = await pool.query('SELECT * FROM recipes;');
    return rows;
}