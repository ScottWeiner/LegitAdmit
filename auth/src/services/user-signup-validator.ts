import { body } from 'express-validator'

export const userSignupValidator = [body('email')
    .isEmail()
    .withMessage('Email must be valid'),
body('password')
    .trim()
    .isLength({ min: 4, max: 20 })
    .withMessage('Password must be between 4 & 20 characters'),
body('firstName')
    .trim()
    .not().isEmpty()
    .withMessage('a first name is required'),
body('lastName')
    .trim()
    .not().isEmpty()
    .withMessage('a last name is required'),
body('address1')
    .trim()
    .not().isEmpty()
    .withMessage('a address is required'),
body('address2')
    .trim(),
body('city')
    .trim()
    .not().isEmpty()
    .withMessage('a city is required'),
body('state')
    .trim()
    .not().isEmpty()
    .withMessage('a city is required'),
body('zip')
    .trim()
    .isLength({ min: 5, max: 5 })
    .not().isEmpty()
    .withMessage('a zip code is required')
]

