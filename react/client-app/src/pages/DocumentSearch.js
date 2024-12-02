import React, { useState, useEffect } from 'react';
import { dbFs, auth } from '../firebase/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const DocumentSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [documents, setDocuments] = useState([]);
    const [allDocs, setAllDocs] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Ensure user is authenticated
        if (!auth.currentUser) {
            navigate('/login');
            return;
        }

        const fetchUserDocs = () => {
            // Query only documents created by the current user
            const q = query(
                collection(dbFs, 'documents'), 
                where('createdBy', '==', auth.currentUser.uid)
            );

            onSnapshot(q, (snapshot) => {
                const userDocs = snapshot.docs.map(doc => ({ 
                    id: doc.id, 
                    ...doc.data() 
                }));
                setAllDocs(userDocs);
                setDocuments(userDocs);
            });
        };

        fetchUserDocs();
    }, [navigate]);

    const handleSearch = () => {
        if (!searchTerm) {
            setDocuments(allDocs);
            return;
        }

        // Filter documents client-side since Firestore has limitations on string searches
        const filteredDocs = allDocs.filter(doc => 
            doc.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setDocuments(filteredDocs);
    };

    const handleShowAll = () => {
        setDocuments(allDocs);
    };

    const handlePreview = (id) => {
        navigate(`/edit?id=${id}`);
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-2xl font-bold mb-4">Your Documents</h1>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by document name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-gray-300 p-2 rounded mr-2 w-1/2"
                />
                <button
                    onClick={handleSearch}
                    className="bg-blue-500 text-white py-2 px-4 rounded mr-2"
                >
                    Search
                </button>
                <button
                    onClick={handleShowAll}
                    className="bg-gray-500 text-white py-2 px-4 rounded"
                >
                    Show All Documents
                </button>
                <button
                    onClick={() => navigate('/edit')}
                    className="bg-green-500 text-white py-2 px-4 rounded ml-2"
                >
                    Create New Document
                </button>
            </div>
            <div>
                {documents.length === 0 ? (
                    <p className="text-gray-600">No documents found. Create a new one!</p>
                ) : (
                    documents.map((doc) => (
                        <div key={doc.id} className="bg-white shadow p-4 rounded mb-4">
                            <h2 className="font-bold text-xl">{doc.name || 'Untitled Document'}</h2>
                            <p className="text-gray-600 mb-2">
                                Created: {doc.createdAt?.toDate()?.toLocaleDateString() || 'Unknown date'}
                            </p>
                            <button
                                onClick={() => handlePreview(doc.id)}
                                className="bg-green-500 text-white py-2 px-4 rounded mt-2"
                            >
                                Open Document
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default DocumentSearch; 