import { createContext, useContext, useState } from "react";

// ── Types (as JSDoc for simplicity) ──────────────────────────────────────────
// Survey: { id, site, client, description, priority, date, status, notes, photo, location }

const SurveyContext = createContext(null);

// Sample surveys to show on first load
const INITIAL_SURVEYS = [
  {
    id: "SRV-001", site: "ABC Industries", client: "John Smith",
    description: "Annual safety inspection", priority: "High",
    date: "18 Jul 2026", status: "Completed",
    notes: "All systems clear", photo: null, location: "Lat: 18.5204, Lng: 73.8567",
  },
  {
    id: "SRV-002", site: "XYZ Factory", client: "Sarah Lee",
    description: "Equipment check", priority: "Medium",
    date: "17 Jul 2026", status: "In Progress",
    notes: "", photo: null, location: "Lat: 19.0760, Lng: 72.8777",
  },
  {
    id: "SRV-003", site: "Metro Plaza", client: "Raj Kumar",
    description: "Fire safety audit", priority: "Low",
    date: "16 Jul 2026", status: "Pending",
    notes: "Follow-up required", photo: null, location: null,
  },
];

export function SurveyProvider({ children }) {
  const [surveys,      setSurveys]      = useState(INITIAL_SURVEYS);
  const [pendingPhoto, setPendingPhoto] = useState(null);  // photo captured for current survey draft

  // Add a new survey to the top of the list
  function addSurvey(survey) {
    setSurveys(prev => [survey, ...prev]);
  }

  // Edit an existing survey
  function editSurvey(updatedSurvey) {
    setSurveys(prev => prev.map(s => s.id === updatedSurvey.id ? updatedSurvey : s));
  }

  // Remove a survey by id
  function deleteSurvey(id) {
    setSurveys(prev => prev.filter(s => s.id !== id));
  }

  // Find a survey by id (used by Preview screen)
  function getSurvey(id) {
    return surveys.find(s => s.id === id) || null;
  }

  return (
    <SurveyContext.Provider value={{ surveys, addSurvey, deleteSurvey, editSurvey, getSurvey, pendingPhoto, setPendingPhoto }}>
      {children}
    </SurveyContext.Provider>
  );
}

// Hook — call this in any screen to access survey data
export function useSurveys() {
  return useContext(SurveyContext);
}
