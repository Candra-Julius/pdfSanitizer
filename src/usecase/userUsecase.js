const UsersUseCaseEntity = require('../domain/entities/usecase/usersEntities')

class UserUseCase extends UsersUseCaseEntity{
    constructor( userRepository, transaction, utilities, hashPassword ) {
        this.userRepository = userRepository
        this.transaction = transaction
        this.utilities = utilities
        this.hashPassword = hashPassword
    }
    getAll = async ( username, page, limit, offset ) => {
        return this.transaction.handleTransactions( async transaction => {
            const where = {}
            if(username) where.username = username
            const [data, count] = await this.userRepository.getAll( where, limit, offset, transaction )
            const pagination = this.utilities.buildPagination( page, limit, count )
            return {
                data,
                pagination
            }
        })
    }
    getOneById = async ( id ) => {
        return this.transaction.handleTransactions( async transaction => {
            return data = await this.userRepository.getOne( id, transaction )
        })
    }
    post = async ( full_name, username, email, password ) => {
        return this.transaction.handleTransactions( async transaction => {
            const where = {
                username: username
            }
            const hash = await this.hashPassword.hash(password)
            const defaults = {
                full_name: full_name,
                email: email,
                password: hash
            }
            const [ data, created ] = await this.userRepository.findOrCreate( where, defaults, transaction )
            if(!created) throw new Error('User already exists')
            return data
        })
    }
    patch = async ( id, full_name, username, email ) => {
        return this.transaction.handleTransactions( async transaction => {
            const where = { id }
            const payload = {
                full_name,
                username,
                email
            }
            return await this.userRepository.update(payload, where, transaction)
        })
    }
    delete = async ( id ) => {
        return this.transaction.handleTransactions( async transaction => {
            return await this.userRepository.delete( id, transaction )
        })
    }
}

module.exports = UserUseCase