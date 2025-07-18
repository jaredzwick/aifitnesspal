import React, { useState } from 'react';
import { Camera, Upload, X, Check } from 'lucide-react';
import { FitnessUser } from '../../types';

interface PhotosStepProps {
  userData: Partial<FitnessUser>;
  onUpdate: (data: Partial<FitnessUser>) => void;
  onNext: () => void;
  onPrev: () => void;
}

interface PhotoUpload {
  id: string;
  file: File;
  preview: string;
  type: 'front' | 'side' | 'back';
}

export const PhotosStep: React.FC<PhotosStepProps> = ({
  userData,
  onUpdate,
  onNext,
  onPrev,
}) => {
  const [photos, setPhotos] = useState<PhotoUpload[]>([]);
  const [uploading, setUploading] = useState(false);

  const photoTypes = [
    { id: 'front', label: 'Front View', icon: '📸', description: 'Face the camera' },
    { id: 'side', label: 'Side View', icon: '📷', description: 'Turn to your side' },
    { id: 'back', label: 'Back View', icon: '📹', description: 'Turn around' },
  ];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, type: 'front' | 'side' | 'back') => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    const preview = URL.createObjectURL(file);
    const newPhoto: PhotoUpload = {
      id: Date.now().toString(),
      file,
      preview,
      type,
    };

    // Remove existing photo of same type
    setPhotos(prev => prev.filter(p => p.type !== type).concat(newPhoto));
  };

  const removePhoto = (id: string) => {
    setPhotos(prev => {
      const photo = prev.find(p => p.id === id);
      if (photo) {
        URL.revokeObjectURL(photo.preview);
      }
      return prev.filter(p => p.id !== id);
    });
  };

  const handleSubmit = async () => {
    // In a real app, you would upload photos to Supabase storage here
    // For now, we'll just store the file references
    onUpdate({
      progressPhotos: photos.map(p => ({
        type: p.type,
        file: p.file,
        preview: p.preview,
      })),
    });
    onNext();
  };

  const getPhotoForType = (type: 'front' | 'side' | 'back') => {
    return photos.find(p => p.type === type);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Progress Photos
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          Optional: Add progress photos to track your transformation journey.
        </p>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 border border-blue-100 dark:border-blue-800">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
            <Camera className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Starting Photos
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Take photos from different angles to track your progress over time
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {photoTypes.map((photoType) => {
            const existingPhoto = getPhotoForType(photoType.id as 'front' | 'side' | 'back');
            
            return (
              <div key={photoType.id} className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl mb-2">{photoType.icon}</div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {photoType.label}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {photoType.description}
                  </p>
                </div>

                <div className="relative">
                  {existingPhoto ? (
                    <div className="relative group">
                      <img
                        src={existingPhoto.preview}
                        alt={`${photoType.label} progress photo`}
                        className="w-full aspect-[3/4] object-cover rounded-xl border-2 border-green-200 dark:border-green-700"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                        <button
                          onClick={() => removePhoto(existingPhoto.id)}
                          className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      <div className="absolute top-2 right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  ) : (
                    <label className="block w-full aspect-[3/4] border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-blue-400 dark:hover:border-blue-500 transition-colors cursor-pointer group">
                      <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                        <Upload className="w-8 h-8 mb-2" />
                        <span className="text-sm font-medium">Upload Photo</span>
                        <span className="text-xs">JPG, PNG up to 10MB</span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileSelect(e, photoType.id as 'front' | 'side' | 'back')}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
          <div className="flex items-start space-x-3">
            <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs text-yellow-900">💡</span>
            </div>
            <div className="text-sm text-yellow-800 dark:text-yellow-200">
              <p className="font-medium mb-1">Photo Tips:</p>
              <ul className="space-y-1 text-xs">
                <li>• Wear form-fitting clothes or workout attire</li>
                <li>• Use good lighting (natural light works best)</li>
                <li>• Stand in the same position for consistency</li>
                <li>• Keep the same background for future photos</li>
              </ul>
            </div>
          </div>
        </div>

        {photos.length === 0 && (
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              No photos uploaded yet. Photos are optional but help track your amazing transformation!
            </p>
          </div>
        )}
      </div>

      <div className="flex space-x-4">
        <button
          onClick={onPrev}
          className="flex-1 py-3 px-6 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={uploading}
          className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold disabled:opacity-50 transition-all duration-200"
        >
          {uploading ? 'Uploading...' : photos.length > 0 ? 'Continue with Photos' : 'Skip Photos'}
        </button>
      </div>
    </div>
  );
};