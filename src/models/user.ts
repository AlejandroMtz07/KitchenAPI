//Type for the users stored in the database
export type User = {
    id: number,
    name: string,
    lastname: string,
    username: string,
    email: string,
    password: string,
    created_at: string
}

//Type for the data sended for the user register
export type UserRegisterData = Pick<User,'name'|'lastname'|'email'|'password'|'username'>

//Type for the username list
export type DatabaseUsernames = Pick<User, 'username'>