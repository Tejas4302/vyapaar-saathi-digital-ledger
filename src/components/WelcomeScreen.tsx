
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe } from 'lucide-react';

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onGetStarted }) => {
  const { t, language, setLanguage } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Language Selector */}
      <div className="flex justify-end p-4">
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

      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        {/* Logo */}
        <div className="mb-8">
          <img 
            src="/lovable-uploads/592c8570-e687-4d0b-b5c3-abd42466406b.png" 
            alt="VyapaarSetu Logo" 
            className="w-32 h-32 mx-auto rounded-3xl shadow-lg"
          />
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {t('appName')}
        </h1>
        
        <p className="text-lg text-gray-600 mb-8 max-w-md">
          {language === 'en' 
            ? 'आपके व्यापार का डिजिटल युग' 
            : 'ನಿಮ್ಮ ವ್ಯಾಪಾರದ ಡಿಜಿಟಲ್ ಯುಗ'
          }
        </p>

        {/* Feature highlights */}
        <div className="mb-12 space-y-4 max-w-sm">
          <div className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <img 
                src="/lovable-uploads/592c8570-e687-4d0b-b5c3-abd42466406b.png" 
                alt="Calculator" 
                className="w-8 h-8 rounded"
              />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-900">
                {language === 'en' ? 'Digitize your daily accounts in seconds!' : 'ಸೆಕೆಂಡುಗಳಲ್ಲಿ ನಿಮ್ಮ ದೈನಂದಿನ ಖಾತೆಗಳನ್ನು ಡಿಜಿಟೈಜ್ ಮಾಡಿ!'}
              </h3>
              <p className="text-sm text-gray-600">
                {language === 'en' ? 'Calculator-first interface that feels familiar' : 'ಪರಿಚಿತವಾಗಿ ಭಾಸವಾಗುವ ಕ್ಯಾಲ್ಕುಲೇಟರ್-ಪ್ರಥಮ ಇಂಟರ್ಫೇಸ್'}
              </p>
            </div>
          </div>
        </div>

        <Button 
          onClick={onGetStarted}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
        >
          {t('getStarted')}
        </Button>

        <div className="mt-8 flex space-x-2">
          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
