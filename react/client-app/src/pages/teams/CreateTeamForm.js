import React, { useState } from 'react';
import { createTeam } from '../../firebase/teamService';
import { useAuth } from '../../contexts/authContext';

const CreateTeamForm = () => {
  const [teamName, setTeamName] = useState('');
  const [description, setDescription] = useState('');
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTeam({
        name: teamName,
        description,
        members: [user.uid],
        owner: user.uid,
      });
      setTeamName('');
      setDescription('');
    } catch (error) {
      console.error('Error creating team:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Team Name</label>
        <input
          type="text"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
          rows="3"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Create Team
      </button>
    </form>
  );
};

export default CreateTeamForm;