
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, Phone, User, Globe, Lock, Eye, EyeOff } from 'lucide-react';
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
  const [showPassword, setShowPassword] = useState(false);

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
    setShowPassword(false);
  };

  const getLanguageOptions = () => {
    switch (language) {
      case 'kn': return 'English';
      case 'hi': return 'ಕನ್ನಡ';
      case 'te': return 'हिंदी';
      default: return 'ಕನ್ನಡ';
    }
  };

  const cycleLanguage = () => {
    const languages: ('en' | 'kn' | 'hi' | 'te')[] = ['en', 'kn', 'hi', 'te'];
    const currentIndex = languages.indexOf(language);
    const nextIndex = (currentIndex + 1) % languages.length;
    setLanguage(languages[nextIndex]);
  };

  return (
    <div className="min-h-screen bg-muted flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Language Selector */}
        <div className="flex justify-end mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={cycleLanguage}
            className="flex items-center gap-2"
          >
            <Globe className="w-4 h-4" />
            {getLanguageOptions()}
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
          <h1 className="text-2xl font-bold text-primary mb-2">{t('welcomeTo')}</h1>
          <p className="text-gray-600">
            {language === 'en' ? 'Start managing your business digitally' :
             language === 'kn' ? 'ನಿಮ್ಮ ವ್ಯಾಪಾರವನ್ನು ಡಿಜಿಟಲ್ ಆಗಿ ನಿರ್ವಹಿಸಲು ಪ್ರಾರಂಭಿಸಿ' :
             language === 'hi' ? 'अपने व्यापार को डिजिटल रूप से प्रबंधित करना शुरू करें' :
             'మీ వ్యాపారాన్ని డిజిటల్‌గా నిర్వహించడం ప్రారంభించండి'}
          </p>
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
                    <p className="text-xs text-gray-500 mt-1">
                      {language === 'en' ? 'Mobile number must be 10 digits starting with 6-9' :
                       language === 'kn' ? 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ 6-9 ರಿಂದ ಪ್ರಾರಂಭವಾಗುವ 10 ಅಂಕೆಗಳಾಗಿರಬೇಕು' :
                       language === 'hi' ? 'मोबाइल नंबर 6-9 से शुरू होने वाले 10 अंकों का होना चाहिए' :
                       'మొబైల్ నంబర్ 6-9తో ప్రారంభమయ్యే 10 అంకెలు ఉండాలి'}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    {t('password')}
                  </label>
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
                  disabled={isLoading || (!isValidEmail && !isValidPhone) || !password}
                >
                  {isLoading ? (
                    language === 'en' ? 'Logging in...' :
                    language === 'kn' ? 'ಲಾಗಿನ್ ಆಗುತ್ತಿದೆ...' :
                    language === 'hi' ? 'लॉगिन हो रहा है...' :
                    'లాగిన్ అవుతోంది...'
                  ) : t('login')}
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
                    <p className="text-xs text-gray-500 mt-1">
                      {language === 'en' ? 'Mobile number must be 10 digits starting with 6-9' :
                       language === 'kn' ? 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ 6-9 ರಿಂದ ಪ್ರಾರಂಭವಾಗುವ 10 ಅಂಕೆಗಳಾಗಿರಬೇಕು' :
                       language === 'hi' ? 'मोबाइल नंबर 6-9 से शुरू होने वाले 10 अंकों का होना चाहिए' :
                       'మొబైల్ నంబర్ 6-9తో ప్రారంభమయ్యే 10 అంకెలు ఉండాలి'}
                    </p>
                  )}
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
                  <p className="text-xs text-gray-500 mt-1">
                    {language === 'en' ? 'Minimum 6 characters' :
                     language === 'kn' ? 'ಕನಿಷ್ಠ 6 ಅಕ್ಷರಗಳು' :
                     language === 'hi' ? 'न्यूनतम 6 अक्षर' :
                     'కనీసం 6 అక్షరాలు'}
                  </p>
                </div>
                <Button
                  onClick={handleSignUp}
                  className="mobile-button w-full bg-primary hover:bg-blue-800"
                  disabled={isLoading || !name.trim() || (!isValidEmail && !isValidPhone) || password.length < 6}
                >
                  {isLoading ? (
                    language === 'en' ? 'Creating Account...' :
                    language === 'kn' ? 'ಖಾತೆ ರಚಿಸುತ್ತಿದೆ...' :
                    language === 'hi' ? 'खाता बनाया जा रहा है...' :
                    'ఖాతా సృష్టిస్తోంది...'
                  ) : t('signUp')}
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
