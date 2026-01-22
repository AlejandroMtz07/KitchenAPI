import type { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import jwt from 'jsonwebtoken';
import { getUserById } from "../repositories/user";
import { User } from "../models/user";


declare global{
    namespace Express {
        interface Request {
            user?: User
        }
    }
}

export const handleInputErrors = (req: Request, res: Response, next: NextFunction) =>{

    let errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    next();
}

export const authenticated = async (req:Request, res: Response, next: NextFunction) => {

    const bearer = req.headers.authorization;

    if(!bearer){
        return res.status(401).json({error: 'Unauthorized'});
    }

    const [,token] = bearer.split(' ');

    if(!token){
        return res.status(401).json({error: 'Unauthorized'});
    }

    try {
        const result = jwt.verify(token, process.env.JWT_SECRET);

        if(typeof result === 'object' && result.id){

            const user = await getUserById(result.id);
            if(!user){
                return res.status(401).json({error: 'Inexistent user'});
            }
            req.user = user;
            next();
        }
    } catch (error) {
        res.status(500).json({error: 'Invalid token'});
    }
    
}