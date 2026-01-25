import { env } from "./env";

const endpoints = {
    apiBase: env.API_BASE_URL,
    auth: {
        me: `${env.API_BASE_URL}/auth/me`,
        login: `${env.API_BASE_URL}/auth/login`,
        logout: `${env.API_BASE_URL}/auth/logout`,
    },
};

export { endpoints }
