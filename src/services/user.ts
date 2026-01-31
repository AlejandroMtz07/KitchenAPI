import { Request, Response } from "express";
import { emailExists, getUser, saveUser, usernameExists } from "../repositories/user";
import { User, UserRegisterData } from "../models/user";
import { comparePassword } from "../utils/auth";
import { generateToken } from "../utils/jwt";
import { sendMail } from "../config/nodemailer";

//Save a user in the database
export const registerUser = async (req: Request, res: Response) => {

    //Getting the values from the request 
    const { name, lastname, username, email, password } = req.body;

    //Checks if username is already taken
    if (await usernameExists(username)) {
        return res.status(409).json({ erorr: 'Username already taken' });
    }

    //Checks if email is already registered
    if (await emailExists(email)) {
        return res.status(409).json({ error: 'Email already registered' })
    }

    const user: UserRegisterData = {
        name: name,
        lastname: lastname,
        username: username,
        email: email,
        password: password
    }
    const userSaved = await saveUser(user);
    if (userSaved) {
        return res.status(200).json({ msg: 'User registered' });
    } else {
        return res.status(500).json({ error: 'Something happened' });
    }

}

//Method that return a token with user information if the user send valid credentials
//and some more validations of the sended credentials
export const loginUser = async (req: Request, res: Response) => {

    const { email, password } = req.body;

    if (!await emailExists(email)) {
        return res.status(404).json({ error: 'The email is not registered yet' });
    }

    const user: User= (await getUser(email));

    if(!await comparePassword(password, user.password)){
        return res.status(401).json({error: 'Incorrect password'});
    }

    await sendMail(
        email,
        'Welcome from the Kitchen Recipes team.',
        'Welcome again.',
        `
            <h1>
                Welcome, this is a test of the nodemailer serve, do not reply this mail.
            </h1>
        `
    )
    const token = generateToken({id: user.id});
    return res.status(200).json({msg: 'Welcome: '+user.name, token: token});

}