
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface PhotoViewerProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl?: string;
  fallbackText: string;
}

const PhotoViewer: React.FC<PhotoViewerProps> = ({
  isOpen,
  onClose,
  imageUrl,
  fallbackText,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm p-2 bg-black/90 border-none">
        <div className="flex items-center justify-center">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Profile"
              className="max-w-full max-h-96 object-contain rounded-lg"
            />
          ) : (
            <Avatar className="w-64 h-64">
              <AvatarFallback className="text-4xl font-bold bg-primary text-white">
                {fallbackText}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PhotoViewer;
