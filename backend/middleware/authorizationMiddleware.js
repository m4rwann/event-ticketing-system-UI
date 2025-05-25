module.exports = function authorizationMiddleware(roles) {
    return (req, res, next) => {
        console.log('req:', req.user)
        const userRole = req.user.role;

        const rolesArray = Array.isArray(roles) ? roles : [roles];

        if (!rolesArray.includes(userRole))
            return res.status(403).json("unauthorized access");
        // console.log('authormid')
        next();
    };
}