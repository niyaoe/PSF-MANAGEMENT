const bcrypt = require("bcryptjs");

const User = require("../models/User");
const Branch = require("../models/Branch");

const createUser = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            role,
            branchId
        } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({
                message: "Name, email, password and role are required"
            });
        }

        if (!["manager", "employee"].includes(role)) {
            return res.status(400).json({
                message: "Only manager or employee users can be created"
            });
        }

        if (!branchId) {
            return res.status(400).json({
                message: "Branch is required"
            });
        }

        const branch = await Branch.findById(branchId);

        if (!branch || !branch.isActive) {
            return res.status(400).json({
                message: "Invalid or inactive branch"
            });
        }

        const existingUser = await User.findOne({
            email: email.toLowerCase()
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Email already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            role,
            branchId,
            isActive: true
        });

        const userResponse = await User.findById(user._id)
            .select("-password")
            .populate("branchId", "name code");

        res.status(201).json({
            message: `${role} created successfully`,
            user: userResponse
        });
    } catch (error) {
        console.error("Create user error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    createUser
};