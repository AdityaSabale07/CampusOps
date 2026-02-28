import axios from "../api/axiosConfig";


const BASE = "http://localhost:8080/api/feedback";

export const getActiveFeedback = () =>
  axios.get(`${BASE}/student/active`);

export const submitFeedback = (scheduleId, data) =>
  axios.post(`${BASE}/submit/${scheduleId}`, data);

export const getReport = (scheduleId) =>
  axios.get(`${BASE}/report/${scheduleId}`);

export const closeSession = (scheduleId) =>
  axios.put(`${BASE}/close/${scheduleId}`);
