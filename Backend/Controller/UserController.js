import Profile from '../Model/UserModel.js'

export const add = async (req, res) => {
    try {
        const { name, email, password, age, phone } = req.body;
        console.log("Received Data:", req.body); // Debugging
        const user = await Profile.findOne({ email });
        if (user) {
            return res.status(200).json({ message: "User already exists" });
        }
        const newUser = new Profile({ name, email, password, age, phone });
        const savedUser = await newUser.save();
        return res.status(200).json({ message: "Success", id: savedUser._id });
    } catch (error) {
        console.error("Error saving user:", error);
        return res.status(500).json({ message: "Error", error: error.message });
    }
};


export const login = async (req, res) => {
    try {
        const email=req.params.email
        const password=req.params.password
        const user = await Profile.findOne({ email }); // Use findOne()

        console.log(email,password,user); // Debugging

        if (!user) {
            return res.status(200).json({ message: "Invalid details, User not Found" });
        }

        if (password === user.password) { // Ensure password comparison is correct
            return res.status(200).json({ message: "Login successful", id: user._id });
        } else {
            return res.status(200).json({ message: "Password Incorrect" });
        }

    } catch (error) {
        res.status(500).json({ message: "Error", error: error.message });
    }
};



export const view=async(req,res)=>{
    try{
        const id=req.params.id
        const s = await Profile.findOne({ _id: id });
        console.log(id,s)
        if(s){
            res.status(200).json({message:s})
        }
        else{
            res.status(200).json({message:"Failed"})
        }
    }
    catch(error)
    {
        res.status(500).json({message:"Error"})
    }
}


export const update = async (req, res) => {
    try {
        const { id } = req.params;
        const { userData } = req.body; 
        const uEx = await Profile.findById(id);
        console.log("Existing User:", uEx);
        console.log("New Data:", userData);
        if (!uEx) {
            return res.status(404).json({ message: "User Not Found" });
        }
        if (!userData || Object.keys(userData).length === 0) {
            return res.status(400).json({ message: "No data provided for update" });
        }
        const s = await Profile.updateOne({ _id: id }, { $set: userData });
        console.log("Update Result:", s);
        if (s.modifiedCount > 0) {
            res.status(200).json({ message: "Success" });
        } else {
            res.status(400).json({ message: "No changes made" });
        }
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

    

