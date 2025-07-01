
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, ChevronLeft, ChevronRight, Calculator, Users, Package, BarChart3 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProductTourProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProductTour: React.FC<ProductTourProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);

  const tourSteps = [
    {
      title: t('welcomeToVyapaarSetu'),
      description: t('tourWelcomeDescription'),
      icon: <Calculator className="w-8 h-8 text-primary" />,
    },
    {
      title: t('smartCalculator'),
      description: t('tourCalculatorDescription'),
      icon: <Calculator className="w-8 h-8 text-primary" />,
    },
    {
      title: t('customerManagement'),
      description: t('tourCustomerDescription'),
      icon: <Users className="w-8 h-8 text-primary" />,
    },
    {
      title: t('inventoryTracking'),
      description: t('tourInventoryDescription'),
      icon: <Package className="w-8 h-8 text-primary" />,
    },
    {
      title: t('analyticsInsights'),
      description: t('tourAnalyticsDescription'),
      icon: <BarChart3 className="w-8 h-8 text-primary" />,
    },
  ];

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipTour = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="absolute top-2 right-2"
        >
          <X className="w-4 h-4" />
        </Button>

        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            {tourSteps[currentStep].icon}
          </div>
          <h2 className="text-xl font-bold mb-2">{tourSteps[currentStep].title}</h2>
          <p className="text-gray-600">{tourSteps[currentStep].description}</p>
        </div>

        <div className="flex justify-center mb-6">
          <div className="flex space-x-2">
            {tourSteps.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  index === currentStep ? 'bg-primary' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <Button variant="ghost" onClick={skipTour}>
            {t('skip')}
          </Button>
          
          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button variant="outline" onClick={prevStep}>
                <ChevronLeft className="w-4 h-4 mr-1" />
                {t('back')}
              </Button>
            )}
            <Button onClick={nextStep}>
              {currentStep === tourSteps.length - 1 ? t('finish') : t('next')}
              {currentStep < tourSteps.length - 1 && <ChevronRight className="w-4 h-4 ml-1" />}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProductTour;
