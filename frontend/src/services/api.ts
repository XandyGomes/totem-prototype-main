import axios from 'axios';

const getBaseURL = () => {
    if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;

    // Se estiver no navegador, tenta detectar o IP do servidor automaticamente
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        return `http://${hostname}:3001`;
    }

    return 'http://localhost:3001';
};

const api = axios.create({
    baseURL: getBaseURL(),
});

export default api;
