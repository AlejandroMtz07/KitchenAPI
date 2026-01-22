export type User = {
    id: number,
    name: string,
    lastname: string,
    username: string,
    email: string,
    password: string,
    created_at: string
}

export type UserRegisterData = Pick<User,'name'|'lastname'|'email'|'password'|'username'>