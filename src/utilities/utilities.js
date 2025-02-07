class Utilities {

    buildResponse = (message, data)=> {
        return {
            message,
            data,
        };
    };
    errorMessage = (message) => {
        return {
            errorMessage: message,
        }
    }
}

module.exports=Utilities