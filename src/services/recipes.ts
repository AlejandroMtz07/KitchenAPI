import { Request, Response } from "express";
import { findAllRecipes, findUserRecipes, saveRecipe } from "../repositories/recipes";
import formidable from 'formidable';
import cloudinary from "../config/cloudinary";
import { Recipe, SavedRecipe } from "../models/recipe";
import { v4 as uuid} from 'uuid';

export const getRecipes = async (req: Request, res: Response) => {

    //Getting all the recipes from the database
    const recipes = await findAllRecipes();

    return res.status(200).json({ recipes: recipes });

}

export const getUserRecipes = async (req: Request, res: Response) =>{
    const userRecipes = await findUserRecipes(req.user.id);
    if(userRecipes.length === 0){
        return res.status(404).json({msg: 'Any recipe found'});
    }
    return res.status(200).json({recipes: userRecipes});
}

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