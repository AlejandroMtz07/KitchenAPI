import { pool } from "../config/db"
import { Recipe } from "../models/recipe";


export const findAllRecipes = async ()=>{
    const [rows] = await pool.query('SELECT * FROM recipes where is_private = 0;');
    return rows;
}

export const saveRecipe = async (recipe: Recipe) =>{
    
}