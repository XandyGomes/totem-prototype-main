import axios from 'axios';

const getBaseURL = () => {
    // 1. Prioridade máxima: Variável de ambiente configurada na Vercel
    if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;

    // 2. Se estivermos no navegador (Totem ou TV)
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        
        // Se estamos rodando na Vercel, a URL da API deve vir da variável de ambiente
        // ou ser uma rota relativa se o back fosse junto, mas aqui o back é no Render.
        if (hostname.includes('vercel.app')) {
            // Se cair aqui sem variável, retornamos vazio para forçar o desenvolvedor a configurar a variável
            return ''; 
        }

        // Se estiver rodando local no hospital pelo IP (ex: Totem acessando o Servidor local)
        return `http://${hostname}:3001`;
    }

    // 3. Fallback para Localhost
    return 'http://localhost:3001';
};

const api = axios.create({
    baseURL: getBaseURL(),
});

export default api;
