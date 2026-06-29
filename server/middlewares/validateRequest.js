import { validationResult } from 'express-validator';

// This middleware checks if any previous validation rules failed
export const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        // Return 400 Bad Request with an array of the specific validation errors
        return res.status(400).json({ 
            error: "Validation failed", 
            details: errors.array() 
        });
    }
    
    next();
};