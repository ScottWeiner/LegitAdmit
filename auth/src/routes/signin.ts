import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { BadRequestError } from '@legit-admit/common'
import jwt from 'jsonwebtoken'
import { User } from '../models/user'
import { validateRequest } from '@legit-admit/common'
import { Password } from '../services/password'


const router = express.Router()

router.post('/api/users/signin', [

    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .trim()
        .isLength({ min: 4, max: 20 })
        .notEmpty()
        .withMessage('You must supply a password')
],
    validateRequest,
    async (req: Request, res: Response) => {

        const { email, password } = req.body

        const existingUser = await User.findOne({ email })

        if (!existingUser) {
            throw new BadRequestError('No user associated with this email address')
        }

        const passwordCompareResult = await Password.compare(existingUser.password, password)

        //console.log('passwordCompareResult: ', passwordCompareResult)

        if (!passwordCompareResult) {
            throw new BadRequestError('The password supplied is incorrect')
        }

        const userJWT = jwt.sign({
            id: existingUser.id,
            email: existingUser.email
        }, process.env.JWT_KEY!) //will come back and replace the signing key

        req.session = {
            jwt: userJWT
        }

        res.status(200).send(existingUser)

    })

export { router as signInRouter }