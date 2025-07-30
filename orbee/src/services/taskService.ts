import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Task, TaskCategory, TaskStatus } from '../types';

export const taskService = {
  // Criar nova tarefa
  async createTask(taskData: Omit<Task, 'id' | 'createdAt'>) {
    try {
      const tasksRef = collection(db, 'tasks');
      const docRef = await addDoc(tasksRef, {
        ...taskData,
        createdAt: Timestamp.now(),
        desiredTime: Timestamp.fromDate(taskData.desiredTime)
      });
      return docRef.id;
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      throw error;
    }
  },

  // Buscar tarefas próximas para prestadores
  async getNearbyTasks(latitude: number, longitude: number, maxDistance: number = 10) {
    try {
      const tasksRef = collection(db, 'tasks');
      const q = query(
        tasksRef,
        where('status', '==', 'pending'),
        orderBy('createdAt', 'desc'),
        limit(50)
      );
      
      const querySnapshot = await getDocs(q);
      const tasks: Task[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        
        // Calcular distância (implementação simples)
        const distance = calculateDistance(
          latitude, 
          longitude, 
          data.location.latitude, 
          data.location.longitude
        );
        
        if (distance <= maxDistance) {
          tasks.push({
            id: doc.id,
            ...data,
            desiredTime: data.desiredTime.toDate(),
            createdAt: data.createdAt.toDate()
          } as Task);
        }
      });
      
      return tasks;
    } catch (error) {
      console.error('Erro ao buscar tarefas próximas:', error);
      throw error;
    }
  },

  // Buscar tarefas do usuário
  async getUserTasks(userId: string, userType: 'client' | 'provider') {
    try {
      const tasksRef = collection(db, 'tasks');
      const field = userType === 'client' ? 'clientId' : 'providerId';
      const q = query(
        tasksRef,
        where(field, '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const tasks: Task[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        tasks.push({
          id: doc.id,
          ...data,
          desiredTime: data.desiredTime.toDate(),
          createdAt: data.createdAt.toDate(),
          acceptedAt: data.acceptedAt?.toDate(),
          completedAt: data.completedAt?.toDate()
        } as Task);
      });
      
      return tasks;
    } catch (error) {
      console.error('Erro ao buscar tarefas do usuário:', error);
      throw error;
    }
  },

  // Aceitar tarefa
  async acceptTask(taskId: string, providerId: string) {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, {
        providerId,
        status: 'accepted',
        acceptedAt: Timestamp.now()
      });
    } catch (error) {
      console.error('Erro ao aceitar tarefa:', error);
      throw error;
    }
  },

  // Atualizar status da tarefa
  async updateTaskStatus(taskId: string, status: TaskStatus) {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      const updateData: any = { status };
      
      if (status === 'in_progress') {
        updateData.startedAt = Timestamp.now();
      } else if (status === 'completed') {
        updateData.completedAt = Timestamp.now();
      }
      
      await updateDoc(taskRef, updateData);
    } catch (error) {
      console.error('Erro ao atualizar status da tarefa:', error);
      throw error;
    }
  },

  // Buscar tarefa por ID
  async getTaskById(taskId: string) {
    try {
      const taskRef = doc(db, 'tasks', taskId);
      const taskSnap = await getDoc(taskRef);
      
      if (taskSnap.exists()) {
        const data = taskSnap.data();
        return {
          id: taskSnap.id,
          ...data,
          desiredTime: data.desiredTime.toDate(),
          createdAt: data.createdAt.toDate(),
          acceptedAt: data.acceptedAt?.toDate(),
          completedAt: data.completedAt?.toDate()
        } as Task;
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao buscar tarefa:', error);
      throw error;
    }
  }
};

// Função para calcular distância entre dois pontos (fórmula de Haversine simplificada)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Raio da Terra em km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return distance;
}