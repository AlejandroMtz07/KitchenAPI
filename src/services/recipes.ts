import { Request, Response } from "express";
import { findAllRecipes } from "../repositories/recipes";

export const getRecipes = async (req: Request, res: Response)=>{
    
    //Getting all the recipes from the database
    const recipes = await findAllRecipes();

    return res.status(200).json({recipes: recipes});

}