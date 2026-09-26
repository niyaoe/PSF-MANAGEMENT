const PSFRecord = require("../models/PSFRecord");

const getPSFRecords = async (req, res) => {
    try {
        let filter = {};

        // Admin can access all branches.
        if (req.user.role !== "admin") {
            if (!req.user.branchId) {
                return res.status(403).json({
                    message: "No branch assigned to this user"
                });
            }

            filter.branchId = req.user.branchId;
        }

        const records = await PSFRecord.find(filter)
            .populate("branchId", "name code")
            .sort({ createdAt: -1 });

        res.json({
            message: "PSF records fetched successfully",
            count: records.length,
            records
        });
    } catch (error) {
        console.error("Get PSF records error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    getPSFRecords
};