import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthPage } from './pages/AuthPage';
import { Dashboard } from './pages/Dashboard';
import { Header } from './components/Layout/Header';
import { TaskRequestForm } from './components/Tasks/TaskRequestForm';
import { TaskList } from './components/Tasks/TaskList';
import { TaskPanel } from './components/Tasks/TaskPanel';
import { RatingModal } from './components/Rating/RatingModal';

function AppContent() {
  const { currentUser } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratingTaskId, setRatingTaskId] = useState('');
  const [ratingTargetUser, setRatingTargetUser] = useState({ id: '', name: '' });
  const [isRatingProvider, setIsRatingProvider] = useState(false);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const handleTaskSuccess = () => {
    // Mostrar mensagem de sucesso e navegar para tarefas
    alert('Tarefa criada com sucesso! 🎉');
    setCurrentPage('tasks');
  };

  const handleTaskAccept = (taskId: string) => {
    // Mostrar mensagem de sucesso
    alert('Tarefa aceita com sucesso! 🤝');
    setCurrentPage('tasks');
  };

  const handleRateTask = (taskId: string) => {
    // Em uma implementação real, você buscaria os dados da tarefa
    // para obter informações do usuário a ser avaliado
    setRatingTaskId(taskId);
    setRatingTargetUser({ id: 'user123', name: 'João Silva' });
    setIsRatingProvider(true); // ou false, dependendo do contexto
    setShowRatingModal(true);
  };

  const handleCloseRatingModal = () => {
    setShowRatingModal(false);
    setRatingTaskId('');
    setRatingTargetUser({ id: '', name: '' });
    // Recarregar a página de tarefas para atualizar o estado
    if (currentPage === 'tasks') {
      setCurrentPage('dashboard');
      setTimeout(() => setCurrentPage('tasks'), 100);
    }
  };

  // Se não estiver logado, mostrar tela de autenticação
  if (!currentUser) {
    return <AuthPage />;
  }

  // Renderizar conteúdo da página atual
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      
      case 'request':
        return (
          <div className="min-h-screen bg-gray-50 py-8">
            <TaskRequestForm onSuccess={handleTaskSuccess} />
          </div>
        );
      
      case 'browse':
        return (
          <div className="min-h-screen bg-gray-50 py-8">
            <TaskList onTaskAccept={handleTaskAccept} />
          </div>
        );
      
      case 'tasks':
        return (
          <div className="min-h-screen bg-gray-50 py-8">
            <TaskPanel onRateTask={handleRateTask} />
          </div>
        );
      
      case 'profile':
        return (
          <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-2xl mx-auto">
              <div className="card">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Meu Perfil</h2>
                <p className="text-gray-600">
                  Funcionalidade de edição de perfil será implementada em breve.
                </p>
                <button 
                  onClick={() => setCurrentPage('dashboard')}
                  className="btn-primary mt-4"
                >
                  Voltar ao Dashboard
                </button>
              </div>
            </div>
          </div>
        );
      
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage={currentPage} onNavigate={handleNavigate} />
      
      <main>
        {renderCurrentPage()}
      </main>

      {/* Modal de Avaliação */}
      <RatingModal
        isOpen={showRatingModal}
        onClose={handleCloseRatingModal}
        taskId={ratingTaskId}
        targetUserId={ratingTargetUser.id}
        targetUserName={ratingTargetUser.name}
        isRatingProvider={isRatingProvider}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
