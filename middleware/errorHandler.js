export default function errorHandler(err, res) {
    let { name, status, message, field, code } = err

    if (name === 'ValidationError') {
        const fields = Object.keys(err.errors)

        const responseBody = {}
        fields.forEach(field => {
            responseBody[field] = err.errors[field].message
        })
        return res.status(422).json(responseBody)
    }

    
    if (name === 'MongoServerError' && code === 11000) {
        const field = Object.keys(err.keyValue)[0]
        return res.status(422).json({ [field]: `${field} is already in use`})
    }
    console.log(name, code);
    return res.status(status).json({ [field]: message })
}