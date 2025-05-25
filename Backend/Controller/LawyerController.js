import Lawyer from '../Model/LawyerModel.js'
import mongoose from 'mongoose';

export const addcase = async (req, res) => {
    try {
        const formData = req.body; // no destructuring
        const newCase = new Lawyer(formData);
        await newCase.save();
        res.status(201).json({ message: "Success", formData: newCase });
    } catch (error) {
        console.error("Add Case Error:", error); // log actual error
        res.status(500).json({ message: "Error", error: error.message });
    }
};


export const view=async(req,res)=>{
    try{
        const id=req.params.id
        const s=await Lawyer.find({lawyerid:id})
        console.log(id,s)
        if(s){
            res.status(200).json({message:s})
        }
        else{
            res.status(400).json({message:"Failed"})
        }
    }
    catch(error)
    {
        res.status(500).json({message:"Error"})
    }
}


export const search = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid case ID format" });
        }

        console.log("Searching for case with ID:", id);

        // Find the document
        const oldData = await Lawyer.findById(id).lean(); // .lean() returns plain JS object
        if (!oldData) {
            return res.status(404).json({ message: "No matching case found" });
        }

        console.log("Found data:", oldData);

        // Delete the old document
        await Lawyer.findByIdAndDelete(id);
        console.log("Old document deleted");

        // Create and save a new document with SAME ID
        const newCase = new Lawyer({
            _id: id, // Setting the old ID back
            ...oldData
        });

        await newCase.save();
        console.log("New document created with same ID:", newCase);

        res.status(200).json({ message: "Success", data: newCase });
    } catch (error) {
        console.error("Error in search:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};



export const update = async (req, res) => {
    try {
        const { id } = req.params;  // Get ID from URL
        const updateData = req.body;

        // Validate if ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid case ID" });
        }

        const updatedLawyer = await Lawyer.findByIdAndUpdate(
            id,  // Use correct ID
            updateData,
            {
                new: true,        // Return updated document
                runValidators: true,  // Ensure validation runs
            }
        );

        if (!updatedLawyer) {
            return res.status(404).json({ message: "Case not found" });
        }

        res.status(200).json({ message: "Success", data: updatedLawyer });

    } catch (error) {
        res.status(500).json({ message: "Error", error: error.message });
    }
};

export const deletee = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedLawyer = await Lawyer.findByIdAndDelete(id);
        if (!deletedLawyer) {
            return res.status(404).json({ message: "Case not found" });
        }
        res.status(200).json({ message: "Success", data: deletedLawyer });
    } catch (error) {
        res.status(500).json({ message: "Error", error: error.message });
    }
};
