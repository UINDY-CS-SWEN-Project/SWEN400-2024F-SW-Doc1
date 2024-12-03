import React, { useState, useEffect } from "react";
import { dbFs, auth } from "../firebase/firebase";
import { collection, query, where, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const DocumentSearch = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [documents, setDocuments] = useState([]);
    const [allDocs, setAllDocs] = useState([]);
    const [showDocs, setShowDocs] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!auth.currentUser) {
            navigate("/login");
            return;
        }

        const fetchDocs = () => {
            const q = query(
                collection(dbFs, "documents"),
                where("createdBy", "==", auth.currentUser.uid)
            );

            onSnapshot(q, (snapshot) => {
                const fetchedDocs = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                console.log("Fetched Documents:", fetchedDocs); // Debug log
                setAllDocs(fetchedDocs);
            });
            
        };

        fetchDocs();
    }, [navigate]);

    const handleSearch = () => {
        const filteredDocs = allDocs.filter((doc) =>
            doc.name?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setDocuments(filteredDocs);
        setShowDocs(true); // Ensure search results are displayed
    };
    
    
    

    const toggleShowAll = () => {
        setShowDocs(!showDocs);
        setDocuments(showDocs ? [] : allDocs);
    };

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(dbFs, "documents", id));
            setDocuments((prev) => prev.filter((doc) => doc.id !== id));
            setAllDocs((prev) => prev.filter((doc) => doc.id !== id));
            alert("Document deleted successfully!");
        } catch (error) {
            console.error("Error deleting document:", error);
            alert("Failed to delete document.");
        }
    };

    const handleEdit = (id) => {
        navigate(`/edit?id=${id}`);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1>Your Documents</h1>
            <input
                type="text"
                placeholder="Search by document name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 p-2 rounded mr-2 w-1/2"
            />
            <button onClick={handleSearch} className="bg-blue-500 text-white py-2 px-4 rounded mr-2">
                Search
            </button>
            <button onClick={toggleShowAll} className="bg-gray-500 text-white py-2 px-4 rounded">
                {showDocs ? "Hide Documents" : "Show All Documents"}
            </button>
            <button
    onClick={() => navigate("/home")}
    className="bg-gray-500 text-white py-2 px-4 rounded mr-2"
>
    Home
</button>
            {showDocs &&
                documents.map((doc) => (
                    <div key={doc.id} className="bg-white shadow p-4 rounded mb-4">
                        <h2>{doc.name}</h2>
                        <p>Created: {doc.createdAt?.toDate()?.toLocaleDateString() || "Unknown date"}</p>
                        <button
                            onClick={() => handleEdit(doc.id)}
                            className="bg-green-500 text-white py-2 px-4 rounded mr-2"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => handleDelete(doc.id)}
                            className="bg-red-500 text-white py-2 px-4 rounded"
                        >
                            Delete
                        </button>
                        
                    </div>
                ))}
        </div>
    );
};

export default DocumentSearch;
