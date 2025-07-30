import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface SignupFormProps {
  onToggleMode: () => void;
}

export const SignupForm: React.FC<SignupFormProps> = ({ onToggleMode }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'client' as 'client' | 'provider' | 'both'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      await signup(formData.email, formData.password, formData.name, formData.userType);
    } catch (error: any) {
      setError('Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-orbee-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-xl">O</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Criar conta</h2>
        <p className="text-gray-600 mt-2">Junte-se à comunidade Orbee</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nome completo
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="input-field pl-12"
              placeholder="Seu nome"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="input-field pl-12"
              placeholder="seu@email.com"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Senha
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className="input-field pl-12 pr-12"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirmar senha
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className="input-field pl-12 pr-12"
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Como você pretende usar o Orbee?
          </label>
          <div className="space-y-3">
            <div 
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                formData.userType === 'client' 
                ? 'border-orbee-500 bg-orbee-50' 
                : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleInputChange('userType', 'client')}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  name="userType"
                  value="client"
                  checked={formData.userType === 'client'}
                  onChange={() => handleInputChange('userType', 'client')}
                  className="text-orbee-500"
                />
                <div className="ml-3">
                  <div className="font-medium text-gray-900">Preciso de ajuda</div>
                  <div className="text-sm text-gray-600">Quero solicitar tarefas</div>
                </div>
              </div>
            </div>

            <div 
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                formData.userType === 'provider' 
                ? 'border-orbee-500 bg-orbee-50' 
                : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleInputChange('userType', 'provider')}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  name="userType"
                  value="provider"
                  checked={formData.userType === 'provider'}
                  onChange={() => handleInputChange('userType', 'provider')}
                  className="text-orbee-500"
                />
                <div className="ml-3">
                  <div className="font-medium text-gray-900">Quero ajudar</div>
                  <div className="text-sm text-gray-600">Quero executar tarefas</div>
                </div>
              </div>
            </div>

            <div 
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                formData.userType === 'both' 
                ? 'border-orbee-500 bg-orbee-50' 
                : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleInputChange('userType', 'both')}
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  name="userType"
                  value="both"
                  checked={formData.userType === 'both'}
                  onChange={() => handleInputChange('userType', 'both')}
                  className="text-orbee-500"
                />
                <div className="ml-3">
                  <div className="font-medium text-gray-900">Ambos</div>
                  <div className="text-sm text-gray-600">Quero solicitar e executar tarefas</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Criando conta...' : 'Criar conta'}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-gray-600">
          Já tem uma conta?{' '}
          <button
            onClick={onToggleMode}
            className="text-orbee-600 hover:text-orbee-700 font-medium"
          >
            Entrar
          </button>
        </p>
      </div>
    </div>
  );
};