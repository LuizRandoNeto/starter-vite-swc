import React from 'react';
import { Plus, List, Star, Clock, CheckCircle, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { userProfile } = useAuth();

  const canRequestTasks = userProfile?.userType === 'client' || userProfile?.userType === 'both';
  const canProvideTasks = userProfile?.userType === 'provider' || userProfile?.userType === 'both';

  const stats = [
    {
      name: 'Tarefas Solicitadas',
      value: '12',
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      show: canRequestTasks
    },
    {
      name: 'Tarefas Concluídas',
      value: '8',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      show: true
    },
    {
      name: 'Avaliação Média',
      value: '4.8',
      icon: Star,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      show: true
    },
    {
      name: 'Tarefas Este Mês',
      value: '5',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      show: true
    }
  ];

  const quickActions = [
    ...(canRequestTasks ? [{
      title: 'Solicitar Ajuda',
      description: 'Precisa de ajuda com algo? Crie uma nova solicitação',
      icon: Plus,
      action: () => onNavigate('request'),
      color: 'bg-orbee-500 hover:bg-orbee-600',
      textColor: 'text-white'
    }] : []),
    ...(canProvideTasks ? [{
      title: 'Encontrar Tarefas',
      description: 'Veja tarefas disponíveis na sua região',
      icon: List,
      action: () => onNavigate('browse'),
      color: 'bg-green-500 hover:bg-green-600',
      textColor: 'text-white'
    }] : []),
    {
      title: 'Minhas Tarefas',
      description: 'Gerencie suas tarefas ativas e histórico',
      icon: CheckCircle,
      action: () => onNavigate('tasks'),
      color: 'bg-gray-100 hover:bg-gray-200',
      textColor: 'text-gray-900'
    }
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {getGreeting()}, {userProfile?.name?.split(' ')[0] || 'Usuário'}! 👋
        </h1>
        <p className="mt-2 text-gray-600">
          {userProfile?.userType === 'both' 
            ? 'Você pode solicitar e executar tarefas na plataforma'
            : userProfile?.userType === 'client'
            ? 'Solicite ajuda para suas tarefas do dia a dia'
            : 'Ajude pessoas da sua região e ganhe uma renda extra'
          }
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.filter(stat => stat.show).map((stat) => {
          const IconComponent = stat.icon;
          return (
            <div key={stat.name} className="card">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <IconComponent className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quickActions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <button
                key={index}
                onClick={action.action}
                className={`p-6 rounded-xl transition-all duration-200 text-left ${action.color} ${action.textColor} hover:scale-105 hover:shadow-lg`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-2">{action.title}</h3>
                    <p className={`text-sm ${action.textColor === 'text-white' ? 'text-white/80' : 'text-gray-600'}`}>
                      {action.description}
                    </p>
                  </div>
                  <IconComponent className={`w-8 h-8 ${action.textColor === 'text-white' ? 'text-white' : 'text-gray-400'}`} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Atividade Recente</h2>
        <div className="space-y-4">
          {[
            {
              type: 'task_completed',
              title: 'Tarefa concluída: Trocar lâmpada',
              time: 'Há 2 horas',
              icon: CheckCircle,
              color: 'text-green-600'
            },
            {
              type: 'task_accepted',
              title: 'Sua tarefa foi aceita: Ajuda com mudança',
              time: 'Há 1 dia',
              icon: Clock,
              color: 'text-blue-600'
            },
            {
              type: 'rating_received',
              title: 'Você recebeu uma avaliação: 5 estrelas',
              time: 'Há 2 dias',
              icon: Star,
              color: 'text-yellow-600'
            }
          ].map((activity, index) => {
            const IconComponent = activity.icon;
            return (
              <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <IconComponent className={`w-5 h-5 ${activity.color}`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tips Section */}
      <div className="mt-8 card bg-gradient-to-r from-orbee-50 to-blue-50 border-orbee-200">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-orbee-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">💡</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Dica do dia</h3>
            <p className="text-gray-700 mb-3">
              Para ter mais sucesso na plataforma, mantenha seu perfil atualizado com foto e informações de contato. 
              Usuários com perfis completos recebem 3x mais solicitações!
            </p>
            <button 
              onClick={() => onNavigate('profile')}
              className="text-orbee-600 hover:text-orbee-700 font-medium text-sm"
            >
              Atualizar meu perfil →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};