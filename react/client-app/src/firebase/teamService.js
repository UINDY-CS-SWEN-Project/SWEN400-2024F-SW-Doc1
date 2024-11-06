import { db } from './firebase';
import { ref, set, push, update, remove, get } from 'firebase/database';

// Create a new team
export const createTeam = async (teamName) => {
  const teamRef = push(ref(db, 'teams'));
  await set(teamRef, { name: teamName, members: {} });
  return teamRef.key; // return the generated team ID
};

// Add a member to a team
export const addMemberToTeam = async (teamId, memberId, memberName) => {
  const memberRef = ref(db, `teams/${teamId}/members/${memberId}`);
  await set(memberRef, { name: memberName });
  return memberId;
};

// Remove a member from a team
export const removeMemberFromTeam = async (teamId, memberId) => {
  const memberRef = ref(db, `teams/${teamId}/members/${memberId}`);
  await remove(memberRef);
};

// Get all teams and their members
export const getTeams = async () => {
  const snapshot = await get(ref(db, 'teams'));
  return snapshot.exists() ? snapshot.val() : {};
};

// Delete a team
export const deleteTeam = async (teamId) => {
  const teamRef = ref(db, `teams/${teamId}`);
  await remove(teamRef);
};