import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { User, Edit2, X, Check, Settings, Trash2, Camera } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ProductTour from '@/components/ProductTour';
import ImageCropper from '@/components/ImageCropper';
import PhotoViewer from '@/components/PhotoViewer';

interface ProfileScreenProps {
  onStartTour?: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ onStartTour }) => {
  const { user, profile, logout, updateProfile, deleteAccount } = useAuth();
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showImageCropper, setShowImageCropper] = useState(false);
  const [showPhotoViewer, setShowPhotoViewer] = useState(false);
  const [tempImageUrl, setTempImageUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    phone: profile?.phone || '',
    storeName: profile?.storeName || ''
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        phone: profile.phone || '',
        storeName: profile.storeName || ''
      });
    }
  }, [profile]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataUrl = e.target?.result as string;
        setTempImageUrl(imageDataUrl);
        setShowImageCropper(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = async (croppedImageUrl: string) => {
    try {
      await updateProfile({ profilePhoto: croppedImageUrl });
      toast.success('Profile picture updated successfully');
      setTempImageUrl('');
    } catch (error) {
      console.error('Error updating profile picture:', error);
      toast.error('Failed to update profile picture');
    }
  };

  const handleRemovePhoto = async () => {
    try {
      await updateProfile({ profilePhoto: undefined });
      toast.success('Profile picture removed successfully');
    } catch (error) {
      console.error('Error removing profile picture:', error);
      toast.error('Failed to remove profile picture');
    }
  };

  const handleAvatarClick = () => {
    setShowPhotoViewer(true);
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleSave = async () => {
    try {
      await updateProfile({
        name: formData.name,
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
      phone: profile?.phone || '',
      storeName: profile?.storeName || ''
    });
    setIsEditing(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success(t('logoutSuccessful'));
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Error logging out');
    }
  };

  const startTour = () => {
    if (onStartTour) {
      onStartTour();
    } else {
      setShowTour(true);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      toast.success('Account deleted successfully');
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Failed to delete account');
    }
  };

  return (
    <div className="mobile-container bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Profile Header with Photo */}
      <Card className="mobile-card text-center gradient-primary text-white">
        <div className="relative w-20 h-20 mx-auto mb-4">
          <Avatar 
            className="w-20 h-20 cursor-pointer hover:opacity-80 transition-opacity" 
            onClick={handleAvatarClick}
          >
            {profile?.profilePhoto ? (
              <AvatarImage src={profile.profilePhoto} alt={profile?.name || 'User'} />
            ) : null}
            <AvatarFallback className="text-2xl font-bold bg-white/20 text-white">
              {getInitials(profile?.name)}
            </AvatarFallback>
          </Avatar>
        </div>
        
        {/* Photo Management Buttons */}
        <div className="flex justify-center gap-2 mb-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="bg-white/20 border-white/30 text-white hover:bg-white/30"
          >
            <Camera className="w-4 h-4 mr-2" />
            {profile?.profilePhoto ? 'Change Photo' : 'Add Photo'}
          </Button>
          {profile?.profilePhoto && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRemovePhoto}
              className="bg-red-500/20 border-red-300/30 text-white hover:bg-red-500/30"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Remove
            </Button>
          )}
        </div>

        <h2 className="text-xl font-bold text-proper">{profile?.name || t('user')}</h2>
        <p className="text-sm opacity-80 text-proper">{profile?.storeName || t('noStoreNameSet')}</p>
      </Card>

      {/* Profile Details */}
      <Card className="mobile-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-proper">{t('profileDetails')}</h3>
          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="text-proper">
              <Edit2 className="w-4 h-4 mr-2" />
              {t('edit')}
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCancel} className="text-proper">
                <X className="w-4 h-4 mr-1" />
                {t('cancel')}
              </Button>
              <Button size="sm" onClick={handleSave} className="gradient-primary text-proper">
                <Check className="w-4 h-4 mr-1" />
                {t('save')}
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="label-text">{t('name')}</label>
            {isEditing ? (
              <Input
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder={t('enterName')}
                className="mobile-input"
              />
            ) : (
              <p className="text-gray-700 text-proper">{profile?.name || t('notSet')}</p>
            )}
          </div>

          <div>
            <label className="label-text">{t('phone')}</label>
            {isEditing ? (
              <Input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder={t('enterPhone')}
                className="mobile-input"
              />
            ) : (
              <p className="text-gray-700">{profile?.phone || t('notSet')}</p>
            )}
          </div>

          <div>
            <label className="label-text">{t('storeName')}</label>
            {isEditing ? (
              <Input
                value={formData.storeName}
                onChange={(e) => setFormData({...formData, storeName: e.target.value})}
                placeholder={t('enterStoreName')}
                className="mobile-input"
              />
            ) : (
              <p className="text-gray-700 text-proper">{profile?.storeName || t('notSet')}</p>
            )}
          </div>
        </div>
      </Card>

      {/* Settings Card */}
      <Card className="mobile-card">
        <h3 className="text-lg font-semibold mb-4 text-proper">{t('settings')}</h3>
        <div className="space-y-3">
          <Button variant="destructive" className="mobile-button gradient-danger text-proper" onClick={handleLogout}>
            {t('logout')}
          </Button>
          <Button variant="secondary" className="mobile-button text-proper" onClick={startTour}>
            <Settings className="w-4 h-4 mr-2" />
            {t('productTour')}
          </Button>
          
          {/* Delete Account Section */}
          {!showDeleteConfirm ? (
            <Button 
              variant="destructive" 
              className="mobile-button bg-red-600 hover:bg-red-700 text-white border-red-600"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account
            </Button>
          ) : (
            <div className="space-y-2 p-3 bg-red-50 rounded-lg border border-red-200">
              <p className="text-sm text-red-800 font-medium">
                Are you sure you want to delete your account? This action cannot be undone.
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="text-proper"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  className="bg-red-600 hover:bg-red-700 text-proper"
                >
                  Yes, Delete Account
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Image Cropper */}
      <ImageCropper
        isOpen={showImageCropper}
        onClose={() => {
          setShowImageCropper(false);
          setTempImageUrl('');
        }}
        imageUrl={tempImageUrl}
        onCropComplete={handleCropComplete}
      />

      {/* Photo Viewer */}
      <PhotoViewer
        isOpen={showPhotoViewer}
        onClose={() => setShowPhotoViewer(false)}
        imageUrl={profile?.profilePhoto}
        fallbackText={getInitials(profile?.name)}
      />

      {/* Product Tour */}
      {showTour && <ProductTour isOpen={showTour} onClose={() => setShowTour(false)} />}
    </div>
  );
};

export default ProfileScreen;
