import React, { createContext, useContext, useState, useCallback } from 'react';
import { ideasAPI, resourcesAPI, progressAPI, mentorsAPI } from '../utils/api';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [ideas, setIdeas] = useState([]);
  const [recommendedIdeas, setRecommendedIdeas] = useState([]);
  const [resources, setResources] = useState([]);
  const [progress, setProgress] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [loadingStates, setLoadingStates] = useState({});

  const setLoading = (key, val) => setLoadingStates(prev => ({ ...prev, [key]: val }));

  const fetchIdeas = useCallback(async (params = {}) => {
    setLoading('ideas', true);
    try {
      const res = await ideasAPI.getAll(params);
      setIdeas(res.data.data);
      return res.data;
    } finally { setLoading('ideas', false); }
  }, []);

  const fetchRecommended = useCallback(async () => {
    setLoading('recommended', true);
    try {
      const res = await ideasAPI.getRecommended();
      setRecommendedIdeas(res.data.data);
    } catch (e) { console.error(e); }
    finally { setLoading('recommended', false); }
  }, []);

  const fetchResources = useCallback(async (params = {}) => {
    setLoading('resources', true);
    try {
      const res = await resourcesAPI.getAll(params);
      setResources(res.data.data);
      return res.data;
    } finally { setLoading('resources', false); }
  }, []);

  const fetchProgress = useCallback(async () => {
    setLoading('progress', true);
    try {
      const res = await progressAPI.getAll();
      setProgress(res.data.data);
    } finally { setLoading('progress', false); }
  }, []);

  const fetchMentors = useCallback(async (params = {}) => {
    setLoading('mentors', true);
    try {
      const res = await mentorsAPI.getAll(params);
      setMentors(res.data.data);
      return res.data;
    } finally { setLoading('mentors', false); }
  }, []);

  const toggleSaveIdea = async (ideaId, savedIdeas) => {
    const res = await ideasAPI.saveToggle(ideaId);
    return res.data;
  };

  return (
    <AppContext.Provider value={{
      ideas, recommendedIdeas, resources, progress, mentors,
      loadingStates,
      fetchIdeas, fetchRecommended, fetchResources, fetchProgress, fetchMentors,
      setIdeas, setResources, setProgress, setMentors,
      toggleSaveIdea
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
