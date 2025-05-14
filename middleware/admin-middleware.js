const isAdminUser= (req, res, next) => {
    const user = req.userInfo;
    if (user && user.role === "admin") {
        next();
    } else {
        res.status(403).json({
            success: false,
            message: "Unauthorized. You are not allowed to access this resource.",
        });
    }
};

module.exports = isAdminUser;