import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Phone, MessageCircle, CheckCircle, XCircle, Star } from 'lucide-react';
import { Task, TaskStatus } from '../../types';
import { taskService } from '../../services/taskService';
import { useAuth } from '../../contexts/AuthContext';

interface TaskPanelProps {
  onRateTask: (taskId: string) => void;
}

const STATUS_LABELS: { [key in TaskStatus]: string } = {
  pending: 'Aguardando',
  accepted: 'Aceita',
  in_progress: 'Em andamento',
  completed: 'Concluída',
  cancelled: 'Cancelada'
};

const STATUS_COLORS: { [key in TaskStatus]: string } = {
  pending: 'bg-yellow-100 text-yellow-800',
  accepted: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-purple-100 text-purple-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800'
};

const CATEGORY_ICONS: { [key: string]: string } = {
  maintenance: '🔧',
  cleaning: '🧽',
  delivery: '📦',
  elderly_care: '👴',
  pet_care: '🐕',
  technology: '💻',
  other: '📋'
};

export const TaskPanel: React.FC<TaskPanelProps> = ({ onRateTask }) => {
  const { currentUser, userProfile } = useAuth();
  const [clientTasks, setClientTasks] = useState<Task[]>([]);
  const [providerTasks, setProviderTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'client' | 'provider'>('client');
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser && userProfile) {
      loadUserTasks();
    }
  }, [currentUser, userProfile]);

  const loadUserTasks = async () => {
    if (!currentUser || !userProfile) return;

    setLoading(true);
    try {
      const promises = [];
      
      if (userProfile.userType === 'client' || userProfile.userType === 'both') {
        promises.push(taskService.getUserTasks(currentUser.id, 'client'));
      } else {
        promises.push(Promise.resolve([]));
      }
      
      if (userProfile.userType === 'provider' || userProfile.userType === 'both') {
        promises.push(taskService.getUserTasks(currentUser.id, 'provider'));
      } else {
        promises.push(Promise.resolve([]));
      }

      const [clientTasksResult, providerTasksResult] = await Promise.all(promises);
      
      setClientTasks(clientTasksResult);
      setProviderTasks(providerTasksResult);
      
      // Definir aba ativa baseada no tipo de usuário
      if (userProfile.userType === 'provider') {
        setActiveTab('provider');
      }
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (taskId: string, newStatus: TaskStatus) => {
    setUpdating(taskId);
    try {
      await taskService.updateTaskStatus(taskId, newStatus);
      await loadUserTasks(); // Recarregar tarefas
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    } finally {
      setUpdating(null);
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getAvailableActions = (task: Task, isClient: boolean) => {
    const actions = [];

    if (isClient) {
      if (task.status === 'pending') {
        actions.push({
          label: 'Cancelar',
          action: () => handleStatusUpdate(task.id, 'cancelled'),
          color: 'btn-secondary',
          icon: XCircle
        });
      } else if (task.status === 'in_progress') {
        actions.push({
          label: 'Marcar como concluída',
          action: () => handleStatusUpdate(task.id, 'completed'),
          color: 'btn-primary',
          icon: CheckCircle
        });
      } else if (task.status === 'completed') {
        actions.push({
          label: 'Avaliar prestador',
          action: () => onRateTask(task.id),
          color: 'btn-primary',
          icon: Star
        });
      }
    } else {
      // Prestador
      if (task.status === 'accepted') {
        actions.push({
          label: 'Iniciar tarefa',
          action: () => handleStatusUpdate(task.id, 'in_progress'),
          color: 'btn-primary',
          icon: CheckCircle
        });
      } else if (task.status === 'completed') {
        actions.push({
          label: 'Avaliar cliente',
          action: () => onRateTask(task.id),
          color: 'btn-primary',
          icon: Star
        });
      }
    }

    return actions;
  };

  const renderTaskCard = (task: Task, isClient: boolean) => {
    const actions = getAvailableActions(task, isClient);

    return (
      <div key={task.id} className="card">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">
              {CATEGORY_ICONS[task.category] || '📋'}
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900">
                {task.title}
              </h3>
              <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[task.status]}`}>
                {STATUS_LABELS[task.status]}
              </span>
            </div>
          </div>
        </div>

        <p className="text-gray-700 mb-4">{task.description}</p>

        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-2" />
            <span>Horário desejado: {formatTime(task.desiredTime)}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            <span>{task.location.address}</span>
          </div>
          {task.status !== 'pending' && (
            <div className="flex items-center text-sm text-gray-600">
              {isClient ? (
                <>
                  <Phone className="w-4 h-4 mr-2" />
                  <span>Prestador: João Silva</span>
                </>
              ) : (
                <>
                  <Phone className="w-4 h-4 mr-2" />
                  <span>Cliente: Maria Santos</span>
                </>
              )}
            </div>
          )}
        </div>

        {actions.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-4 border-t">
            {actions.map((action, index) => {
              const IconComponent = action.icon;
              return (
                <button
                  key={index}
                  onClick={action.action}
                  disabled={updating === task.id}
                  className={`${action.color} flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{action.label}</span>
                </button>
              );
            })}
            
            <button className="btn-secondary flex items-center space-x-2">
              <MessageCircle className="w-4 h-4" />
              <span>Contatar</span>
            </button>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orbee-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando suas tarefas...</p>
        </div>
      </div>
    );
  }

  const canShowClientTab = userProfile?.userType === 'client' || userProfile?.userType === 'both';
  const canShowProviderTab = userProfile?.userType === 'provider' || userProfile?.userType === 'both';

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Minhas Tarefas</h2>
        <p className="text-gray-600 mt-2">Gerencie suas tarefas ativas</p>
      </div>

      {/* Tabs */}
      {canShowClientTab && canShowProviderTab && (
        <div className="flex mb-8 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('client')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'client'
                ? 'bg-white text-orbee-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Solicitadas por mim
          </button>
          <button
            onClick={() => setActiveTab('provider')}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              activeTab === 'provider'
                ? 'bg-white text-orbee-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Aceitas por mim
          </button>
        </div>
      )}

      {/* Content */}
      <div className="space-y-4">
        {activeTab === 'client' && canShowClientTab && (
          <>
            {clientTasks.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Nenhuma tarefa solicitada
                </h3>
                <p className="text-gray-600">
                  Quando você solicitar ajuda, suas tarefas aparecerão aqui
                </p>
              </div>
            ) : (
              clientTasks.map(task => renderTaskCard(task, true))
            )}
          </>
        )}

        {activeTab === 'provider' && canShowProviderTab && (
          <>
            {providerTasks.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🤝</div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Nenhuma tarefa aceita
                </h3>
                <p className="text-gray-600">
                  Quando você aceitar tarefas, elas aparecerão aqui
                </p>
              </div>
            ) : (
              providerTasks.map(task => renderTaskCard(task, false))
            )}
          </>
        )}
      </div>
    </div>
  );
};