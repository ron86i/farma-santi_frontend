export interface LoginRequest {
    email: string;
    password: string;
}

export interface FirebaseLogin {
    token: string
}

export interface TokenReponse {
    token: string
}

export interface RegisterEmail {
    email:string
    password:string
}