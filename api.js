import axios from 'axios';

const api = axios.create({
  // Sen bu IP'yi istedin, buraya bunu çaktık.
  // DİKKAT: Bilgisayarının IP'si hala 172.20.10.8 ise bu çalışır.
  baseURL: "http://172.20.10.8:8000", 
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    
    if (token) {
      // Tırnak işareti hatası olmasın diye en garanti yöntem:
      config.headers.Authorization = 'Token ' + token;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
