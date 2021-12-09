function verifyToken(req, res, next) {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
        req.userData = decoded;
        req.user_id=decoded.sub;
        req.token = token;
        if(error) 
            throw error;
        if(data === token) {
            return res.status(404).json({status: false, message: "ERROR!"});
        }
        next();
    }
    catch (error) {
        return res.status(404).json({status: false, message: "Failed Authorization", data: error});
    }
}

module.exports = {
    verifyToken
}