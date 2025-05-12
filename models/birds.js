import mongoose from "mongoose";

const birdSchema = new mongoose.Schema({
    species: { type: String, required: [true, 'Please provide the species name'] },
    subspecies: { type: String, required: [true, 'Please provide the subspecies name'] },
    habitat: { type: String, required: [true, 'Please provide the habitat of the bird'] },
    color: { type: String, required: [true, 'Please provide the colour of the bird'] },
    size: { type: String, required: [true, 'Please provide the size of the bird'] },
    diet: { type: String, required: [true, 'Please provide the diet for the bird']},
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
})

const Bird = mongoose.model('Bird', birdSchema)

export default Bird