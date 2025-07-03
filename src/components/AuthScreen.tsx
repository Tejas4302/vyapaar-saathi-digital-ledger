
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Phone, User, Store, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import LanguageDropdown from '@/components/LanguageDropdown';
import { toast } from 'sonner';

const AuthScreen: React.FC = () => {
  const { signUp, login, isLoading } = useAuth();
  const { t } = useLanguage();
  const [isSignUp, setIsSignUp] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [storeName, setStoreName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const isValidPhone = /^[6-9]\d{9}$/.test(phoneNumber);

  const handleSignUp = async () => {
    if (!isValidPhone) {
      toast.error(t('pleaseEnterValidPhone'));
      return;
    }

    if (!password || password.length < 6) {
      toast.error(t('passwordMinimum6Characters'));
      return;
    }

    if (!name.trim()) {
      toast.error(t('pleaseEnterYourName'));
      return;
    }

    const result = await signUp(phoneNumber, password, name, storeName);
    if (result.success) {
      toast.success(t('accountCreated'));
    } else {
      toast.error(result.message);
    }
  };

  const handleLogin = async () => {
    if (!isValidPhone) {
      toast.error(t('pleaseEnterValidPhone'));
      return;
    }

    if (!password) {
      toast.error(t('pleaseEnterYourPassword'));
      return;
    }

    const result = await login(phoneNumber, password);
    if (result.success) {
      toast.success(t('loginSuccessful'));
    } else {
      toast.error(result.message);
    }
  };

  const resetForm = () => {
    setPhoneNumber('');
    setPassword('');
    setName('');
    setStoreName('');
    setShowPassword(false);
  };

  return (
    <div className="min-h-screen bg-muted flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Language Selector */}
        <div className="flex justify-end mb-4">
          <LanguageDropdown />
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
          <h1 className="text-2xl font-bold text-primary mb-2">{t('welcomeTo')}</h1>
          <p className="text-gray-600">{t('startManagingDigitally')}</p>
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
                    {t('phone')}
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="tel"
                      placeholder={t('enterPhoneNumber')}
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="pl-10"
                      maxLength={10}
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{t('mobileNumber10Digits')}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t('password')}</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder={t('enterPassword')}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                <Button
                  onClick={handleLogin}
                  className="mobile-button w-full bg-primary hover:bg-blue-800"
                  disabled={isLoading || !isValidPhone || !password}
                >
                  {isLoading ? t('loggingIn') : t('login')}
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
                  <label className="block text-sm font-medium mb-1">{t('storeName')} ({t('optional')})</label>
                  <div className="relative">
                    <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="text"
                      placeholder={t('enterStoreName')}
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t('phone')}
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="tel"
                      placeholder={t('enterPhoneNumber')}
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="pl-10"
                      maxLength={10}
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{t('mobileNumber10Digits')}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">{t('password')}</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder={t('createPassword')}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{t('minimum6Characters')}</p>
                </div>
                <Button
                  onClick={handleSignUp}
                  className="mobile-button w-full bg-primary hover:bg-blue-800"
                  disabled={isLoading || !name.trim() || !isValidPhone || password.length < 6}
                >
                  {isLoading ? t('creatingAccount') : t('signUp')}
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
