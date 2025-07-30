import { 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Rating } from '../types';

export const ratingService = {
  // Criar nova avaliação
  async createRating(ratingData: Omit<Rating, 'id' | 'createdAt'>) {
    try {
      const ratingsRef = collection(db, 'ratings');
      const docRef = await addDoc(ratingsRef, {
        ...ratingData,
        createdAt: Timestamp.now()
      });
      return docRef.id;
    } catch (error) {
      console.error('Erro ao criar avaliação:', error);
      throw error;
    }
  },

  // Buscar avaliações de um usuário
  async getUserRatings(userId: string) {
    try {
      const ratingsRef = collection(db, 'ratings');
      const q = query(
        ratingsRef,
        where('toUserId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const ratings: Rating[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        ratings.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt.toDate()
        } as Rating);
      });
      
      return ratings;
    } catch (error) {
      console.error('Erro ao buscar avaliações:', error);
      throw error;
    }
  },

  // Buscar avaliações de uma tarefa específica
  async getTaskRatings(taskId: string) {
    try {
      const ratingsRef = collection(db, 'ratings');
      const q = query(
        ratingsRef,
        where('taskId', '==', taskId),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const ratings: Rating[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        ratings.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt.toDate()
        } as Rating);
      });
      
      return ratings;
    } catch (error) {
      console.error('Erro ao buscar avaliações da tarefa:', error);
      throw error;
    }
  },

  // Calcular média de avaliações de um usuário
  async getUserAverageRating(userId: string) {
    try {
      const ratings = await this.getUserRatings(userId);
      
      if (ratings.length === 0) {
        return { average: 0, total: 0 };
      }
      
      const sum = ratings.reduce((acc, rating) => acc + rating.rating, 0);
      const average = sum / ratings.length;
      
      return { 
        average: Math.round(average * 10) / 10, // Arredondar para 1 casa decimal
        total: ratings.length 
      };
    } catch (error) {
      console.error('Erro ao calcular média de avaliações:', error);
      throw error;
    }
  },

  // Verificar se uma avaliação já foi feita para uma tarefa específica
  async hasUserRatedTask(taskId: string, fromUserId: string) {
    try {
      const ratingsRef = collection(db, 'ratings');
      const q = query(
        ratingsRef,
        where('taskId', '==', taskId),
        where('fromUserId', '==', fromUserId)
      );
      
      const querySnapshot = await getDocs(q);
      return !querySnapshot.empty;
    } catch (error) {
      console.error('Erro ao verificar avaliação:', error);
      throw error;
    }
  }
};