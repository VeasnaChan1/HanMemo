// This middleware assumes authMiddleware has already run and attached req.user
export const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        // Check if the user's role is in the list of allowed roles
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                error: "Access denied. You do not have permission to perform this action." 
            });
        }
        next();
    };
};