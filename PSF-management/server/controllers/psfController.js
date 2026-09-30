const mongoose = require("mongoose");
const PSFRecord = require("../models/PSFRecord");

const getPSFRecords = async (req, res) => {
  try {
    let filter = {};

    const search = req.query.search?.trim();

    const branchId = req.query.branchId?.trim();

    if (branchId && !mongoose.isValidObjectId(branchId)) {
      return res.status(400).json({
        message: "Invalid branch ID",
      });
    }

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

    if (req.user.role === "admin") {
      if (branchId) {
        filter.branchId = branchId;
      }
    } else {
      if (
        !Array.isArray(req.user.branchIds) ||
        req.user.branchIds.length === 0
      ) {
        return res.status(403).json({
          message: "No branches assigned to this user",
        });
      }

      if (branchId) {
        const hasAccess = req.user.branchIds.some(
          (assignedBranchId) => assignedBranchId.toString() === branchId,
        );

        if (!hasAccess) {
          return res.status(403).json({
            message: "Access denied for this branch",
          });
        }

        filter.branchId = branchId;
      } else {
        filter.branchId = {
          $in: req.user.branchIds,
        };
      }
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

const getPSFDashboard = async (req, res) => {
  try {
    const {
      branchId,
      complaintStatus,
      notConnected,
      fromDate,
      toDate,
      page = 1,
      limit = 20,
    } = req.query;

    let filter = {};

    /*
     * Branch access
     */

    if (req.user.role === "admin") {
      if (branchId) {
        if (!mongoose.isValidObjectId(branchId)) {
          return res.status(400).json({
            message: "Invalid branch ID",
          });
        }

        filter.branchId = branchId;
      }
    } else {
      if (
        !Array.isArray(req.user.branchIds) ||
        req.user.branchIds.length === 0
      ) {
        return res.status(403).json({
          message: "No branches assigned to this user",
        });
      }

      if (branchId) {
        if (!mongoose.isValidObjectId(branchId)) {
          return res.status(400).json({
            message: "Invalid branch ID",
          });
        }

        const hasAccess = req.user.branchIds.some(
          (assignedBranchId) => assignedBranchId.toString() === branchId,
        );

        if (!hasAccess) {
          return res.status(403).json({
            message: "Access denied for this branch",
          });
        }

        filter.branchId = branchId;
      } else {
        filter.branchId = {
          $in: req.user.branchIds,
        };
      }
    }

    /*
     * Complaint status filter
     */

    if (complaintStatus) {
      if (complaintStatus.toLowerCase() === "open") {
        filter.$or = [
          {
            complaintStatus: "Open",
          },
          {
            complaintStatus: "",
          },
          {
            complaintStatus: null,
          },
          {
            complaintStatus: {
              $exists: false,
            },
          },
        ];
      } else {
        filter.complaintStatus = complaintStatus;
      }
    }

    /*
     * Not connected filter
     *
     * firstCallDate is empty or does not exist
     */

    if (notConnected === "true") {
      filter.$and = [
        {
          $or: [
            {
              firstCallDate: {
                $exists: false,
              },
            },
            {
              firstCallDate: null,
            },
            {
              firstCallDate: "",
            },
          ],
        },
      ];
    }

    if (notConnected === "false") {
      filter.$and = [
        {
          firstCallDate: {
            $exists: true,
            $nin: [null, ""],
          },
        },
      ];
    }

    /*
     * Bill date range filter
     */

    if (fromDate || toDate) {
      filter.billDate = {};

      if (fromDate) {
        filter.billDate.$gte = new Date(fromDate);
      }

      if (toDate) {
        const endDate = new Date(toDate);
        endDate.setHours(23, 59, 59, 999);

        filter.billDate.$lte = endDate;
      }
    }

    const currentPage = Math.max(parseInt(page) || 1, 1);

    const recordsPerPage = Math.min(Math.max(parseInt(limit) || 20, 1), 100);

    const skip = (currentPage - 1) * recordsPerPage;

    const totalRecords = await PSFRecord.countDocuments(filter);

    /*
     * Dashboard records
     */

    const records = await PSFRecord.find(filter)
      .populate("branchId", "name code")
      .sort({ billDate: -1 })
      .skip(skip)
      .limit(recordsPerPage);

    /*
     * Summary
     */

    // const totalRecords = records.length;

    const summaryRecords = await PSFRecord.find(filter).select(
      "complaintStatus firstCallDate",
    );

    const openComplaints = summaryRecords.filter((record) => {
      const status = record.complaintStatus?.trim().toLowerCase();

      return status === "open" || !status;
    }).length;

    const closedComplaints = summaryRecords.filter(
      (record) => record.complaintStatus?.trim().toLowerCase() === "closed",
    ).length;

    const notConnectedRecords = summaryRecords.filter(
      (record) => !record.firstCallDate,
    ).length;

    res.json({
      message: "PSF dashboard data fetched successfully",

      summary: {
        totalRecords,
        openComplaints,
        closedComplaints,
        notConnected: notConnectedRecords,
      },

      count: records.length,

      records,
    });
  } catch (error) {
    console.error("Get PSF dashboard error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  getPSFRecords,
  updatePSFRecord,
  getPSFDashboard,
};
