import { Request, Response } from "express";
import { findAllRecipes, saveRecipe } from "../repositories/recipes";
import formidable from 'formidable';
import cloudinary from "../config/cloudinary";
import { SavedRecipe } from "../models/recipe";
import { v4 as uuid} from 'uuid';

export const getRecipes = async (req: Request, res: Response) => {

    //Getting all the recipes from the database
    const recipes = await findAllRecipes();

    return res.status(200).json({ recipes: recipes });

}

export const addRecipe = async (req: Request, res: Response) => {

    const form = formidable({ multiples: false });

    try {
        form.parse(
            req,
            (error, fields, files) => {

                const image = files.file[0].filepath;
                
                const { name, description, is_private, ingredients } = fields;

                cloudinary.uploader.upload(
                    image,
                    {public_id: uuid()},
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
                            await saveRecipe(recipe);
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