
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { User, LogOut, Camera, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface ProfileButtonProps {
  onProfileClick: () => void;
}

const ProfileButton: React.FC<ProfileButtonProps> = ({ onProfileClick }) => {
  const { user, profile, logout, updateProfile } = useAuth();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProfileClick = () => {
    onProfileClick();
    setOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    setOpen(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageDataUrl = e.target?.result as string;
        try {
          await updateProfile({ profilePhoto: imageDataUrl });
          toast.success('Profile picture updated successfully');
        } catch (error) {
          console.error('Error updating profile picture:', error);
          toast.error('Failed to update profile picture');
        }
      };
      reader.readAsDataURL(file);
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

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="ghost" className="p-1 rounded-full h-auto">
            <Avatar className="w-8 h-8">
              {profile?.profilePhoto ? (
                <AvatarImage src={profile.profilePhoto} alt={profile?.name || 'User'} />
              ) : null}
              <AvatarFallback className="text-xs font-medium bg-primary text-white">
                {getInitials(profile?.name)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-0 bg-white border border-gray-200 shadow-lg" align="end">
          <div className="bg-white rounded-lg">
            {/* Profile Header */}
            <div className="px-4 py-3 border-b border-gray-100 bg-white">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  {profile?.profilePhoto ? (
                    <AvatarImage src={profile.profilePhoto} alt={profile?.name || 'User'} />
                  ) : null}
                  <AvatarFallback className="text-sm font-medium bg-primary text-white">
                    {getInitials(profile?.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-900 truncate">{profile?.name || 'User'}</p>
                  <p className="text-xs text-gray-500 truncate">{profile?.phone || ''}</p>
                </div>
              </div>
            </div>

            {/* Profile Picture Actions */}
            <div className="px-2 py-2 border-b border-gray-100 bg-white">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="w-full justify-start text-gray-700 hover:bg-gray-50"
              >
                <Camera className="w-4 h-4 mr-2" />
                {profile?.profilePhoto ? 'Change Photo' : 'Add Photo'}
              </Button>
              {profile?.profilePhoto && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemovePhoto}
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove Photo
                </Button>
              )}
            </div>

            {/* Menu Actions */}
            <div className="px-2 py-2 bg-white">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleProfileClick}
                className="w-full justify-start text-gray-700 hover:bg-gray-50"
              >
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
    </>
  );
};

export default ProfileButton;
