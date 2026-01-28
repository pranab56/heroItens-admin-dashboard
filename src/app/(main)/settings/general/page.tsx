"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useGetGlobalSettingsQuery, useGlobalSettingsMutation } from '@/features/settings/settingsApi';
import { Minus, Plus, Upload, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { baseURL } from '../../../../utils/BaseURL';

export default function GlobalSystemSettings() {
  const [platformName, setPlatformName] = useState('');
  const [platformLogo, setPlatformLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [existingLogoUrl, setExistingLogoUrl] = useState<string>('');
  const [voteLimit, setVoteLimit] = useState(5);

  const [updateGlobalSettings, { isLoading }] = useGlobalSettingsMutation();
  const { data: globalSettings, isLoading: isGlobalSettingsLoading } = useGetGlobalSettingsQuery({});

  // Load data from API when component mounts or data changes
  useEffect(() => {
    if (globalSettings?.data) {
      const settingsData = globalSettings.data;
      setPlatformName(settingsData.websiteName || '');
      setVoteLimit(settingsData.voteLimit || 5);
      if (settingsData.image) {
        const fullImageUrl = `${baseURL}${settingsData.image}`;
        setExistingLogoUrl(fullImageUrl);
      }
    }
  }, [globalSettings]);

  const incrementVoteLimit = () => {
    setVoteLimit(prev => prev + 1);
  };

  const decrementVoteLimit = () => {
    setVoteLimit(prev => Math.max(1, prev - 1));
  };

  // Handle file selection and preview
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      setPlatformLogo(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove selected logo
  const handleRemoveLogo = () => {
    setPlatformLogo(null);
    setLogoPreview('');
    // Reset file input
    const fileInput = document.getElementById('logo-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleUpdateGlobalSettings = async () => {
    try {
      const data = {
        globalSettingType: "globalSetting",
        websiteName: platformName,
        voteLimit: voteLimit
      };

      const formData = new FormData();
      formData.append("data", JSON.stringify(data));

      if (platformLogo) {
        formData.append('image', platformLogo);
      }

      const response = await updateGlobalSettings(formData).unwrap();
      toast.success(response?.message || "Global settings updated successfully");

      // Clear the new logo selection after successful update
      setPlatformLogo(null);
      setLogoPreview('');
    } catch (error: any) {
      console.error('Error updating global settings:', error);
      toast.error(error?.data?.message || "Failed to update global settings");
    }
  };

  const handleCancel = () => {
    // Reset to API data
    if (globalSettings?.data) {
      setPlatformName(globalSettings.data.websiteName || '');
      setVoteLimit(globalSettings.data.voteLimit || 5);
    }
    setPlatformLogo(null);
    setLogoPreview('');
  };

  // Show loading state while fetching data
  if (isGlobalSettingsLoading) {
    return (
      <div className="text-white p-6 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400">Loading settings...</p>
        </div>
      </div>
    );
  }

  // Determine which image to show: new preview or existing logo
  const displayImage = logoPreview || existingLogoUrl;

  return (
    <div className="text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-semibold mb-3">Global System Settings</h1>
        <p className="text-gray-400 text-base">
          Manage your platform's core identity, global behaviors, and community voting preferences.
        </p>
      </div>

      {/* Settings Card */}
      <div className="bg-[#1C2936] rounded-lg p-8">
        {/* General Information Section */}
        <div className="mb-10">
          <h2 className="text-xl font-medium mb-6">General Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Platform Name */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">Platform Name</label>
              <Input
                value={platformName}
                onChange={(e) => setPlatformName(e.target.value)}
                className="border-gray-500 text-white h-12 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Enter platform name"
              />
            </div>

            {/* Platform Logo */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">Platform Logo</label>

              {/* Preview Section */}
              {displayImage ? (
                <div className="relative border-2 border-dashed border-gray-500 rounded-lg p-4 h-32 flex items-center justify-center">
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img
                      src={displayImage}
                      alt="Logo preview"
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <button
                    onClick={handleRemoveLogo}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                    type="button"
                    title="Remove and upload new image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  {/* Show indicator if this is existing image vs new upload */}
                  {!logoPreview && existingLogoUrl && (
                    <div className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                      Current Logo
                    </div>
                  )}
                  {logoPreview && (
                    <div className="absolute bottom-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                      New Upload
                    </div>
                  )}
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-500 rounded-lg p-4 h-32 flex items-center justify-center hover:border-blue-500 transition-colors cursor-pointer">
                  <label htmlFor="logo-input" className="flex flex-col items-center cursor-pointer w-full h-full justify-center">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-400">Click to upload logo</span>
                    <span className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</span>
                  </label>
                </div>
              )}

              <Input
                id="logo-input"
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Voting Rules & Limits Section */}
        <div className="mb-8">
          <h2 className="text-xl font-medium mb-6">Voting Rules & Limits</h2>

          {/* Daily Vote Limit */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-medium mb-1">Daily Vote Limit per User</h3>
              <p className="text-sm text-gray-400">
                Maximum number of votes a single user can cast within 24 hours.
              </p>
            </div>

            {/* Counter */}
            <div className="flex items-center gap-3 border border-gray-500 rounded-lg px-4 py-2">
              <button
                onClick={decrementVoteLimit}
                className="text-gray-400 hover:text-white transition-colors"
                type="button"
              >
                <Minus className="w-5 h-5 cursor-pointer" />
              </button>
              <span className="text-2xl font-semibold w-12 text-center">{voteLimit}</span>
              <button
                onClick={incrementVoteLimit}
                className="text-gray-400 hover:text-white transition-colors"
                type="button"
              >
                <Plus className="w-5 h-5 cursor-pointer" />
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-6">
          <Button
            onClick={handleCancel}
            variant="outline"
            className="bg-[#3a2832] border-[#3a2832] text-red-400 hover:bg-[#4a3842] hover:text-red-300 px-8 h-11"
            type="button"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateGlobalSettings}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-11"
            type="button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}