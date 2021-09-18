import { baseURL } from "./constants";

const axios = require('axios');

export const axiosInstance = axios.create({ baseURL });
