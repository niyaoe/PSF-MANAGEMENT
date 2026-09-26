const enforceBranchAccess = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            message: "Authentication required"
        });
    }

    // Admin can access all branches.
    if (req.user.role === "admin") {
        return next();
    }

    // Manager and employee must have a branch.
    if (!req.user.branchId) {
        return res.status(403).json({
            message: "No branch assigned to this user"
        });
    }

    req.branchId = req.user.branchId;

    next();
};

module.exports = enforceBranchAccess;