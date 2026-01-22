
export type Recipe = {
    id: number,
    name: string,
    description: string,
    is_private: boolean,
    ingredients: string,
    image?: string
    Id_user: number
}

export type SavedRecipe = Pick<Recipe, 'name' | 'description' | 'is_private' | 'ingredients' | 'image' | 'Id_user'>