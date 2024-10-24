import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  // Example: Fetching some data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/home'); // Adjust the API endpoint as needed
        console.log("Fetched data:", response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to Our App</h1>
        <p className="mb-6">Discover amazing features and connect with others!</p>
        <div className="space-x-4">
          <Link to="/template" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
            Go to Template Page
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
