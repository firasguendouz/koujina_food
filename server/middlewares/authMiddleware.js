const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ status: 'error', message: 'Authorization token required' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decode the token
        console.log(token);

        console.log(decoded);
        req.user = decoded; // Attach the decoded payload (userId, name, email) to req.user
        next();
    } catch (error) {
        console.error('Token verification failed:', error);
        return res.status(401).json({ status: 'error', message: 'Invalid token' });
    }
};

module.exports = authMiddleware;
