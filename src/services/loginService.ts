import type { FirebaseLogin, TokenReponse } from "../models";
import apiClient, { parseAxiosError } from "./axiosClient";


export async function loginWithGoogle(credential: FirebaseLogin): Promise<TokenReponse> {
    try {
        const response = await apiClient.post('/auth/google/login', credential);
        return response.data as TokenReponse;
    } catch (err) {
        throw parseAxiosError(err, "Error al loguear con Google");
    }
};


export async function loginWithEmail(credential: FirebaseLogin): Promise<TokenReponse> {
    try {
        const response = await apiClient.post('/auth/email/login', credential);
        return response.data as TokenReponse;
    } catch (err) {
        throw parseAxiosError(err, "Error al loguear con Google");
    }
};

export async function registerWithEmail(credential: FirebaseLogin): Promise<TokenReponse> {
    try {
        const response = await apiClient.post('/auth/email/register', credential);
        return response.data as TokenReponse;
    } catch (err) {
        throw parseAxiosError(err, "Error al loguear con Google");
    }
};