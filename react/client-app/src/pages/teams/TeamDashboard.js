// pages/Teams/TeamDashboard.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/authContext';
import { 
  createTeam, 
  getUserTeams, 
  addTeamMember, 
  removeTeamMember 
} from '../../firebase/teamService';

const TeamDashboard = () => {
  const { currentUser } = useAuth();
  const [teams, setTeams] = useState([]);
  const [newTeamName, setNewTeamName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(null);

  useEffect(() => {
    const loadTeams = async () => {
      if (currentUser?.email) {
        const userTeams = await getUserTeams(currentUser.email);
        setTeams(userTeams);
      }
    };
    loadTeams();
  }, [currentUser]);

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    try {
      await createTeam({
        name: newTeamName,
        createdBy: currentUser.email
      });
      setNewTeamName('');
      // Refresh teams list
      const userTeams = await getUserTeams(currentUser.email);
      setTeams(userTeams);
    } catch (error) {
      console.error('Error creating team:', error);
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!selectedTeam) return;

    try {
      await addTeamMember(selectedTeam.id, newMemberEmail);
      setNewMemberEmail('');
      // Refresh teams list
      const userTeams = await getUserTeams(currentUser.email);
      setTeams(userTeams);
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };

  const handleRemoveMember = async (teamId, memberEmail) => {
    try {
      await removeTeamMember(teamId, memberEmail);
      // Refresh teams list
      const userTeams = await getUserTeams(currentUser.email);
      setTeams(userTeams);
    } catch (error) {
      console.error('Error removing member:', error);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Team Management</h1>
      
      {/* Create Team Form */}
      <form onSubmit={handleCreateTeam} className="mb-8">
        <input
          type="text"
          value={newTeamName}
          onChange={(e) => setNewTeamName(e.target.value)}
          placeholder="Team Name"
          className="border p-2 mr-2"
        />
        <button 
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create Team
        </button>
      </form>

      {/* Teams List */}
      <div className="space-y-4">
        {teams.map(team => (
          <div key={team.id} className="border p-4 rounded">
            <h2 className="text-xl font-bold">{team.name}</h2>
            
            {/* Add Member Form */}
            <form onSubmit={handleAddMember} className="mt-2">
              <input
                type="email"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                placeholder="Member Email"
                className="border p-2 mr-2"
              />
              <button 
                type="submit"
                onClick={() => setSelectedTeam(team)}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Add Member
              </button>
            </form>

            {/* Members List */}
            <div className="mt-4">
              <h3 className="font-bold">Members:</h3>
              <ul className="mt-2">
                {team.members.map(member => (
                  <li key={member} className="flex justify-between items-center">
                    {member}
                    {member !== team.createdBy && (
                      <button
                        onClick={() => handleRemoveMember(team.id, member)}
                        className="text-red-500"
                      >
                        Remove
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamDashboard;