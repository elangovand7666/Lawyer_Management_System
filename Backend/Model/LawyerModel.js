import mongoose from 'mongoose';

const LawyerSchema = new mongoose.Schema({
    caseid: {
        type: String,
        required: true
    },
    lawyerid:{
        type:String,
        required:true
    },
    casename: {
        type: String,
        required: true
    },
    casetype: {
        type: String,
        required: true
    },
    casedescription: {
        type: String,
        required: true
    },
    filingdate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    plaintiffname: {
        type: String,
        required: true
    },
    defendantname: {
        type: String,
        required: true
    },
    clientname: {
        type: String,
        required: true
    },
    clientnumber: {
        type: String,
        required: true
    },
    witness: {
        type: String,
        required: true
    }
}, { collection: 'lawyer' });
export default mongoose.model('Lawyer', LawyerSchema);
