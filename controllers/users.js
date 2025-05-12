import express from "express";
import User from '../models/user.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { Unauthorized, UnprocessableEntity } from '../lib/errors.js'
import errorHandler from "../middleware/errorHandler.js";

const router = express.Router()


router.post('/register', async (req, res) => {
    try {
        if (req.body.password !== req.body.passwordConfirmation) {
            throw new UnprocessableEntity('Passwords do not match', 'password')
        }
        req.body.password = bcrypt.hashSync(req.body.password, 12)
        
        const user = await User.create(req.body)
        
        return res.status(201).json({ message: `Welcome ${user.username}` })
    } catch (error) {
        errorHandler(error, res)
        
    }
})


router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        const findUser = await User.findOne({ email })
        if (!findUser) throw new Unauthorized()

        if (!bcrypt.compareSync(password, findUser.password)) throw new Unauthorized()

        const payload = { user: {
            _id: findUser._id,
            username: findUser.username
        }}
        const token = jwt.sign(payload, process.env.TOKEN_SECRET, { expiresIn: '7d' })

        return res.status(200).json({ token })
    } catch (error) {
        errorHandler(error, res)
        
    }
})











export default router