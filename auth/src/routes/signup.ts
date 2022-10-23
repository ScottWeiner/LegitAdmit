import express, { Request, Response } from 'express'
import { userSignupValidator } from '../services/user-signup-validator'
import { BadRequestError } from '@legit-admit/common'
import { User } from '../models/user'
import { validateRequest } from '@legit-admit/common'

import jwt from 'jsonwebtoken'

const router = express.Router()

router.post('/api/users/signup', userSignupValidator, validateRequest
    , async (req: Request, res: Response) => {


        const { email, password, firstName, lastName, address1,
            address2, city, state, zip } = req.body

        const existingUser = await User.findOne({ email })

        if (existingUser) {
            throw new BadRequestError('Email in use')
        }

        const user = User.build({
            email,
            password,
            firstName,
            lastName,
            address1,
            address2,
            city,
            state,
            zip
        })
        await user.save();

        //generate jsonwebtoken, store on session object
        const userJWT = jwt.sign({
            id: user.id,
            email: user.email
        }, process.env.JWT_KEY!) //will come back and replace the signing key

        req.session = {
            jwt: userJWT
        }

        res.status(201).send(user)

    })

router.get('/api/users/signup', validateRequest, (req: Request, res: Response) => {
    res.send('Hit Me!')
})

export { router as signUpRouter }