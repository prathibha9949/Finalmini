const jwt = require("jsonwebtoken");
const User = require("../components/model"); // ✅ Make sure path is correct

const verifyToken = async (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ success: false, message: "Access denied. No token provided!" });
    }

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET);

        // ✅ Fetch the full user
        const user = await User.findById(decoded.id); // assuming your token has `id` when it's created

        if (!user) {
            return res.status(401).json({ success: false, message: "User not found" });
        }

        req.user = user; // ✅ Now you’ll get _id, role, etc.
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error);
        res.status(400).json({ success: false, message: "Invalid token!" });
    }
};

module.exports = verifyToken;
