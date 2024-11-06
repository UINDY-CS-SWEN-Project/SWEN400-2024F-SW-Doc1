import React, { useState, useEffect } from 'react';
import { createTeam, addMemberToTeam, removeMemberFromTeam, getTeams, deleteTeam } from '../firebase/teamService';
import { useNavigate } from 'react-router-dom';

const Teams = () => {
  const [teamName, setTeamName] = useState('');
  const [memberNames, setMemberNames] = useState({}); 
  const [teams, setTeams] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeams = async () => {
      const data = await getTeams();
      setTeams(data);
    };

    fetchTeams();
  }, []);

  const handleCreateTeam = async () => {
    if (teamName) {
      const teamId = await createTeam(teamName);
      setTeams({ ...teams, [teamId]: { name: teamName, members: {} } });
      setTeamName('');
    }
  };

  const handleAddMember = async (teamId) => {
    const memberName = memberNames[teamId];
    if (memberName) {
      const memberId = Date.now().toString(); 
      await addMemberToTeam(teamId, memberId, memberName);
      setTeams({
        ...teams,
        [teamId]: {
          ...teams[teamId],
          members: { ...teams[teamId].members, [memberId]: { name: memberName } },
        },
      });
      setMemberNames({ ...memberNames, [teamId]: '' }); 
    }
  };

  const handleRemoveMember = async (teamId, memberId) => {
    await removeMemberFromTeam(teamId, memberId);
    const updatedMembers = { ...teams[teamId].members };
    delete updatedMembers[memberId];
    setTeams({
      ...teams,
      [teamId]: {
        ...teams[teamId],
        members: updatedMembers,
      },
    });
  };

  const handleRemoveTeam = async (teamId) => {
    await deleteTeam(teamId);
    const updatedTeams = { ...teams };
    delete updatedTeams[teamId];
    setTeams(updatedTeams);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-md p-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Teams</h1>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded"
        >
          Home
        </button>
      </div>
      <div className="p-8">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <input
            type="text"
            placeholder="Enter team name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            className="mb-2 p-2 border rounded"
          />
          <button onClick={handleCreateTeam} className="bg-blue-500 text-white p-2 rounded mb-4">
            Create Team
          </button>

          {Object.keys(teams).map((teamId) => (
            <div key={teamId} className="mb-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">{teams[teamId].name}</h2>
                <button
                  onClick={() => handleRemoveTeam(teamId)}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                >
                  Remove Team
                </button>
              </div>
              <ul>
                {teams[teamId].members &&
                  Object.keys(teams[teamId].members).map((memberId) => (
                    <li key={memberId} className="flex items-center justify-between">
                      {teams[teamId].members[memberId].name}
                      <button
                        onClick={() => handleRemoveMember(teamId, memberId)}
                        className="bg-red-500 text-white p-1 rounded"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
              </ul>

              <input
                type="text"
                placeholder="Enter member name"
                value={memberNames[teamId] || ''}
                onChange={(e) => setMemberNames({ ...memberNames, [teamId]: e.target.value })}
                className="mt-2 p-2 border rounded"
              />
              <button onClick={() => handleAddMember(teamId)} className="bg-green-500 text-white p-2 rounded mt-2">
                Add Member
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Teams;
