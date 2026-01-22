import { Request,Response } from "express";
import { emailExists, saveUser, usernameExists } from "../repositories/user";
import { UserRegisterData } from "../models/user";


export const registerUser = async (req: Request, res: Response)=>{

    //Getting the values from the request 
    const { name, lastname, username, email, password } = req.body;
    
    //Checks if username is already taken
    if(await usernameExists(username)){
        return res.status(409).json({erorr: 'Username already taken'});
    }

    //Checks if email is already registered
    if(await emailExists(email)){
        return res.status(409).json({error: 'Email already registered'})
    }

    const user:UserRegisterData = {
        name: name,
        lastname: lastname,
        username: username,
        email: email,
        password: password
    }
    const userSaved = await saveUser(user);
    if(userSaved){
        return res.status(200).json({msg: 'User registered'});
    }else{
        return res.status(500).json({msg: 'Something happened'});
    }

}