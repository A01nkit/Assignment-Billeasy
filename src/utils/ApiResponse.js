class ApiResponse {
    constructor(message, statusCode, data){
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = "true"
    }

    static send(res, message, statusCode = 200, data = null) {
        const response = new ApiResponse(message, statusCode, data);
        
        if (!data){
            return res.status(statusCode).json({
                success: response.success,
                message: response.message,
            });
        }
        return res.status(statusCode).json({
            success: response.success,
            message: response.message,
            data: response.data
        });
        
    }
}


export {ApiResponse}