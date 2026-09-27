const express = require("express");

const {
    getPSFRecords
} = require("../controllers/psfController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");

const router = express.Router();

router.get(
    "/",
    protect,
    authorizeRoles("admin", "manager", "employee"),
    getPSFRecords
);

module.exports = router;