"use client";

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useChangePasswordMutation, useGetMyProfileQuery, useUpdateProfileMutation } from '@/features/profile/profileApi';
import { baseURL } from '@/utils/BaseURL';
import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function UserProfilePage() {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [passwordErrors, setPasswordErrors] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState({ old: false, new: false, confirm: false });

  const togglePasswordVisibility = (field: 'old' | 'new' | 'confirm') => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const { data: profileDataResponse, isLoading, refetch } = useGetMyProfileQuery(
    typeof window !== 'undefined' ? localStorage.getItem("HeroItemsAdminId") : null,
    { skip: typeof window === 'undefined' || !localStorage.getItem("HeroItemsAdminId") }
  );

  const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateProfileMutation();
  const [updatePassword, { isLoading: isUpdatingPassword }] = useChangePasswordMutation();

  const profileData = profileDataResponse?.data;

  const [editFormData, setEditFormData] = useState({
    fullName: '',
    profile: null as File | null,
    location: '',
    phone: '',
    dateOfBirth: '' as string | Date
  });

  // Initialize form data when profile data loads
  useEffect(() => {
    if (profileData) {
      setEditFormData({
        fullName: profileData.name || '',
        profile: null,
        location: profileData.address || '',
        phone: profileData.contact || '',
        dateOfBirth: profileData.dateOfBirth ? new Date(profileData.dateOfBirth) : ''
      });
    }
  }, [profileData]);

  const handleSaveChanges = async () => {
    try {
      const formData = new FormData();

      const updatePayload = {
        name: editFormData.fullName,
        address: editFormData.location,
        contact: editFormData.phone,
        // Include other fields if supported by API
        ...(editFormData.dateOfBirth ? { dateOfBirth: editFormData.dateOfBirth } : {})
      };

      formData.append("data", JSON.stringify(updatePayload));

      if (editFormData.profile) {
        formData.append("image", editFormData.profile);
      }

      const response = await updateProfile(formData).unwrap();

      if (response.success) {
        toast.success(response.message || 'Profile updated successfully');
        setIsEditDialogOpen(false);
        setPreviewImage(null);
        refetch(); // Refresh profile data
      } else {
        toast.error(response.message || 'Failed to update profile');
      }

    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to update profile');
      console.error('Update profile error:', error);
    }
  };

  const validatePasswordFields = () => {
    const errors = { oldPassword: '', newPassword: '', confirmPassword: '' };
    let isValid = true;

    if (!oldPassword.trim()) {
      errors.oldPassword = 'Old password is required';
      isValid = false;
    }

    if (!newPassword.trim()) {
      errors.newPassword = 'New password is required';
      isValid = false;
    } else if (newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters';
      isValid = false;
    }

    if (!confirmPassword.trim()) {
      errors.confirmPassword = 'Confirm password is required';
      isValid = false;
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setPasswordErrors(errors);
    return isValid;
  };

  const handlePasswordChange = async () => {
    if (!validatePasswordFields()) {
      return;
    }

    try {
      const response = await updatePassword({
        currentPassword: oldPassword,
        newPassword: newPassword,
        confirmPassword: confirmPassword
      }).unwrap();

      if (response.success) {
        toast.success(response.message || 'Password changed successfully');
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setPasswordErrors({ oldPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        toast.error(response.message || 'Failed to change password');
      }
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to change password');
      console.error('Password change error:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditFormData({ ...editFormData, profile: file });

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Clear password errors when user starts typing
  useEffect(() => {
    if (oldPassword && passwordErrors.oldPassword) {
      setPasswordErrors(prev => ({ ...prev, oldPassword: '' }));
    }
  }, [oldPassword, passwordErrors.oldPassword]);

  useEffect(() => {
    if (newPassword && passwordErrors.newPassword) {
      setPasswordErrors(prev => ({ ...prev, newPassword: '' }));
    }
  }, [newPassword, passwordErrors.newPassword]);

  useEffect(() => {
    if (confirmPassword && passwordErrors.confirmPassword) {
      setPasswordErrors(prev => ({ ...prev, confirmPassword: '' }));
    }
  }, [confirmPassword, passwordErrors.confirmPassword]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-white">Loading profile...</div>
      </div>
    );
  }

  // Get profile image URL - use default if no profile image
  // Assuming 'image' field exists in response based on car API patterns, otherwise fallback
  const profileImageUrl = profileData?.image
    ? (profileData.image.startsWith('http') ? profileData.image : `${baseURL}${profileData.image}`)
    : '/default-avatar.png'; // Make sure this asset exists or use a web placeholder

  return (
    <div className="">
      <div className="">
        {/* Profile Header Card */}
        <div className="bg-[#1C2936] rounded-lg text-white shadow-sm p-8 mb-6">
          <div className="flex items-start justify-between">
            <div className="flex gap-6">
              {/* Profile Image */}
              <div className="w-32 h-32 rounded-full overflow-hidden shrink-0 border-2 border-gray-200">
                <Image
                  src={previewImage || profileImageUrl}
                  alt="Profile"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                  unoptimized // Add this to bypass optimization for external URLs if needed
                />
              </div>

              {/* Profile Info Grid */}
              <div className="grid grid-cols-3 gap-x-16 gap-y-6 flex-1">
                <div>
                  <div className="text-sm  text-white mb-1">Full Name</div>
                  <div className="text-base font-medium text-gray-300">{profileData?.name || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-white mb-1">Role</div>
                  <div className="text-base font-medium text-gray-300 capitalize">{profileData?.role}</div>
                </div>
                <div>
                  <div className="text-sm text-white mb-1">Email Address</div>
                  <div className="text-base font-medium text-gray-300">{profileData?.email}</div>
                </div>
                <div>
                  <div className="text-sm text-white mb-1">Phone Number</div>
                  <div className="text-base font-medium text-gray-300">{profileData?.contact || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-white mb-1">Location</div>
                  <div className="text-base font-medium text-gray-300">{profileData?.address || 'N/A'}</div>
                </div>
              </div>
            </div>

            {/* Edit Button */}
            <Button
              onClick={() => setIsEditDialogOpen(true)}
              className="text-white px-6"
            >
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Password Section */}
        <div className="bg-[#1C2936] rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col gap-6 w-full">
            <h3 className="text-xl font-semibold text-white mb-2">Change Password</h3>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
              <div className='w-full'>
                <div className="text-sm font-medium text-gray-300 mb-2">Old Password</div>
                <div className="relative">
                  <Input
                    type={showPassword.old ? "text" : "password"}
                    placeholder="Enter current password..."
                    className={`w-full text-white placeholder:text-gray-500 bg-[#2D3748] border-none focus:ring-1 focus:ring-cyan-400 h-10 pr-10 ${passwordErrors.oldPassword ? 'border-2 border-red-500' : ''}`}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('old')}
                    className="absolute right-3 cursor-pointer top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword.old ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {passwordErrors.oldPassword && (
                  <p className="text-red-500 text-xs mt-1">{passwordErrors.oldPassword}</p>
                )}
              </div>
              <div className='w-full'>
                <div className="text-sm font-medium text-gray-300 mb-2">New Password</div>
                <div className="relative">
                  <Input
                    type={showPassword.new ? "text" : "password"}
                    placeholder="Enter new password..."
                    className={`w-full text-white placeholder:text-gray-500 bg-[#2D3748] border-none focus:ring-1 focus:ring-cyan-400 h-10 pr-10 ${passwordErrors.newPassword ? 'border-2 border-red-500' : ''}`}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword.new ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {passwordErrors.newPassword && (
                  <p className="text-red-500 text-xs mt-1">{passwordErrors.newPassword}</p>
                )}
              </div>
              <div className='w-full'>
                <div className="text-sm font-medium text-gray-300 mb-2">Confirm Password</div>
                <div className="relative">
                  <Input
                    type={showPassword.confirm ? "text" : "password"}
                    placeholder="Confirm new password..."
                    className={`w-full text-white placeholder:text-gray-500 bg-[#2D3748] border-none focus:ring-1 focus:ring-cyan-400 h-10 pr-10 ${passwordErrors.confirmPassword ? 'border-2 border-red-500' : ''}`}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute right-3 cursor-pointer top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {passwordErrors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">{passwordErrors.confirmPassword}</p>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-end mt-8">
            <Button
              className="text-white px-6 bg-cyan-600 hover:bg-cyan-700 transition-colors"
              onClick={handlePasswordChange}
              disabled={isUpdatingPassword}
            >
              {isUpdatingPassword ? 'Changing...' : 'Change Password'}
            </Button>
          </div>
        </div>

      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] bg-[#1C2936] border border-gray-800">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-white">Edit Profile</DialogTitle>
          </DialogHeader>

          <div className="text-sm text-white mb-4">
            Update your profile information below
          </div>

          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <Label htmlFor="fullName" className="text-sm font-medium mb-2 block text-white">
                Full Name
              </Label>
              <Input
                id="fullName"
                value={editFormData.fullName}
                onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
                className="w-full text-white placeholder:text-white"
                placeholder="Enter your full name"
              />
            </div>

            {/* Profile Picture with Preview */}
            <div>
              <Label htmlFor="profile" className="text-sm font-medium mb-2 block text-white">
                Profile Picture
              </Label>
              <div className="flex items-center gap-4 mb-3">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
                  <Image
                    src={previewImage || profileImageUrl}
                    alt="Current Profile"
                    width={96}
                    height={96}
                    className="w-full h-full object-cover text-white"
                    unoptimized
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-100 mb-2">Current profile picture</p>
                  <p className="text-xs text-gray-100">Upload a new image to replace it</p>
                </div>
              </div>
              <Input
                id="profile"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full text-white placeholder:text-white"
              />
              <p className="text-xs text-gray-100 mt-1">Upload a new profile picture (optional)</p>
            </div>

            {/* Location and Phone Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location" className="text-sm font-medium mb-2 block text-white">
                  Location (Address)
                </Label>
                <Input
                  id="location"
                  value={editFormData.location}
                  onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                  className="w-full text-white placeholder:text-white"
                  placeholder="e.g., Dhaka, Bangladesh"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-sm font-medium mb-2 block text-white">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                  className="w-full text-white placeholder:text-white"
                  placeholder="Enter phone number"
                />
              </div>
            </div>
            {/* Date of Birth input removed as API response didn't explicitly show it, but kept support in map just in case. 
                Replacing with Phone number as that's more common in the seen response ("contact")
            */}
          </div>

          {/* Dialog Footer Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => {
                setIsEditDialogOpen(false);
                setPreviewImage(null);
              }}
              className="px-6"
              disabled={isUpdatingProfile}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveChanges}
              className="text-white px-6"
              disabled={isUpdatingProfile}
            >
              {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}