import React, { useState, useRef } from "react";
import "./AddCase.css";
import { enqueueSnackbar, SnackbarProvider } from "notistack";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

function AddCase() {
    const navigate=useNavigate()
    const {id}=useParams()
  const [formData, setFormData] = useState({
    caseid: "",
    lawyerid: id,
    casename: "",
    casetype: "",
    casedescription: "",
    filingdate: new Date().toISOString().slice(0, 10),
    status: "",
    plaintiffname: "",
    defendantname: "",
    clientname: "",
    clientnumber: "",
    witness: "File"
  });
  
  const [errors, setErrors] = useState({});
  const [selectedFileName, setSelectedFileName] = useState("");
  const fileInputRef = useRef(null);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };
  
  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFileName(files[0].name);      
      if (files[0].size > 5000000) {
        setErrors({
          ...errors,
          witness: "Max file size is 5MB"
        });
      } else if (!["image/jpeg", "image/png", "image/jpg", "application/pdf"].includes(files[0].type)) {
        setErrors({
          ...errors,
          witness: "Only .jpg, .jpeg, .png, and .pdf files are accepted"
        });
      } else {
        setErrors({
          ...errors,
          witness: null
        });
      }
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      'caseid', 'lawyerid', 'casename', 'casetype', 'casedescription', 
      'filingdate', 'status', 'plaintiffname', 'defendantname', 
      'clientname', 'clientnumber'
    ];
    
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1).replace('id', ' ID')} is required`;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!fileInputRef.current.files[0]) {
      setErrors({ ...errors, witness: "Please upload a witness document" });
      return;
    }
  
    const file = fileInputRef.current.files[0];
  
    // Validate before file upload
    if (!validateForm()) {
      return;
    }
  
    const uploadData = new FormData();
    uploadData.append("file", file); // The key here must match what your Django backend expects
  
    try {
      const uploadRes = await axios.post("http://127.0.0.1:8000/upload/", uploadData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
  
      if (uploadRes.data.message == "Success") {
        const updatedFormData = { ...formData, witness: uploadRes.data.filename };
        formData.witness = uploadRes.data.file_id; // Update the formData with the uploaded file name
        console.log("Updated Form Data:", formData);
        const caseRes = await axios.post("http://localhost:5000/api/case/add", formData);
        if (caseRes.data.message == "Success") {
          enqueueSnackbar("Case added Successfully", { variant: "success" });
          navigate(`/home/${id}`);
        } else {
          enqueueSnackbar("Failed to add case", { variant: "warning" });
        }
      } else {
        enqueueSnackbar("File upload failed", { variant: "error" });
      }
    } catch (error) {
      console.error("Error:", error);
      enqueueSnackbar("An error occurred", { variant: "error" });
    }
  };
    
  const home=()=>{
    navigate(`/home/${id}`)
  }
  
  return (
    <SnackbarProvider maxSnack={3}>
        <div className="top">
                <img className="home-logo" src="/src/assets/logo.png" alt="Law Firm Logo"></img>
                <h2>LawManager</h2>
                <div className="topbs">
                    <button className="tbutton" onClick={home}>Home</button>
                    <button className="tbutton" onClick={()=>{navigate('/')}}>Logout</button>
                </div>
            </div>
    <div className="add-case-cont">
      <div className="add-case-form">
        <div className="add-case-form-header">
          <h1 className="add-case-form-title">Add New Case</h1>
          <p className="add-case-form-subtitle">Complete the form below to add a new case to the system</p>
        </div>
        
        <div className="add-case-form-body">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Case Details Section */}
            <div className="add-case-section">
              <h2 className="add-case-section-title">
                Case Information
              </h2>
              
              <div className="add-case-grid">
                {/* Case ID */}
                <div>
                  <label htmlFor="caseid" className="form-label">
                    Case ID
                  </label>
                  <input
                    id="caseid"
                    name="caseid"
                    type="text"
                    className="add-case-input"
                    value={formData.caseid}
                    onChange={handleInputChange}
                  />
                  {errors.caseid && <div className="form-message">{errors.caseid}</div>}
                </div>
                
                {/* Lawyer ID */}
                <div>
                  <label htmlFor="lawyerid" className="form-label">
                    Lawyer ID
                  </label>
                  <input
                    id="lawyerid"
                    name="lawyerid"
                    type="text"
                    className="add-case-input"
                    value={formData.lawyerid}
                    readOnly
                  />
                  {errors.lawyerid && <div className="form-message">{errors.lawyerid}</div>}
                </div>
                
                {/* Case Name */}
                <div>
                  <label htmlFor="casename" className="form-label">
                    Case Name
                  </label>
                  <input
                    id="casename"
                    name="casename"
                    type="text"
                    className="add-case-input"
                    value={formData.casename}
                    onChange={handleInputChange}
                  />
                  {errors.casename && <div className="form-message">{errors.casename}</div>}
                </div>
                
                {/* Case Type */}
                <div>
                  <label htmlFor="casetype" className="form-label">
                    Case Type
                  </label>
                  <input
                    id="casetype"
                    name="casetype"
                    type="text"
                    className="add-case-input"
                    value={formData.casetype}
                    onChange={handleInputChange}
                  />
                  {errors.casetype && <div className="form-message">{errors.casetype}</div>}
                </div>

                {/* Filing Date */}
                <div>
                  <label htmlFor="filingdate" className="form-label">
                    Filing Date
                  </label>
                  <input
                    id="filingdate"
                    name="filingdate"
                    type="date"
                    className="add-case-input"
                    value={formData.filingdate}
                    onChange={handleInputChange}
                  />
                  {errors.filingdate && <div className="form-message">{errors.filingdate}</div>}
                </div>
                
                {/* Status */}
                <div>
                  <label htmlFor="status" className="form-label">
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    className="add-case-input"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="">Select status</option>
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                  </select>
                  {errors.status && <div className="form-message">{errors.status}</div>}
                </div>
              </div>
              
              {/* Case Description - Full Width */}
              <div className="mt-5">
                <label htmlFor="casedescription" className="form-label">
                  Case Description
                </label>
                <textarea
                  id="casedescription"
                  name="casedescription"
                  className="add-case-textarea"
                  value={formData.casedescription}
                  onChange={handleInputChange}
                />
                {errors.casedescription && <div className="form-message">{errors.casedescription}</div>}
              </div>
            </div>
            
            {/* Involved Parties Section */}
            <div className="add-case-section">
              <h2 className="add-case-section-title">
                Involved Parties
              </h2>
              
              <div className="add-case-grid">
                {/* Plaintiff Name */}
                <div>
                  <label htmlFor="plaintiffname" className="form-label">
                    Plaintiff Name
                  </label>
                  <input
                    id="plaintiffname"
                    name="plaintiffname"
                    type="text"
                    className="add-case-input"
                    value={formData.plaintiffname}
                    onChange={handleInputChange}
                  />
                  {errors.plaintiffname && <div className="form-message">{errors.plaintiffname}</div>}
                </div>
                
                {/* Defendant Name */}
                <div>
                  <label htmlFor="defendantname" className="form-label">
                    Defendant Name
                  </label>
                  <input
                    id="defendantname"
                    name="defendantname"
                    type="text"
                    className="add-case-input"
                    value={formData.defendantname}
                    onChange={handleInputChange}
                  />
                  {errors.defendantname && <div className="form-message">{errors.defendantname}</div>}
                </div>
                
                {/* Client Name */}
                <div>
                  <label htmlFor="clientname" className="form-label">
                    Client Name
                  </label>
                  <input
                    id="clientname"
                    name="clientname"
                    type="text"
                    className="add-case-input"
                    value={formData.clientname}
                    onChange={handleInputChange}
                  />
                  {errors.clientname && <div className="form-message">{errors.clientname}</div>}
                </div>
                
                {/* Client Number */}
                <div>
                  <label htmlFor="clientnumber" className="form-label">
                    Client Number
                  </label>
                  <input
                    id="clientnumber"
                    name="clientnumber"
                    type="tel"
                    className="add-case-input"
                    maxLength="10"
                    minLength="10"
                    value={formData.clientnumber}
                    onChange={handleInputChange}
                  />
                  {errors.clientnumber && <div className="form-message">{errors.clientnumber}</div>}
                </div>
                
                {/* Witness Document - File Upload */}
                <div className="md-col-span-2">
                  <label htmlFor="witness-file" className="form-label">
                    Witness Document
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="witness-file"
                    name="witness"
                    accept=".jpg,.jpeg,.png,.pdf"
                    className="add-case-file-input"
                    onChange={handleFileChange}
                  />
                  {selectedFileName && (
                    <div className="selected-file">
                      Selected file: {selectedFileName}
                    </div>
                  )}
                  <div className="form-description">
                    Upload witness evidence (images or PDF). Max file size: 5MB.
                  </div>
                  {errors.witness && <div className="form-message">{errors.witness}</div>}
                </div>
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <button 
                type="submit" 
                className="add-case-submit-btn"
              >
                Submit Case
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </SnackbarProvider>
  );
}

export default AddCase;