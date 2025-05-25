import { SnackbarProvider, useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./CaseView.css";

function CaseViewContent() {
    const { id } = useParams();
    const navigate=useNavigate()
    const { enqueueSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        caseid: "",
        lawyerid:"",
        casename: "",
        casetype: "",
        casedescription: "",
        filingdate: new Date().toISOString().slice(0, 10),
        status: "",
        plaintiffname: "",
        defendantname: "",
        clientname: "",
        clientnumber: "",
        witness: ""
    });
    const [fileUrl, setFileUrl] = useState(null);

    useEffect(() => {
        setLoading(true);
        axios.get(`http://localhost:5000/api/case/search/${id}`)
            .then((res) => {
                if (res.data && res.data.data) {
                    const caseData = Array.isArray(res.data.data) ? res.data.data[0] : res.data.data;
                    axios.get(`http://127.0.0.1:8000/view/${caseData.witness}`, { responseType: "blob" })
                        .then((fileRes) => {
                            // Handle file content as blob, store URL in state
                            const fileBlob = fileRes.data;
                            const fileUrl = URL.createObjectURL(fileBlob); // Create object URL for the blob
                            setFileUrl(fileUrl);
                        })
                        .catch((error) => {
                            console.error("Error fetching file:", error);
                            enqueueSnackbar("Failed to load the file", { variant: "error" });
                        });
                    setFormData(prevData => ({
                        ...prevData,
                        ...caseData,
                        filingdate: caseData.filingdate 
                            ? caseData.filingdate.split("T")[0] // Extract YYYY-MM-DD
                            : new Date().toISOString().slice(0, 10) // Default to today
                    }));
                    console.log(caseData);
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching case:", error);
                enqueueSnackbar("Failed to load case details", { variant: "error" });
                setLoading(false);
            });
    }, [id, enqueueSnackbar]);

    const del=()=>{
        axios.delete(`http://localhost:5000/api/case/delete/${id}`)
        .then((res) => {
            if(res.data.message=="Success")
            {
                enqueueSnackbar("Case Deleted", { variant: "success" });
                navigate(`/home/${formData.lawyerid}`)
            }
            else{
                enqueueSnackbar("Failed to delete case", { variant: "error" });
            }
        })
        .catch((error) => {
            console.error("Error deleting case:", error);
            enqueueSnackbar("Failed to delete case", { variant: "error" });
        });
    }

    if (loading) {
        return (
            <div className="caseview-loading">
                <div className="caseview-loading-spinner"></div>
                <p>Loading case information...</p>
            </div>
        );
    }
    const home=()=>{
        navigate(`/home/${formData.lawyerid}`)
    }
    const update=()=>{
        navigate(`/updatecase/${id}`)
    }

    return (
        <>
        <div className="top">
                <img className="home-logo" src="/src/assets/logo.png" alt="Law Firm Logo"></img>
                <h2>LawManager</h2>
                <div className="topbs">
                    <button className="tbutton" onClick={home}>Home</button>
                    <button className="tbutton" onClick={()=>{navigate('/')}}>Logout</button>
                </div>
            </div>
        <div className="caseview-container">
            <div className="caseview-card">
                <div className="caseview-header">
                    <h1 className="caseview-title">Case Details</h1>
                    <div className="caseview-status-badge" data-status={formData.status}>
                        {formData.status || "Unknown"}
                    </div>
                </div>

                <div className="caseview-body">
                    {/* Case Information Section */}
                    <section className="caseview-section">
                        <h2 className="caseview-section-title">Case Information</h2>
                        
                        <div className="caseview-grid">
                            <div className="caseview-field">
                                <span className="caseview-label">Case ID</span>
                                <div className="caseview-value" id="cv-caseid">{formData.caseid}</div>
                            </div>
                            
                            <div className="caseview-field">
                                <span className="caseview-label">Case Name</span>
                                <div className="caseview-value" id="cv-casename">{formData.casename}</div>
                            </div>
                            
                            <div className="caseview-field">
                                <span className="caseview-label">Case Type</span>
                                <div className="caseview-value" id="cv-casetype">{formData.casetype}</div>
                            </div>
                            
                            <div className="caseview-field">
                                <span className="caseview-label">Filing Date</span>
                                <div className="caseview-value" id="cv-filingdate">{formData.filingdate}</div>
                            </div>
                        </div>
                        
                        <div className="caseview-field caseview-full-width">
                            <span className="caseview-label">Case Description</span>
                            <div className="caseview-value caseview-description" id="cv-casedescription">
                                {formData.casedescription || "No description provided."}
                            </div>
                        </div>
                    </section>
                    
                    {/* Involved Parties Section */}
                    <section className="caseview-section">
                        <h2 className="caseview-section-title">Involved Parties</h2>
                        
                        <div className="caseview-grid">
                            <div className="caseview-field">
                                <span className="caseview-label">Plaintiff</span>
                                <div className="caseview-value" id="cv-plaintiffname">{formData.plaintiffname}</div>
                            </div>
                            
                            <div className="caseview-field">
                                <span className="caseview-label">Defendant</span>
                                <div className="caseview-value" id="cv-defendantname">{formData.defendantname}</div>
                            </div>
                            
                            <div className="caseview-field">
                                <span className="caseview-label">Client Name</span>
                                <div className="caseview-value" id="cv-clientname">{formData.clientname}</div>
                            </div>
                            
                            <div className="caseview-field">
                                <span className="caseview-label">Client Number</span>
                                <div className="caseview-value" id="cv-clientnumber">{formData.clientnumber}</div>
                            </div>
                        </div>
                    </section>
                    
                    {/* Witness Document */}
                    {formData.witness && (
                        <section className="caseview-section">
                            
                            <div className="caseview-document">
                                <div className="caseview-document-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                        <polyline points="14 2 14 8 20 8"></polyline>
                                        <line x1="16" y1="13" x2="8" y2="13"></line>
                                        <line x1="16" y1="17" x2="8" y2="17"></line>
                                        <polyline points="10 9 9 9 8 9"></polyline>
                                    </svg>
                                </div>
                                <div className="caseview-document-info">
                                    
                                    <a href={fileUrl} // Use the blob URL for the PDF
                                    width="100%"
                                    height="500px"
                                    title="Witness Document"
                                    frameBorder="0">
                                        View Document
                                    </a>
                                </div>
                            </div>
                        </section>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="caseview-actions">
                        <button className="caseview-back-button" onClick={() => window.history.back()}>
                            Back
                        </button>
                        <button className="caseview-delete-button" onClick={() => del()}>
                            Delete
                        </button>
                        <button className="caseview-edit-button" onClick={()=>update()}>
                            Edit Case
                        </button>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}

function Caseview() {
    return (
        <SnackbarProvider maxSnack={1}>
            <CaseViewContent />
        </SnackbarProvider>
    );
}

export default Caseview;