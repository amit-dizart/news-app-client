import axios from 'axios';

const apiBaseUrl = 'http://13.200.206.96:5001/';

const instance = axios.create({
  baseURL: apiBaseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
