import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:https://ai-tripplanner-9iq7.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

export const generateTrip = (tripData) =>
  API.post("/api/plan-trip", tripData);
