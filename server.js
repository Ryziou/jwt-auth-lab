import express, { json } from 'express'
import mongoose from 'mongoose'
import morgan from 'morgan'
import 'dotenv/config'
import cors from 'cors'

import usersRouter from './controllers/users.js'
import birdRouter from './controllers/birds.js'


const app = express()
const port = process.env.PORT

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))


app.use('/api', usersRouter)
app.use('/api', birdRouter)

app.use('/{*any}', (req, res) => {
    return res.status(404).json({ message: 'Route not found' })
})


const startServers = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('Database connected');

        app.listen(port, () => console.log('Server is now running'))
    } catch (error) {
        console.log(error);
    }
}

startServers()