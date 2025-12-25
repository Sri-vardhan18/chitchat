import axios from 'axios';
import { useState } from 'react';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
}); 

export default api;