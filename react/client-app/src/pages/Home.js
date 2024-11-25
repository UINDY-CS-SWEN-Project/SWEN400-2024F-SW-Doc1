import React from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';


const Home = () => {
  const navigate = useNavigate();
  const auth = getAuth();


  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };


  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-md p-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Home</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>
      <div className="p-8 flex justify-center space-x-4">
        <button
          onClick={() => navigate('/teams')}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded"
        >
          Go to Teams
        </button>
        <button
          onClick={() => navigate('/template')}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded"
        >
          Go to Template
        </button>
        <button
          onClick={() => navigate('/search')}
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-6 rounded"
        >
          Go to Search
        </button>
        <button
          onClick={() => navigate('/edit')}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-6 rounded"
        >
          Create New Document
        </button>
      </div>
    </div>
  );
};


export default Home;
