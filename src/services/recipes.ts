import { Request, Response } from "express";
import { findAllRecipes, findRecipesByName, findUserRecipes, getRecipeById, getRecipesByUsername, saveRecipe, saveRecipeFromPublicRecipes } from "../repositories/recipes";
import formidable from 'formidable';
import cloudinary from "../config/cloudinary";
import { Recipe, SavedRecipe } from "../models/recipe";
import { v4 as uuid} from 'uuid';
import { usernameExists } from "../repositories/user";

//Function that get all the public recipes published by all the users
export const getRecipes = async (req: Request, res: Response) => {

    //Getting all the recipes from the database
    const recipes = await findAllRecipes();

    return res.status(200).json({ recipes: recipes });

}

//Function that get all the recipes of the user, including the private recipes
export const getUserRecipes = async (req: Request, res: Response) =>{
    const userRecipes = await findUserRecipes(req.user.id);
    return res.status(200).json({recipes: userRecipes});
}

//Function that save the recipe and upload the image of the recipe
export const addRecipe = async (req: Request, res: Response) => {

    //Instance of formidable
    const form = formidable({ multiples: false });

    try {
        //Parsing the received data and image
        form.parse(
            req,
            (error, fields, files) => {

                //Getting the image
                const image = files.file[0].filepath;
                
                //Getting the recipe information
                const { name, description, is_private, ingredients } = fields;

                //Sending the image to our cloud
                cloudinary.uploader.upload(
                    image,
                    {public_id: uuid()}, //Setting the image an unique ID
                    async function (error, result){
                        if(error){
                            return res.status(500).json({error: 'There was an error uploading the image'});
                        }
                        if(result){
                            let imageUrl = result.secure_url;
                            const recipe : SavedRecipe = {
                                name: name.toString(),
                                description: description.toString(),
                                ingredients: ingredients.toString(),
                                is_private: is_private.toString() === '1' ? true : false,
                                image: imageUrl,
                                Id_user: req.user.id
                            }
                            await saveRecipe(recipe); //Sending the recipe to the database
                            return res.status(200).json({msg: recipe});
                        }
                    }
                )

            }
        );
    } catch (e) {
        return res.status(500).json({ error: 'Something happened' });
    }

}

//Function that get all the public recipes of the user wanted
//the username is passed in the url by params
export const getUserPublicRecipes = async (req: Request, res: Response)=>{

    const {username} = req.params;
    const existsUsername = await usernameExists(username.toString());
    if(!existsUsername){
        return res.status(404).json({error: 'User not found'});
    }
    const publicUserRecipes = await getRecipesByUsername(username.toString());
    if(publicUserRecipes.length === 0){
        return res.status(404).json({error: 'The user dont have any public recipe'});
    }
    return res.status(200).json({recipes: publicUserRecipes});
}

//Function that handle the function of add a recipe from the public recipes book
//to the user recipes (like saving the recipe)
export const savePublicRecipe = async (req: Request, res: Response)=>{

    const {id} = req.params;

    const recipe = await getRecipeById(Number(id));
    if(!recipe){
        return res.status(404).json({error: 'Recipe not found'});
    }

    if(recipe.Id_user === req.user.id){
        return res.status(409).json({error: 'This recipe is already yours'});
    }

    await saveRecipeFromPublicRecipes(req.user.id, Number(id));
    return res.status(200).json({msg: 'Recipe added successfully'});

}

export const getRecipeByName = async (req: Request, res: Response)=>{
    
    const {name} = req.params;
    const recipes = await findRecipesByName(String(name));

    if(recipes.length === 0){
        return res.status(404).json({msg: 'No recipes found'});
    }
    return res.status(200).json({recipes: recipes});
}