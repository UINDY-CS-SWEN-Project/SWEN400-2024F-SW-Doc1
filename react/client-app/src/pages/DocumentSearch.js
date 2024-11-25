import React, { useState, useEffect } from 'react';
import { dbFs } from '../firebase/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';


const DocumentSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [documents, setDocuments] = useState([]);
  const [allDocs, setAllDocs] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchAllDocs = () => {
      const q = query(collection(dbFs, 'documents')); // Replace 'documents' with your Firestore collection name
      onSnapshot(q, (snapshot) => {
        setAllDocs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });
    };
    fetchAllDocs();
  }, []);


  const handleSearch = () => {
    if (!searchTerm) return;
    const q = query(
      collection(dbFs, 'documents'),
      where('title', '>=', searchTerm),
      where('title', '<=', searchTerm + '\uf8ff')
    );
    onSnapshot(q, (snapshot) => {
      setDocuments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  };


  const handleShowAll = () => {
    setDocuments(allDocs);
  };


  const handlePreview = (id) => {
    navigate(`/edit?id=${id}`);
  };


  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-4">Document Search</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by title"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 p-2 rounded mr-2"
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
      </div>
      <div>
        {documents.map((doc) => (
          <div key={doc.id} className="bg-white shadow p-4 rounded mb-4">
            <h2 className="font-bold text-xl">{doc.title}</h2>
            <p>{doc.content.substring(0, 100)}...</p> {/* Truncated preview */}
            <button
              onClick={() => handlePreview(doc.id)}
              className="bg-green-500 text-white py-2 px-4 rounded mt-2"
            >
              Preview
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};


export default DocumentSearch;


