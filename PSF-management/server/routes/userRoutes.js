const express = require("express");

const {
    createUser,
    updateUserBranches
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
    "/",
    protect,
    authorizeRoles("admin"),
    createUser
);

router.put(
    "/:userId/branches",
    protect,
    authorizeRoles("admin"),
    updateUserBranches
);

module.exports = router;