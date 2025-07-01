
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { User, Edit2, X, Check, Settings } from 'lucide-react';
import ProductTour from '@/components/ProductTour';

interface ProfileScreenProps {
  onStartTour?: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ onStartTour }) => {
  const { user, profile, logout, updateProfile } = useAuth();
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
    storeName: profile?.storeName || ''
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        storeName: profile.storeName || ''
      });
    }
  }, [profile]);

  const handleSave = async () => {
    try {
      await updateProfile({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        storeName: formData.storeName
      });
      toast.success(t('profileUpdated'));
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(t('errorUpdatingProfile'));
    }
  };

  const handleCancel = () => {
    setFormData({
      name: profile?.name || '',
      email: profile?.email || '',
      phone: profile?.phone || '',
      storeName: profile?.storeName || ''
    });
    setIsEditing(false);
  };

  const handleLogout = async () => {
    await logout();
    toast.success(t('logoutSuccessful'));
  };

  const startTour = () => {
    if (onStartTour) {
      onStartTour();
    } else {
      setShowTour(true);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-6 pb-20">
      {/* Profile Header */}
      <Card className="p-6 text-center bg-gradient-to-br from-primary to-blue-600 text-white">
        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold">{profile?.name || t('user')}</h2>
        <p className="text-sm opacity-80">{profile?.storeName || t('noStoreNameSet')}</p>
      </Card>

      {/* Profile Details */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">{t('profileDetails')}</h3>
          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              <Edit2 className="w-4 h-4 mr-2" />
              {t('edit')}
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCancel}>
                <X className="w-4 h-4 mr-1" />
                {t('cancel')}
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Check className="w-4 h-4 mr-1" />
                {t('save')}
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">{t('name')}</label>
            {isEditing ? (
              <Input
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder={t('enterName')}
              />
            ) : (
              <p className="text-gray-700">{profile?.name || t('notSet')}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t('email')}</label>
            {isEditing ? (
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder={t('enterEmail')}
              />
            ) : (
              <p className="text-gray-700">{profile?.email || t('notSet')}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t('phone')}</label>
            {isEditing ? (
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder={t('enterPhone')}
              />
            ) : (
              <p className="text-gray-700">{profile?.phone || t('notSet')}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t('storeName')}</label>
            {isEditing ? (
              <Input
                value={formData.storeName}
                onChange={(e) => setFormData({...formData, storeName: e.target.value})}
                placeholder={t('enterStoreName')}
              />
            ) : (
              <p className="text-gray-700">{profile?.storeName || t('notSet')}</p>
            )}
          </div>
        </div>
      </Card>

      {/* Settings Card */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">{t('settings')}</h3>
        <div className="space-y-3">
          <Button variant="destructive" className="w-full" onClick={handleLogout}>
            {t('logout')}
          </Button>
          <Button variant="secondary" className="w-full" onClick={startTour}>
            <Settings className="w-4 h-4 mr-2" />
            {t('productTour')}
          </Button>
        </div>
      </Card>

      {/* Product Tour */}
      {showTour && <ProductTour isOpen={showTour} onClose={() => setShowTour(false)} />}
    </div>
  );
};

export default ProfileScreen;
