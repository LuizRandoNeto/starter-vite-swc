export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  userType: 'client' | 'provider' | 'both';
  averageRating: number;
  totalTasks: number;
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  createdAt: Date;
  isEmailVerified: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  desiredTime: Date;
  status: TaskStatus;
  clientId: string;
  providerId?: string;
  price?: number;
  createdAt: Date;
  acceptedAt?: Date;
  completedAt?: Date;
  client?: User;
  provider?: User;
}

export interface Rating {
  id: string;
  taskId: string;
  fromUserId: string;
  toUserId: string;
  rating: number;
  comment?: string;
  createdAt: Date;
}

export type TaskCategory = 
  | 'maintenance'
  | 'cleaning'
  | 'delivery'
  | 'elderly_care'
  | 'pet_care'
  | 'technology'
  | 'other';

export type TaskStatus = 
  | 'pending'
  | 'accepted'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  isAuthenticated: boolean;
}