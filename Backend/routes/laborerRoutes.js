const express = require("express");
const router = express.Router();
const Laborer = require("../components/laborer");

// Store laborer details
router.post("/", async (req, res) => {
    try {
        const { name, wage, mobile } = req.body;

        if (!name || !wage || !mobile) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }

        const newLaborer = new Laborer({ name, wage, mobile });
        await newLaborer.save();

        res.json({ success: true, message: "Laborer details saved successfully!" });
    } catch (error) {
        console.error("Error saving laborer details:", error);
        res.status(500).json({ success: false, message: "Server error. Please try again." });
    }
});


// Get all laborers
router.get("/", async (req, res) => {
    try {
        const laborers = await Laborer.find();
        res.json({ success: true, laborers });
    } catch (error) {
        console.error("Error fetching laborers:", error);
        res.status(500).json({ success: false, message: "Failed to retrieve laborers." });
    }
});
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedLaborer = await Laborer.findByIdAndDelete(id);

        if (!deletedLaborer) {
            return res.status(404).json({ success: false, message: "Laborer not found!" });
        }

        res.json({ success: true, message: "Laborer deleted successfully!" });
    } catch (error) {
        console.error("Error deleting laborer:", error);
        res.status(500).json({ success: false, message: "Failed to delete laborer." });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, wage, mobile } = req.body;

        if (!name || !wage || !mobile) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }

        const updatedLaborer = await Laborer.findByIdAndUpdate(id, { name, wage, mobile }, { new: true });

        if (!updatedLaborer) {
            return res.status(404).json({ success: false, message: "Laborer not found." });
        }

        res.json({ success: true, message: "Laborer updated successfully!", laborer: updatedLaborer });
    } catch (error) {
        console.error("Error updating laborer details:", error);
        res.status(500).json({ success: false, message: "Server error. Please try again." });
    }
});


module.exports = router;
