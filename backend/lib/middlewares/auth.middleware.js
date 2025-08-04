import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.json({ success: false, message: "No token provided" });
    }
    
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.json({ success: false, message: "Token missing" });
    }
    
    try {
        jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        res.json({ success: false, message: "Invalid token" });
    }
};

export default auth;