import { FieldPacket } from "mysql2";
import { pool } from "../config/db"
import { Recipe, SavedRecipe } from "../models/recipe";
import { ResultSetHeader } from "mysql2";


export const findAllRecipes = async () => {
    //Setting the two types of the response, being the Recipe type of the data that we get from
    // the database.
    const [rows]: [Recipe[], FieldPacket[]] = await pool.query(`
        SELECT 
            r.id AS recipe_id,
            r.name,
            r.description,
            r.ingredients,
            r.image,
            u.id as user_id,
            u.name as user_name,
            u.username as user_username,
            u.email as user_email
        FROM recipes r
        INNER JOIN users u ON r.Id_user = u.id where r.is_private = false;`);
    return rows;
}

export const findUserRecipes = async (userId: number) => {
    const [rows]: [Recipe[], FieldPacket[]] = await pool.query(
        `SELECT
            r.id,
            r.name,
            r.description,
            r.ingredients,
            r.image,
            r.is_private,
            r.Id_user
        FROM recipes r
        JOIN user_recipes ur
        ON ur.id_recipe = r.id
        WHERE ur.id_user = ?;`,
        [userId]
    );
    return rows;
}

export const saveRecipe = async (recipe: SavedRecipe) => {
    //Using the interface ResultSetHeader wich allow us to get the id of the inserted recipe
    //because when we insert data, the database doesn't resturn any information about the 
    //inserted information,
    //and something more information but, by now, irrelevant.
    const [rows] = await pool
        .query<ResultSetHeader>(
            'INSERT INTO recipes (name,description,is_private,ingredients,image,Id_user) values (?,?,?,?,?,?);',
            [recipe.name, recipe.description, recipe.is_private, recipe.ingredients, recipe.image, recipe.Id_user]
        );
    return await pool
        .query('INSERT INTO user_recipes (id_user,id_recipe,saved_at) values (?,?,now());', 
            [recipe.Id_user, rows.insertId]
    );

}

export const getRecipesByUsername = async (username : string)=>{
    const [rows] : [Recipe[], FieldPacket[]] = await pool.query(
        `SELECT
            r.id,
            r.name,
            r.description,
            r.ingredients,
            r.image,
            r.Id_user
        FROM users u
        JOIN user_recipes ur
        ON ur.id_user = u.id
        JOIN recipes r
        ON r.id = ur.id_recipe
        WHERE u.username = ?
        AND r.is_private = false;`,
        [username]
    )
    return rows;
}

export const saveRecipeFromPublicRecipes = async (user_id: number,recipe_id : number)=>{
    return await pool.query(
        'INSERT INTO user_recipes (id_user,id_recipe,saved_at) values (?,?,now());',
        [user_id,recipe_id]
    );
};

export const getRecipeById = async (recipe_id: number)=>{
    const [rows] : [Recipe[],FieldPacket[]] = await pool.query(
        'SELECT * FROM recipes where id = ?;',
        [recipe_id]
    )
    return rows[0];
}