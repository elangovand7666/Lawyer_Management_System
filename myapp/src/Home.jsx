import { useNavigate, useParams } from "react-router-dom";
import "./App.css";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { enqueueSnackbar, SnackbarProvider } from "notistack";

function Home() {
    const { id } = useParams();
    const [cases, setCases] = useState([]); // Stores all cases
    const [filteredCases, setFilteredCases] = useState([]); // Stores searched cases
    const [recentCases, setRecentCases] = useState([]); // Stores last 3 recent cases
    const [searchs, setSearchs] = useState("");

    useEffect(() => {
        axios.get(`http://localhost:5000/api/case/view/${id}`)
            .then((res) => {
                console.log("API Response:", res.data);
                const allCases = res.data.message || [];
                setCases(allCases);
                setFilteredCases(allCases);
                setRecentCases(allCases.slice(-3)); // Get the last 3 cases
            })
            .catch((error) => {
                console.error("Error fetching cases:", error);
                setCases([]);
                setFilteredCases([]);
                setRecentCases([]);
            });
    }, [id]);

    const del = (caseId) => {
        axios.delete(`http://localhost:5000/api/case/delete/${caseId}`)
            .then((res) => {
                if (res.data.message === "Success") {
                    enqueueSnackbar("Case Deleted", { variant: "success" });
                    setFilteredCases(filteredCases.filter(caseItem => caseItem._id !== caseId));
                    setRecentCases(recentCases.filter(caseItem => caseItem._id !== caseId));
                } else {
                    enqueueSnackbar("Failed to delete case", { variant: "error" });
                }
            })
            .catch((error) => {
                console.error("Error deleting case:", error);
                enqueueSnackbar("Failed to delete case", { variant: "error" });
            });
    };

    const navigate = useNavigate();
    const profile = () => navigate(`/profile/${id}`);
    const add_case = () => navigate(`/addcase/${id}`);
    const update = (caseId) => navigate(`/updatecase/${caseId}`);
    const view = (caseId) => navigate(`/caseview/${caseId}`);

    const getImageForCase = (description) => {
        const keywords = [
            { keyword: "murder", image: "/murder.jpg" },
            { keyword: "theft", image: "/theft.jpg" },
            { keyword: "fraud", image: "/fraud.jpg" },
            { keyword: "divorce", image: "/divorce.jpg" },
            { keyword: "accident", image: "/accident.jpg" },
            { keyword: "civil", image: "/civil.jpg" }
        ];

        const matchedKeyword = keywords.find(item => 
            description.toLowerCase().includes(item.keyword)
        );

        return matchedKeyword ? matchedKeyword.image : "/default.png"; 
    };

    const searching = (e) => {
        e.preventDefault();
        if (searchs.trim() === "") {
            setFilteredCases(cases);
        } else {
            const filtered = cases.filter(caseItem => 
                caseItem.casename.toLowerCase().includes(searchs.toLowerCase()) ||
                caseItem.casedescription.toLowerCase().includes(searchs.toLowerCase())
            );
            setFilteredCases(filtered);
        }
    };

    return (
        <SnackbarProvider maxSnack={3}>
            <div className="top">
                <img className="home-logo" src="/src/assets/logo.png" alt="Law Firm Logo" />
                <h2>LawManager</h2>
                <div className="topbs">
                    <button className="tbutton" onClick={profile}>Profile</button>
                    <button className="tbutton" onClick={() => navigate('/')}>Logout</button>
                </div>
            </div>

            <div className="search-container">
                <form className="search" onSubmit={searching}>
                    <input 
                        type="text" 
                        value={searchs}
                        onChange={(e) => setSearchs(e.target.value)} 
                        placeholder="Search for cases..."
                    />
                    <button type="submit">Search</button>
                </form>
            </div>

            <div className="cont1">
                <div className="sub1">
                    <h2>Add New Case</h2>
                    <button className="add_button" onClick={add_case}>+</button>
                </div>
                <div className="sub1">
                    <h2>Recently Viewed</h2>
                    {Array.isArray(recentCases) && recentCases.length > 0 ? (
                        recentCases.map((caseItem, index) => {
                            const caseImage = getImageForCase(caseItem.casetype);
                            return (
                                <div key={index} className="recent-case">
                                    <div onClick={() => view(caseItem._id)}>
                                        <img src={caseImage} />
                                        <h2>{caseItem.casename} #{caseItem.caseid}</h2>
                                        <h3 className="description">{caseItem.casedescription}</h3>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p>No recent cases available</p>
                    )}
                </div>
            </div>

            <h2 className="catogory">List of Cases</h2>
            <div className="cont2">
            {Array.isArray(filteredCases) && filteredCases.length > 0 ? (
                <>
                    {filteredCases.filter(c => c.status === "Active").map((caseItem, index) => {
                        const caseImage = getImageForCase(caseItem.casetype);
                        return (
                            <div key={index} className="Home-case">
                                <div onClick={() => view(caseItem._id)}>
                                    <img src={caseImage} alt={caseItem.casename} />
                                    <div style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between"
                                    }}>
                                        <h2 style={{ margin: 0 }}>{caseItem.casename} #{caseItem.caseid}</h2>
                                        <h6 style={{
                                            padding: "5px 10px",
                                            margin: "5px",
                                            borderRadius: "30px",
                                            backgroundColor: "green",
                                            color: "white"
                                        }}>{caseItem.status}</h6>
                                    </div>
                                    <h3 className="description">{caseItem.casedescription}</h3>
                                </div>
                                <button className="update" onClick={(event) => { 
                                    event.stopPropagation(); 
                                    update(caseItem._id);
                                }}>
                                    Update
                                </button>
                                <button className="delete" onClick={() => del(caseItem._id)}>Delete</button>
                            </div>
                        );
                    })}

                    {filteredCases.filter(c => c.status !== "Active").map((caseItem, index) => {
                        const caseImage = getImageForCase(caseItem.casetype);
                        return (
                            <div key={index} className="Home-case">
                                <div onClick={() => view(caseItem._id)}>
                                    <img src={caseImage} alt={caseItem.casename} />
                                    <div style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between"
                                    }}>
                                        <h2 style={{ margin: 0 }}>{caseItem.casename} #{caseItem.caseid}</h2>
                                        <h6 style={{
                                            padding: "5px 10px",
                                            margin: "5px",
                                            borderRadius: "30px",
                                            backgroundColor: "red",
                                            color: "white"
                                        }}>{caseItem.status}</h6>
                                    </div>
                                    <h3 className="description">{caseItem.casedescription}</h3>
                                </div>
                                <button className="update" onClick={(event) => { 
                                    event.stopPropagation(); 
                                    update(caseItem._id);
                                }}>
                                    Update
                                </button>
                                <button className="delete" onClick={() => del(caseItem._id)}>Delete</button>
                            </div>
                        );
                    })}
                </>
            ) : (
                <p>No cases available</p>
            )}
            </div>

            <footer className="footer">
                <h3>2025 &copy; Designed by TEAM A20</h3>
            </footer>
        </SnackbarProvider>
    );
}

export default Home;
