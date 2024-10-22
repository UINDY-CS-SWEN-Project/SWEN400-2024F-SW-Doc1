import React, { useState } from 'react';
import axios from 'axios';

const DocumentSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [documents, setDocuments] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await axios.get('http://localhost:8080/documentsearch', {
        params: { q: searchTerm }
      });
      setDocuments(response.data.documents);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  return (
    <div>
      <h2>Document Search</h2>
      <input
        type="text"
        placeholder="Search for a document"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      <div>
        <h3>Search Results:</h3>
        {documents.length > 0 ? (
          <ul>
            {documents.map((doc, index) => (
              <li key={index}>{doc}</li>
            ))}
          </ul>
        ) : (
          <p>No documents found</p>
        )}
      </div>
    </div>
  );
};

export default DocumentSearch;
