import jwt, {JwtPayload} from "jsonwebtoken";

export const generateToken = (payload: JwtPayload) => {
    
    return jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {
            expiresIn: '2h'
        }
    )

}