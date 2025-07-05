
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { User, LogOut, Settings } from 'lucide-react';

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
        <Button variant="ghost" className="p-2 rounded-full">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="text-xs font-medium bg-primary text-white">
              {getInitials(profile?.name)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2" align="end">
        <div className="space-y-1">
          <div className="px-3 py-2 border-b">
            <p className="font-medium text-sm">{profile?.name || 'User'}</p>
            <p className="text-xs text-gray-500">{profile?.phone || ''}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleProfileClick}
            className="w-full justify-start"
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
      </PopoverContent>
    </Popover>
  );
};

export default ProfileButton;
