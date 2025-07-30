import React, { useState, useEffect } from 'react';
import { MapPin, Clock, User, Star } from 'lucide-react';
import { Task } from '../../types';
import { taskService } from '../../services/taskService';
import { useAuth } from '../../contexts/AuthContext';

interface TaskListProps {
  onTaskAccept: (taskId: string) => void;
}

const CATEGORY_ICONS: { [key: string]: string } = {
  maintenance: '🔧',
  cleaning: '🧽',
  delivery: '📦',
  elderly_care: '👴',
  pet_care: '🐕',
  technology: '💻',
  other: '📋'
};

const CATEGORY_LABELS: { [key: string]: string } = {
  maintenance: 'Manutenção',
  cleaning: 'Limpeza',
  delivery: 'Entrega',
  elderly_care: 'Cuidados com idosos',
  pet_care: 'Cuidados com pets',
  technology: 'Tecnologia',
  other: 'Outros'
};

export const TaskList: React.FC<TaskListProps> = ({ onTaskAccept }) => {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [accepting, setAccepting] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (userLocation) {
      loadNearbyTasks();
    }
  }, [userLocation]);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      // Se não conseguir localização, usar São Paulo como padrão
      setUserLocation({ latitude: -23.5505, longitude: -46.6333 });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        console.error('Erro ao obter localização:', error);
        // Usar São Paulo como padrão
        setUserLocation({ latitude: -23.5505, longitude: -46.6333 });
      }
    );
  };

  const loadNearbyTasks = async () => {
    if (!userLocation) return;
    
    setLoading(true);
    setError('');

    try {
      const nearbyTasks = await taskService.getNearbyTasks(
        userLocation.latitude,
        userLocation.longitude,
        20 // 20km de raio
      );
      setTasks(nearbyTasks);
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
      setError('Erro ao carregar tarefas próximas');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptTask = async (taskId: string) => {
    if (!currentUser) return;

    setAccepting(taskId);
    try {
      await taskService.acceptTask(taskId, currentUser.id);
      setTasks(tasks.filter(task => task.id !== taskId));
      onTaskAccept(taskId);
    } catch (error) {
      console.error('Erro ao aceitar tarefa:', error);
      setError('Erro ao aceitar tarefa');
    } finally {
      setAccepting(null);
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatDistance = (task: Task) => {
    if (!userLocation) return '';
    
    // Cálculo simples de distância
    const R = 6371; // Raio da Terra em km
    const dLat = (task.location.latitude - userLocation.latitude) * Math.PI / 180;
    const dLon = (task.location.longitude - userLocation.longitude) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(userLocation.latitude * Math.PI / 180) * Math.cos(task.location.latitude * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return distance < 1 ? '< 1 km' : `${distance.toFixed(1)} km`;
  };

  if (loading && tasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orbee-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando tarefas próximas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Tarefas Disponíveis</h2>
        <p className="text-gray-600 mt-2">
          {tasks.length} tarefa{tasks.length !== 1 ? 's' : ''} próxima{tasks.length !== 1 ? 's' : ''} a você
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              Nenhuma tarefa disponível no momento
            </h3>
            <p className="text-gray-600">
              Novas tarefas aparecem aqui assim que são publicadas na sua região
            </p>
            <button
              onClick={loadNearbyTasks}
              className="btn-primary mt-4"
            >
              Atualizar lista
            </button>
          </div>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="card hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">
                        {CATEGORY_ICONS[task.category] || '📋'}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">
                          {task.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {CATEGORY_LABELS[task.category] || 'Outros'}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDistance(task)}
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4 line-clamp-2">
                    {task.description}
                  </p>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{formatTime(task.desiredTime)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{task.location.address}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>Cliente verificado</span>
                      <div className="flex items-center">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="ml-1">4.8</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 lg:mt-0 lg:ml-6 flex-shrink-0">
                  <button
                    onClick={() => handleAcceptTask(task.id)}
                    disabled={accepting === task.id}
                    className="btn-primary w-full lg:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {accepting === task.id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Aceitando...
                      </>
                    ) : (
                      'Aceitar Tarefa'
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};