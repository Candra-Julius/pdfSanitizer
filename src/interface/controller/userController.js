class UserController {
    constructor( userUseCase, utilities ) {
        this.userUseCase = userUseCase
        this.utilities = utilities
    }
    getUser = async (req,res) => {
        try {
            const username = req.query.username || null
            const page = req.query.page || 1
            const limit = req.query.limit || 10
            const offset = 0 + (page - 1) * limit || 0
            const result = await this.userUseCase.getAll(username, page, limit, offset)
            res.status(200).json(result)
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    }
    getOneById = async (req,res) => {
        try {
            const id = req.params.id
            const result = await this.userUseCase.getOneById(id)
            res.status(200).json(result)
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    }
    post = async (req,res) => {
        try {
            const {full_name, username, email, password} = req.query
            const result = await this.userUseCase.post(full_name, username, email, password)
            res.status(201).json(result)
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    }
    patch = async (req,res) => {
        try {
            const id = req.users.id
            const { full_name, username, email } = req.body
            const result = await this.userUseCase.patch(id, full_name, username, email)
            res.status(200).json(result)
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    }
    delete = async (req,res) => {
        try {
            const id = req.params.id
            const result = await this.userUseCase.delete(id)
            res.status(200).json(result)
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    }
}

module.exports = UserController