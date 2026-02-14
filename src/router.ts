import { Router } from 'express';
import { authenticated, handleInputErrors } from './middlewares/validation';
import { body } from 'express-validator';
import { getUsernames, loginUser, registerUser } from './services/user';
import { addRecipe, getRecipeByName, getRecipes, getUserPublicRecipes, getUserRecipes, savePublicRecipe, updateRecipe } from './services/recipes';

const router = Router();

//User register
router.post(
    '/auth/register',
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('lastname').notEmpty().withMessage('Lastname is required'),
        body('username').notEmpty().withMessage('Username is required'),
        body('email').isEmail().withMessage('Invalid email address'),
        body('password').isLength({min: 4}).withMessage('Password isn\'t long enough'),
    ],
    handleInputErrors,
    registerUser
);

//User login
router.post(
    '/auth/login',
    [
        body('email').isEmail().withMessage('Invalid email address'),
        body('password').notEmpty().withMessage('Password is required'),
    ],
    handleInputErrors,
    loginUser
);

//Get all the usernames
router.get(
    '/users/:username',
    getUsernames
)

//Get global recipes book
router.get(
    '/recipes/all',
    getRecipes
);

//Get user recipes
router.get(
    '/recipes',
    authenticated,
    getUserRecipes
);

//Get recipes by username
router.get(
    '/recipes/:username',
    getUserPublicRecipes
);

router.get(
    '/recipes/find/:name',
    getRecipeByName
)

//Add a new recipe
router.post(
    '/recipes/add',
    authenticated,
    addRecipe
);

//Add a recipe from public recipes book to the user recipe book
router.post(
    '/recipes/:id',
    authenticated,
    savePublicRecipe
)

router.put(
    '/recipes/:id',
    [
        body('name').trim().isEmpty().withMessage('New recipe name cannot be empty'),
        body('description').trim().isEmpty().withMessage('Description cannot be empty')
    ],
    handleInputErrors,
    authenticated,
    updateRecipe
)

export default router;


