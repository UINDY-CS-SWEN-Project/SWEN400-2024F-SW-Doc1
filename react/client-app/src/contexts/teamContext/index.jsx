import { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../../firebase/firebase';
import { useAuth } from '../authContext';

const TeamContext = createContext();

export const TeamProvider = ({ children }) => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // Subscribe to user's teams
      const unsubscribe = db
        .collection('teams')
        .where('members', 'array-contains', user.uid)
        .onSnapshot((snapshot) => {
          const teamsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setTeams(teamsData);
          setLoading(false);
        });

      return () => unsubscribe();
    }
  }, [user]);

  const value = {
    teams,
    loading,
  };

  return (
    <TeamContext.Provider value={value}>
      {children}
    </TeamContext.Provider>
  );
};

export const useTeam = () => {
  const context = useContext(TeamContext);
  if (!context) {
    throw new Error('useTeam must be used within a TeamProvider');
  }
  return context;
};