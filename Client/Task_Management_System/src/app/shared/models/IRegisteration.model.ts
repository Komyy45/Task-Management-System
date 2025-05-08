export interface IRegisteration {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone: string;
    gender: 'male' | 'female';
}