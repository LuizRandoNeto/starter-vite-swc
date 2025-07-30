import React, { useState, useEffect } from 'react';
import { MapPin, Clock, FileText, DollarSign } from 'lucide-react';
import { TaskCategory } from '../../types';
import { taskService } from '../../services/taskService';
import { useAuth } from '../../contexts/AuthContext';

interface TaskRequestFormProps {
  onSuccess: () => void;
}

const TASK_CATEGORIES: { value: TaskCategory; label: string; icon: string }[] = [
  { value: 'maintenance', label: 'Manutenção', icon: '🔧' },
  { value: 'cleaning', label: 'Limpeza', icon: '🧽' },
  { value: 'delivery', label: 'Entrega', icon: '📦' },
  { value: 'elderly_care', label: 'Cuidados com idosos', icon: '👴' },
  { value: 'pet_care', label: 'Cuidados com pets', icon: '🐕' },
  { value: 'technology', label: 'Tecnologia', icon: '💻' },
  { value: 'other', label: 'Outros', icon: '📋' }
];

export const TaskRequestForm: React.FC<TaskRequestFormProps> = ({ onSuccess }) => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    address: string;
  } | null>(null);
  const [gettingLocation, setGettingLocation] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'other' as TaskCategory,
    desiredTime: '',
    customAddress: ''
  });

  useEffect(() => {
    // Tentar obter localização automaticamente
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    setGettingLocation(true);
    
    if (!navigator.geolocation) {
      setError('Geolocalização não suportada pelo seu navegador');
      setGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Simulação de geocoding reverso (em produção usar API real)
          const address = `Lat: ${latitude.toFixed(4)}, Long: ${longitude.toFixed(4)}`;
          setLocation({ latitude, longitude, address });
        } catch (error) {
          console.error('Erro ao obter endereço:', error);
          setLocation({ 
            latitude, 
            longitude, 
            address: `Lat: ${latitude.toFixed(4)}, Long: ${longitude.toFixed(4)}`
          });
        }
        
        setGettingLocation(false);
      },
      (error) => {
        console.error('Erro ao obter localização:', error);
        setError('Não foi possível obter sua localização. Digite o endereço manualmente.');
        setGettingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      setError('Você precisa estar logado para solicitar uma tarefa');
      return;
    }

    if (!location && !formData.customAddress) {
      setError('Por favor, forneça uma localização ou endereço');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Se não tiver localização GPS, usar coordenadas padrão (em produção, usar geocoding)
      const taskLocation = location || {
        latitude: -23.5505, // São Paulo como padrão
        longitude: -46.6333,
        address: formData.customAddress
      };

      await taskService.createTask({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        location: taskLocation,
        desiredTime: new Date(formData.desiredTime),
        status: 'pending',
        clientId: currentUser.id
      });

      onSuccess();
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      setError('Erro ao criar tarefa. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Data mínima é hoje
  const today = new Date().toISOString().slice(0, 16);

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Solicitar Ajuda</h2>
        <p className="text-gray-600 mt-2">Descreva a tarefa que você precisa de ajuda</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Categoria da tarefa
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {TASK_CATEGORIES.map((category) => (
              <div
                key={category.value}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all text-center ${
                  formData.category === category.value
                    ? 'border-orbee-500 bg-orbee-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleInputChange('category', category.value)}
              >
                <div className="text-2xl mb-2">{category.icon}</div>
                <div className="font-medium text-sm">{category.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Título da tarefa
          </label>
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="input-field pl-12"
              placeholder="Ex: Trocar lâmpada queimada"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descrição detalhada
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="input-field h-32 resize-none"
            placeholder="Descreva detalhadamente o que precisa ser feito, qual o local exato, materiais necessários, etc."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Horário desejado
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="datetime-local"
              value={formData.desiredTime}
              onChange={(e) => handleInputChange('desiredTime', e.target.value)}
              min={today}
              className="input-field pl-12"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Localização
          </label>
          
          {gettingLocation && (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mb-4">
              📍 Obtendo sua localização...
            </div>
          )}
          
          {location && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
              📍 Localização obtida: {location.address}
            </div>
          )}
          
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={formData.customAddress}
              onChange={(e) => handleInputChange('customAddress', e.target.value)}
              className="input-field pl-12"
              placeholder="Digite o endereço manualmente (opcional se a localização foi obtida)"
            />
          </div>
          
          <button
            type="button"
            onClick={getCurrentLocation}
            disabled={gettingLocation}
            className="btn-secondary mt-2 text-sm"
          >
            📍 Obter minha localização atual
          </button>
        </div>

        <div className="border-t pt-6">
          <button
            type="submit"
            disabled={loading || gettingLocation}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Publicando tarefa...' : 'Solicitar Ajuda'}
          </button>
        </div>
      </form>
    </div>
  );
};