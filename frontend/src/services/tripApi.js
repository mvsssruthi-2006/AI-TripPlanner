import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

export const generateTrip = (tripData) =>
  API.post("/api/plan-trip", tripData);
