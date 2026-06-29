// Global error handling middleware
export const errorHandler = (err, req, res, next) => {
    console.error("Global Error Caught:", err.stack);

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
        success: false,
        error: message,
        // Only show the detailed stack trace if we are in development mode
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};