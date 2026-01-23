import { RowDataPacket } from "mysql2"

//Type for the recipes stored in the database
export interface Recipe extends RowDataPacket {
    id: number,
    name: string,
    description: string,
    is_private: boolean,
    ingredients: string,
    image?: string
    Id_user: number
}

//Type for the data sended for the creation of a new recipe
export type SavedRecipe = Pick<Recipe, 'name' | 'description' | 'is_private' | 'ingredients' | 'image' | 'Id_user'>