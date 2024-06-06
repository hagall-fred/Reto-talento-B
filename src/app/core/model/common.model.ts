export interface User{
    email: string;
    name: string;
    logo: File;
    edad: string;
    genero: string;
}

export interface LoginPayload{
    email: string;
    password: string;
}

export interface RegisterPayload{
    name: string;
    email: string;
    password: string;
    
}

export interface UserinformationPayload{
    email: string;
    name: string;
    edad: string;
    genero: string;
    logo: string;
}


export interface ApiResponse<T>{
    status?:boolean;
    message?: string;
    error?: string;
    token?: string;
    data: T;
}