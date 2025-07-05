
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { User, LogOut } from 'lucide-react';

interface ProfileButtonProps {
  onProfileClick: () => void;
}

const ProfileButton: React.FC<ProfileButtonProps> = ({ onProfileClick }) => {
  const { user, profile, logout } = useAuth();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  const handleProfileClick = () => {
    onProfileClick();
    setOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    setOpen(false);
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
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
  );
};

export default ProfileButton;
