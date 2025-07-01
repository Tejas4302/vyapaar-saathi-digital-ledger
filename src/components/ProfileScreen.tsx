
import React, { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Camera, User, Phone, Mail, Store, Edit2, Save, X, LogOut, HelpCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

interface ProfileScreenProps {
  onStartTour: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ onStartTour }) => {
  const { user, logout, updateProfile } = useAuth();
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    storeName: user?.storeName || '',
    profilePhoto: user?.profilePhoto || ''
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error(t('photoSizeLessThan5MB'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setEditedUser(prev => ({ ...prev, profilePhoto: result }));
        toast.success(t('photoUploadedSuccessfully'));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerPhotoUpload = () => {
    fileInputRef.current?.click();
  };

  const handleSave = () => {
    updateProfile(editedUser);
    toast.success(t('profileUpdatedSuccessfully'));
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUser({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      storeName: user?.storeName || '',
      profilePhoto: user?.profilePhoto || ''
    });
    setIsEditing(false);
  };

  if (!user) return null;

  return (
    <div className="max-w-md mx-auto p-4 space-y-4 pb-20">
      {/* Profile Header */}
      <Card className="p-6 text-center">
        <div className="relative inline-block mb-4">
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {editedUser.profilePhoto ? (
              <img 
                src={editedUser.profilePhoto} 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-12 h-12 text-gray-400" />
            )}
          </div>
          {isEditing && (
            <Button
              size="sm"
              className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
              onClick={triggerPhotoUpload}
            >
              <Camera className="w-4 h-4" />
            </Button>
          )}
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handlePhotoUpload}
          className="hidden"
        />

        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {isEditing ? (
            <Input
              value={editedUser.name}
              onChange={(e) => setEditedUser(prev => ({ ...prev, name: e.target.value }))}
              className="text-center text-xl font-bold"
            />
          ) : (
            user.name
          )}
        </h2>
        
        <p className="text-gray-600 mb-4">
          {user.email ? user.email : user.phone}
        </p>

        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            variant="outline"
            className="w-full"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            {t('edit')} {t('profile')}
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              className="flex-1"
            >
              <Save className="w-4 h-4 mr-2" />
              {t('save')}
            </Button>
            <Button
              onClick={handleCancel}
              variant="outline"
              className="flex-1"
            >
              <X className="w-4 h-4 mr-2" />
              {t('cancel')}
            </Button>
          </div>
        )}
      </Card>

      {/* Profile Details */}
      <Card className="p-4">
        <h3 className="font-semibold mb-4">{t('profileDetails')}</h3>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-gray-400" />
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('name')}
              </label>
              {isEditing ? (
                <Input
                  value={editedUser.name}
                  onChange={(e) => setEditedUser(prev => ({ ...prev, name: e.target.value }))}
                />
              ) : (
                <p className="text-gray-900">{user.name}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Store className="w-5 h-5 text-gray-400" />
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('storeName')}
              </label>
              {isEditing ? (
                <Input
                  value={editedUser.storeName}
                  onChange={(e) => setEditedUser(prev => ({ ...prev, storeName: e.target.value }))}
                  placeholder={t('enterStoreName')}
                />
              ) : (
                <p className="text-gray-900">
                  {user.storeName || t('notSet')}
                </p>
              )}
            </div>
          </div>

          {user.email && (
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gray-400" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('email')}
                </label>
                <p className="text-gray-900">{user.email}</p>
              </div>
            </div>
          )}

          {user.phone && (
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gray-400" />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('phone')}
                </label>
                <p className="text-gray-900">{user.phone}</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Product Tour Button */}
      <Button
        onClick={onStartTour}
        variant="outline"
        className="w-full"
      >
        <HelpCircle className="w-4 h-4 mr-2" />
        {t('takeProductTour')}
      </Button>

      {/* Logout Button */}
      <Button
        onClick={logout}
        variant="destructive"
        className="w-full"
      >
        <LogOut className="w-4 h-4 mr-2" />
        {t('logout')}
      </Button>
    </div>
  );
};

export default ProfileScreen;
