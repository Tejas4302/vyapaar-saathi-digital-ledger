
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, Phone, User, Globe, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

const AuthScreen: React.FC = () => {
  const { signUp, login, isLoading } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const [isSignUp, setIsSignUp] = useState(false);
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const isEmail = emailOrPhone.includes('@');
  const isValidPhone = /^[6-9]\d{9}$/.test(emailOrPhone);
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailOrPhone);

  const handleSignUp = async () => {
    if (!isValidEmail && !isValidPhone) {
      toast.error('Please enter a valid email or 10-digit mobile number starting with 6-9');
      return;
    }

    if (!password || password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    const result = await signUp(emailOrPhone, password, name);
    if (result.success) {
      toast.success(t('accountCreated'));
    } else {
      toast.error(result.message);
    }
  };

  const handleLogin = async () => {
    if (!isValidEmail && !isValidPhone) {
      toast.error('Please enter a valid email or 10-digit mobile number starting with 6-9');
      return;
    }

    if (!password) {
      toast.error('Please enter your password');
      return;
    }

    const result = await login(emailOrPhone, password);
    if (result.success) {
      toast.success(t('loginSuccessful'));
    } else {
      toast.error(result.message);
    }
  };

  const resetForm = () => {
    setEmailOrPhone('');
    setPassword('');
    setName('');
  };

  return (
    <div className="min-h-screen bg-muted flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Language Selector */}
        <div className="flex justify-end mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLanguage(language === 'en' ? 'kn' : 'en')}
            className="flex items-center gap-2"
          >
            <Globe className="w-4 h-4" />
            {language === 'en' ? 'ಕನ್ನಡ' : 'English'}
          </Button>
        </div>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="mb-4">
            <img 
              src="/lovable-uploads/592c8570-e687-4d0b-b5c3-abd42466406b.png" 
              alt="VyapaarSetu Logo" 
              className="w-24 h-24 mx-auto rounded-full"
            />
          </div>
          <h1 className="text-2xl font-bold text-primary mb-2">{t('welcome')} {t('appName')}</h1>
          <p className="text-gray-600">Start managing your business digitally</p>
        </div>

        <Card className="p-6">
          <Tabs value={isSignUp ? 'signup' : 'login'} onValueChange={(value) => {
            setIsSignUp(value === 'signup');
            resetForm();
          }} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">{t('login')}</TabsTrigger>
              <TabsTrigger value="signup">{t('signUp')}</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t('email')} / {t('phone')}
                  </label>
                  <div className="relative">
                    {isEmail ? (
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    ) : (
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    )}
                    <Input
                      type="text"
                      placeholder={t('enterEmailOrPhone')}
                      value={emailOrPhone}
                      onChange={(e) => setEmailOrPhone(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                  {!isEmail && emailOrPhone && (
                    <p className="text-xs text-gray-500 mt-1">Mobile number must be 10 digits starting with 6-9</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t('password')}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="password"
                      placeholder={t('enterPassword')}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <Button
                  onClick={handleLogin}
                  className="mobile-button w-full bg-primary hover:bg-blue-800"
                  disabled={isLoading || (!isValidEmail && !isValidPhone) || !password}
                >
                  {isLoading ? 'Logging in...' : t('login')}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">{t('name')}</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="text"
                      placeholder={t('enterName')}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t('email')} / {t('phone')}
                  </label>
                  <div className="relative">
                    {isEmail ? (
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    ) : (
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    )}
                    <Input
                      type="text"
                      placeholder={t('enterEmailOrPhone')}
                      value={emailOrPhone}
                      onChange={(e) => setEmailOrPhone(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                  {!isEmail && emailOrPhone && (
                    <p className="text-xs text-gray-500 mt-1">Mobile number must be 10 digits starting with 6-9</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t('password')}</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="password"
                      placeholder={t('createPassword')}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
                </div>
                <Button
                  onClick={handleSignUp}
                  className="mobile-button w-full bg-primary hover:bg-blue-800"
                  disabled={isLoading || !name.trim() || (!isValidEmail && !isValidPhone) || password.length < 6}
                >
                  {isLoading ? 'Creating Account...' : t('signUp')}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default AuthScreen;
