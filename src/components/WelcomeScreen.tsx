
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight, Calculator, Users, Package, TrendingUp } from 'lucide-react';

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onGetStarted }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      icon: Calculator,
      title: "Digitize your daily accounts in seconds!",
      subtitle: "Calculator-first interface that feels familiar",
      color: "text-primary"
    },
    {
      icon: Users,
      title: "Track udhaar easily!",
      subtitle: "Never forget who owes what with smart customer ledger",
      color: "text-accent"
    },
    {
      icon: Package,
      title: "Manage stock effortlessly!",
      subtitle: "Keep track of inventory with low-stock alerts",
      color: "text-success"
    },
    {
      icon: TrendingUp,
      title: "Grow your business!",
      subtitle: "Get insights and analytics to boost profits",
      color: "text-primary"
    }
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onGetStarted();
    }
  };

  const CurrentIcon = slides[currentSlide].icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-blue-800 flex flex-col items-center justify-center px-6 py-8">
      <div className="text-center mb-12">
        <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mb-6 mx-auto shadow-xl">
          <Calculator className="w-12 h-12 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">VyapaarSetu</h1>
        <p className="text-blue-100 text-lg">आपके व्यापार का डिजिटल पुल</p>
      </div>

      <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-scale-in">
        <div className="text-center mb-8">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${slides[currentSlide].color === 'text-primary' ? 'bg-blue-50' : slides[currentSlide].color === 'text-accent' ? 'bg-orange-50' : 'bg-green-50'}`}>
            <CurrentIcon className={`w-8 h-8 ${slides[currentSlide].color}`} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {slides[currentSlide].title}
          </h2>
          <p className="text-gray-600 text-sm">
            {slides[currentSlide].subtitle}
          </p>
        </div>

        <div className="flex justify-center mb-6">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full mx-1 transition-all duration-300 ${
                index === currentSlide ? 'bg-primary w-6' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>

        <Button
          onClick={nextSlide}
          className="mobile-button w-full bg-primary hover:bg-blue-800"
        >
          {currentSlide === slides.length - 1 ? "Let's Start!" : "Next"}
          <ChevronRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default WelcomeScreen;
