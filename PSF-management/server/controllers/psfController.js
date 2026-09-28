const PSFRecord = require("../models/PSFRecord");

const getPSFRecords = async (req, res) => {
    try {
        let filter = {};

        // Admin can access all branches.
        if (req.user.role !== "admin") {
            if (
                !Array.isArray(req.user.branchIds) ||
                req.user.branchIds.length === 0
            ) {
                return res.status(403).json({
                    message: "No branches assigned to this user"
                });
            }

            filter.branchId = {
                $in: req.user.branchIds
            };
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

const updatePSFRecord = async (req, res) => {
    try {
        const { id } = req.params;

        const record = await PSFRecord.findById(id);

        if (!record) {
            return res.status(404).json({
                message: "PSF record not found"
            });
        }

        // Admin can update any record.
        // Manager/employee can update only records
        // belonging to one of their assigned branches.
        if (req.user.role !== "admin") {
            if (
                !Array.isArray(req.user.branchIds) ||
                !req.user.branchIds.some(
                    (branchId) =>
                        branchId.toString() ===
                        record.branchId.toString()
                )
            ) {
                return res.status(403).json({
                    message: "Access denied for this branch"
                });
            }
        }

        const editableFields = [
            "firstCallDate",
            "secondFollowUpDate",
            "thirdFollowUpDate",
            "whatsAppBot",
            "rating",
            "serviceAdvisorBehaviour",
            "advisorExplanation",
            "vehicleCleanliness",
            "qualityOfWork",
            "waitingAreaFacilities",
            "deliveryAtPromisedTime",
            "voc",
            "typeOfConcern",
            "callDate",
            "complaintStatus",
            "crmCxmRemarks",
            "messageToBeSent"
        ];

        editableFields.forEach((field) => {
            if (Object.prototype.hasOwnProperty.call(req.body, field)) {
                record[field] = req.body[field];
            }
        });

        record.updatedBy = req.user.userId;

        await record.save();

        const updatedRecord = await PSFRecord.findById(record._id)
            .populate("branchId", "name code")
            .populate("updatedBy", "name email role");

        res.json({
            message: "PSF record updated successfully",
            record: updatedRecord
        });
    } catch (error) {
        console.error("Update PSF record error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    getPSFRecords,
    updatePSFRecord
};