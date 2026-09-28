const PSFRecord = require("../models/PSFRecord");

const getPSFRecords = async (req, res) => {
  try {
    let filter = {};

    const search = req.query.search?.trim();

    if (search) {
      filter.$or = [
        {
          roNumber: {
            $regex: search,
            $options: "i",
          },
        },
        {
          customerName: {
            $regex: search,
            $options: "i",
          },
        },
        {
          registrationNumber: {
            $regex: search,
            $options: "i",
          },
        },
        {
          chassisNumber: {
            $regex: search,
            $options: "i",
          },
        },
        {
          userName: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    if (req.user.role !== "admin") {
      if (
        !Array.isArray(req.user.branchIds) ||
        req.user.branchIds.length === 0
      ) {
        return res.status(403).json({
          message: "No branches assigned to this user",
        });
      }

      filter.branchId = {
        $in: req.user.branchIds,
      };
    }

    const page = Math.max(parseInt(req.query.page) || 1, 1);

    const limit = Math.min(Math.max(parseInt(req.query.limit) || 20, 1), 100);

    const skip = (page - 1) * limit;

    const [records, totalRecords] = await Promise.all([
      PSFRecord.find(filter)
        .populate("branchId", "name code")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      PSFRecord.countDocuments(filter),
    ]);

    const totalPages = Math.ceil(totalRecords / limit);

    res.json({
      message: "PSF records fetched successfully",

      pagination: {
        page,
        limit,
        totalRecords,
        totalPages,
      },

      count: records.length,
      records,
    });
  } catch (error) {
    console.error("Get PSF records error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const updatePSFRecord = async (req, res) => {
  try {
    const { id } = req.params;

    const record = await PSFRecord.findById(id);

    if (!record) {
      return res.status(404).json({
        message: "PSF record not found",
      });
    }

    // Admin can update any record.
    // Manager/employee can update only records
    // belonging to one of their assigned branches.
    if (req.user.role !== "admin") {
      if (
        !Array.isArray(req.user.branchIds) ||
        !req.user.branchIds.some(
          (branchId) => branchId.toString() === record.branchId.toString(),
        )
      ) {
        return res.status(403).json({
          message: "Access denied for this branch",
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
      "messageToBeSent",
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
      record: updatedRecord,
    });
  } catch (error) {
    console.error("Update PSF record error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  getPSFRecords,
  updatePSFRecord,
};
