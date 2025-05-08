export interface ITask {
    _id: string;
    title: string;
    description: string;
    dueDate: Date;
    priority: 'low' | 'medium' | 'high';
    completed: boolean;
    category: string;
    progress: number;
    status: 'completed' | 'in-progress' | 'pending';
}