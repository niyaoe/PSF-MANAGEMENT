const express = require("express");

const {
    getPSFRecords,
    updatePSFRecord
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

router.put(
    "/:id",
    protect,
    authorizeRoles("admin", "employee"), // "manager" 
    updatePSFRecord
);

module.exports = router;