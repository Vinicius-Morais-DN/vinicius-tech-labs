import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

if (!BACKEND_URL) {
  console.error("REACT_APP_BACKEND_URL não está definido no frontend/.env");
}

const api = axios.create({
  baseURL: BACKEND_URL ? `${BACKEND_URL}/api` : "/api",
  timeout: 15000,
});

export function getApiErrorMessage(error, fallback = "Erro desconhecido") {
  if (!error?.response) {
    if (error?.code === "ECONNABORTED") {
      return "Tempo esgotado ao conectar ao servidor.";
    }
    if (error?.message && !error.message.includes("Network Error")) {
      return error.message;
    }
    return "Não foi possível conectar ao backend. Rode start.ps1 ou inicie o servidor na porta 8001.";
  }
  const detail = error.response.data?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail.map((item) => item.msg || JSON.stringify(item)).join(", ");
  }
  if (typeof detail === "object" && detail !== null) {
    return detail.msg || JSON.stringify(detail);
  }
  if (error.response.status === 503) {
    return "MongoDB não está rodando. Inicie com start.ps1 ou mongod na porta 27017.";
  }
  if (error.response.status >= 500) {
    return "Erro interno do servidor. Verifique os logs do backend.";
  }
  return fallback;
}

// Injeta o token em toda requisição
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("vm_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Se o backend devolver 401, o token é inválido/expirado → limpa e força reload
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const isLoginRoute = error.config?.url?.includes("/auth/login");
      if (!isLoginRoute) {
        localStorage.removeItem("vm_token");
        // Redireciona para /admin para exibir o LoginForm
        if (window.location.pathname.startsWith("/admin")) {
          window.location.href = "/admin";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
