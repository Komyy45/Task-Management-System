export interface IProfile {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    gender: boolean; // true for male, false for female
    profileImage?: string;
    tasksCompleted: number;
    tasksPending: number;
    performanceScore: number;
}