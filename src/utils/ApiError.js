class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong"
    ){  
        //over writing
        super(message)
        this.statusCode=statusCode;
        this.status=`${statusCode}`.startsWith('4')?'fail':'error';
        this.isOperational=true;
        Error.captureStackTrace(this,this.constructor);
        /*super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false
        this.errors = errors

        if (stack) {
            this.stack = stack
        }
        else {
            Error.captureStackTrace(this, this.constructor)
        }*/
    }
}

export {ApiError}