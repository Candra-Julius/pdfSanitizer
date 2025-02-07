class Router {
    constructor(router, controller){
        this.router = router
        this.controller = controller
        Object.keys(this.controller).forEach(key => {
            if (typeof this.controller[key] === 'function') {
                this.controller[key] = this.controller[key].bind(this.controller)
            }
        })
        this.routing()
    }
    routing(){
        this.router.post('/testXss', this.controller.testXss)
        this.router.post('/sanitized', this.controller.terminateScript)
        return this.router
    }
    getRouter() {
        return this.router
    }
}

module.exports = Router