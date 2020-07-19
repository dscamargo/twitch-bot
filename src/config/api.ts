import axios from 'axios';

const api = axios.create({
  baseURL: process.env.TIBIA_DATA_API,
});

export default api;
