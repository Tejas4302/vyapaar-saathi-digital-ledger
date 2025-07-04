
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Globe, ChevronLeft, ChevronRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onGetStarted }) => {
  const { t, language, setLanguage } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'kn', label: 'ಕನ್ನಡ' },
    { value: 'hi', label: 'हिंदी' },
    { value: 'te', label: 'తెలుగు' }
  ];

  const getSlideText = (enText: string, hiText: string, knText: string, teText: string) => {
    switch (language) {
      case 'en': return enText;
      case 'hi': return hiText;
      case 'kn': return knText;
      case 'te': return teText;
      default: return enText;
    }
  };

  const slides = [
    {
      title: getSlideText(
        'Digital Business Management',
        'डिजिटल व्यापार प्रबंधन',
        'ಡಿಜಿಟಲ್ ವ್ಯಾಪಾರ ನಿರ್ವಹಣೆ',
        'డిజిటల్ వ్యాపార నిర్వహణ'
      ),
      description: getSlideText(
        'Manage your business digitally with ease',
        'अपने व्यापार को आसानी से डिजिटल रूप से प्रबंधित करें',
        'ನಿಮ್ಮ ವ್ಯಾಪಾರವನ್ನು ಸುಲಭವಾಗಿ ಡಿಜಿಟಲ್ ಆಗಿ ನಿರ್ವಹಿಸಿ',
        'మీ వ్యాపారాన్ని సులభంగా డిజిటల్‌గా నిర్వహించండి'
      )
    },
    {
      title: getSlideText(
        'Smart Calculator',
        'स्मार्ट कैलकुलेटर',
        'ಸ್ಮಾರ್ಟ್ ಕ್ಯಾಲ್ಕುಲೇಟರ್',
        'స్మార్ట్ కాలిక్యులేటర్'
      ),
      description: getSlideText(
        'Calculate and record transactions instantly',
        'तुरंत गणना करें और लेनदेन रिकॉर्ड करें',
        'ತಕ್ಷಣ ಲೆಕ್ಕಾಚಾರ ಮಾಡಿ ಮತ್ತು ವ್ಯವಹಾರಗಳನ್ನು ದಾಖಲಿಸಿ',
        'తక్షణ లెక్కింపు మరియు లావాదేవీలను రికార్డ్ చేయండి'
      )
    },
    {
      title: getSlideText(
        'Customer Management',
        'ग्राहक प्रबंधन',
        'ಗ್ರಾಹಕ ನಿರ್ವಹಣೆ',
        'కస్టమర్ నిర్వహణ'
      ),
      description: getSlideText(
        'Track customers and their due payments',
        'ग्राहकों और उनके बकाया भुगतान को ट्रैक करें',
        'ಗ್ರಾಹಕರು ಮತ್ತು ಅವರ ಬಾಕಿ ಪಾವತಿಗಳನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ',
        'కస్టమర్లు మరియు వారి బకాయి చెల్లింపులను ట్రాక్ చేయండి'
      )
    },
    {
      title: getSlideText(
        'Voice-Enabled Features',
        'आवाज़-सक्षम सुविधाएं',
        'ಧ್ವನಿ-ಸಕ್ರಿಯ ವೈಶಿಷ್ಟ್ಯಗಳು',
        'వాయిస్-ప్రారంభ లక్షణాలు'
      ),
      description: getSlideText(
        'Speak to add items, customers, and inventory',
        'आइटम, ग्राहक और इन्वेंटरी जोड़ने के लिए बोलें',
        'ಐಟಂಗಳು, ಗ್ರಾಹಕರು ಮತ್ತು ದಾಸ್ತಾನು ಸೇರಿಸಲು ಮಾತನಾಡಿ',
        'వస్తువులు, కస్టమర్లు మరియు ఇన్వెంటరీ జోడించడానికి మాట్లాడండి'
      )
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const getCurrentLanguageLabel = () => {
    return languageOptions.find(option => option.value === language)?.label || 'English';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Language Selector */}
      <div className="flex justify-end p-4">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4" />
          <Select value={language} onValueChange={(value: 'en' | 'kn' | 'hi' | 'te') => setLanguage(value)}>
            <SelectTrigger className="w-auto min-w-[120px] border border-gray-300">
              <SelectValue>{getCurrentLanguageLabel()}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {languageOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center relative">
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

        {/* Slide content */}
        <div className="mb-8 max-w-md min-h-[120px] flex flex-col justify-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            {slides[currentSlide].title}
          </h2>
          <p className="text-lg text-gray-600">
            {slides[currentSlide].description}
          </p>
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={prevSlide}
            className="w-10 h-10 rounded-full p-0"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <div className="flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={nextSlide}
            className="w-10 h-10 rounded-full p-0"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Get Started button - only show on last slide */}
        {currentSlide === slides.length - 1 && (
          <Button 
            onClick={onGetStarted}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg rounded-xl shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            {t('getStarted')}
          </Button>
        )}
      </div>
    </div>
  );
};

export default WelcomeScreen;
