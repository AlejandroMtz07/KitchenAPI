import { FieldPacket } from "mysql2";
import { pool } from "../config/db"
import { Recipe, SavedRecipe } from "../models/recipe";
import { ResultSetHeader } from "mysql2";


//Method that returns all 
// the recipes in a random order
export const findAllRecipes = async () => {
    //Setting the two types of the response, being the Recipe type of the data that we get from
    // the database.
    const [rows]: [Recipe[], FieldPacket[]] = await pool.query(`
        SELECT 
            r.id,
            r.name,
            r.description,
            r.ingredients,
            r.image,
            u.id as user_id,
            u.name as user_name,
            u.username as user_username,
            u.email as user_email
        FROM recipes r
        INNER JOIN users u ON r.Id_user = u.id where r.is_private = false order by rand();`);
    return rows;
}

//Method that returns all the saved recipes
//of the user being the private and public recipes 
export const findUserRecipes = async (userId: number) => {
    const [rows]: [Recipe[], FieldPacket[]] = await pool.query(
        `SELECT
            r.id,
            r.name,
            r.description,
            r.ingredients,
            r.image,
            r.is_private,
            u.id        AS user_id,
            u.username  AS user_username,
            u.name      AS user_name,
            u.email     AS user_email
        FROM recipes r
        JOIN user_recipes ur
            ON ur.id_recipe = r.id
        JOIN users u
            ON u.id = r.Id_user
        WHERE ur.id_user = ?;`,
        [userId]
    );
    return rows;
}

//Method that saves a recipe
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

//Method that gets all the public recipes 
//of a given user
export const getRecipesByUsername = async (username: string) => {
    const [rows]: [Recipe[], FieldPacket[]] = await pool.query(
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

//Method that saves a public recipe into a public recipe
//book of a user
export const saveRecipeFromPublicRecipes = async (user_id: number, recipe_id: number) => {
    //Add validation in case of the user has already 
    //added the recipe to their recipe book
    try{
        const [ result ] = await pool.query(
            ` INSERT INTO user_recipes (id_user, id_recipe, saved_at) VALUES (?,?,now());`,
            [user_id,recipe_id]
        )
        return {success: true,result}
    }catch( error: any){

    }
};

//Method that gets a recipe by his id
export const getRecipeById = async (recipe_id: number) => {
    const [rows]: [Recipe[], FieldPacket[]] = await pool.query(
        'SELECT * FROM recipes where id = ?;',
        [recipe_id]
    )
    return rows[0];
}

//Method that filters all the recipes based on his name.
export const findRecipesByName = async (name: string) => {
    const [rows]: [Recipe[], FieldPacket[]] = await pool.query(
        `SELECT
            r.name AS name,
            u.username AS user_name
        FROM recipes r
        JOIN users u
        ON u.id = r.Id_user
        WHERE r.name LIKE ? and r.is_private = false;`,['%'+name+'%'])
    return rows;
}

//Method that updates a user recipe, oly being able to edit
//if the user is the owner of the recipe.
export const updateRecipeById = async (id: number, name: string, description: string, is_private: string)=>{

    return await pool.query(
        `UPDATE recipes set name = ?, description = ?, is_private = ? where id = ?;`,
        [name,description,is_private,id]
    )

}

//Method that chacks if a recipe is already in the user's recipe book
//and return true or false
export const validateSavedRecipe = async (user_id: number,recipe_id: number)=>{
    const [ rows ]:any = await pool.query(
        `
        SELECT 1
        FROM user_recipes
        WHERE id_user = ?
        AND id_recipe = ?
        LIMIT 1;
        `,
        [user_id,recipe_id]
    );
    return rows.length > 0;
}

export const deleteRecipeFromBook = async (user_id: number, recipe_id: number)=>{

    return await pool.query(
        `
        DELETE FROM user_recipes
        WHERE id_user = ?
        AND id_recipe = ?;`,[user_id,recipe_id]
    );
}