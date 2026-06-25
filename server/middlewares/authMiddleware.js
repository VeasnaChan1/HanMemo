import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
  // 1. Get the token from the request headers
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  // 2. Extract the actual token (removes the "Bearer " part)
  const token = authHeader.split(' ')[1];

  try {
    // 3. Verify the token using your secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 4. Attach the user data (like user id) to the request so other routes can use it
    req.user = decoded; 
    next(); // Let the user pass to the next function!
  } catch (error) {
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
}