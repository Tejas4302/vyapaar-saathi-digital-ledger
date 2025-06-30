
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Store, Key, LogOut, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

const ProfileScreen: React.FC = () => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    storeName: user?.storeName || '',
    profilePhoto: user?.profilePhoto || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
  };

  const handleProfileUpdate = () => {
    // In a real app, this would update the user profile
    setIsEditing(false);
    toast.success('Profile updated successfully');
  };

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    // In a real app, this would change the password
    setShowPasswordForm(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    toast.success('Password changed successfully');
  };

  const handlePhotoUpload = () => {
    // In a real app, this would open photo picker
    toast.info('Photo upload feature will be available in the mobile app');
  };

  const handlePhotoRemove = () => {
    setProfileData({ ...profileData, profilePhoto: '' });
    toast.success('Profile photo removed');
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-4 pb-20">
      {/* Profile Header */}
      <Card className="p-6 text-center">
        <div className="relative inline-block mb-4">
          <Avatar className="w-24 h-24 mx-auto">
            <AvatarImage src={profileData.profilePhoto} />
            <AvatarFallback className="text-xl bg-primary text-white">
              {profileData.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <Button
            size="sm"
            className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
            onClick={handlePhotoUpload}
          >
            <Camera className="w-4 h-4" />
          </Button>
        </div>
        
        {profileData.profilePhoto && (
          <Button
            variant="outline"
            size="sm"
            onClick={handlePhotoRemove}
            className="mb-4"
          >
            Remove Photo
          </Button>
        )}

        <h2 className="text-xl font-bold text-primary">{profileData.name}</h2>
        {profileData.storeName && (
          <p className="text-gray-600">{profileData.storeName}</p>
        )}
        <p className="text-sm text-gray-500">{user?.email || user?.phone}</p>
      </Card>

      {/* Profile Information */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Profile Information</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                disabled={!isEditing}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Store Name</label>
            <div className="relative">
              <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                value={profileData.storeName}
                onChange={(e) => setProfileData({ ...profileData, storeName: e.target.value })}
                disabled={!isEditing}
                placeholder="Enter your store name"
                className="pl-10"
              />
            </div>
          </div>

          {isEditing && (
            <Button
              onClick={handleProfileUpdate}
              className="w-full bg-primary hover:bg-blue-800"
            >
              Save Changes
            </Button>
          )}
        </div>
      </Card>

      {/* Password Change */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Security</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPasswordForm(!showPasswordForm)}
          >
            <Key className="w-4 h-4 mr-2" />
            Change Password
          </Button>
        </div>

        {showPasswordForm && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Current Password</label>
              <Input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                placeholder="Enter current password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">New Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="Enter new password"
                  className="pr-10"
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Confirm New Password</label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  placeholder="Confirm new password"
                  className="pr-10"
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handlePasswordChange}
                className="flex-1 bg-primary hover:bg-blue-800"
              >
                Update Password
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowPasswordForm(false);
                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Logout Button */}
      <Card className="p-4">
        <Button
          onClick={handleLogout}
          variant="destructive"
          className="w-full"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Button>
      </Card>
    </div>
  );
};

export default ProfileScreen;
