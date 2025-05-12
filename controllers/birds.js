import Bird from '../models/birds.js'
import express from 'express'
import errorHandler from '../middleware/errorHandler.js'
import secureRoute from '../middleware/secureRoute.js'
import { Forbidden, NotFound } from '../lib/errors.js'

const router = express.Router()

// Index

router.get('/birds', async (req, res) => {
    try {
        const bird = await Bird.find()
        return res.json(bird)
    } catch (error) {
        errorHandler(error, res)
    }
})

// Create

router.post('/birds', secureRoute, async (req, res) => {
    try {
        req.body.owner = req.user._id
        const bird = await Bird.create(req.body)
        return res.status(201).json(bird)
    } catch (error) {
        errorHandler(error, res)
    }
})

// Show

router.get('/birds/:birdId', async (req, res) => {
    try {
        const { birdId } = req.params
        const bird = await Bird.findById(birdId)
        if (!bird) throw new NotFound('The bird has not been found')

        return res.json(bird)
    } catch (error) {
        errorHandler(error, res)
    }
})

// Update

router.put('/birds/:birdId', secureRoute, async (req, res) => {
    try {
        const { birdId } = req.params
        const bird = await Bird.findById(birdId)

        if (!bird) throw new NotFound('The bird has not been found')
        
        if (!bird.owner.equals(req.user._id)) throw new Forbidden()
        
        const updatedBird = await Bird.findByIdAndUpdate(birdId, req.body, { new: true})
        return res.json(updatedBird)
    } catch (error) {
        errorHandler(error, res)
    }
})


// Delete

router.delete('/birds/:birdId', secureRoute, async (req, res) => {
    try {
        const { birdId } = req.params
        const bird = await Bird.findById(birdId)

        if (!bird) throw new NotFound('The bird has not been found')
        
        if (!bird.owner.equals(req.user._id)) throw new Forbidden()
        
        await Bird.findByIdAndDelete(birdId)
        return res.sendStatus(204)

    } catch (error) {
        errorHandler(error, res)
    }
})






export default router