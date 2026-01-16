"use client";

import { Button } from '@/components/ui/button';
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Shield, User } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

// Demo profile data
const demoProfileData = {
  id: "1",
  fullName: "John Doe",
  first_name: "John",
  last_name: "Doe",
  email: "john.doe@example.com",
  role: "user",
  phone: "+1 (555) 123-4567",
  location: "New York, USA",
  dateOfBirth: "1990-05-15",
  profile: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=80&h=80&fit=crop",
  twoStepVerification: false,
  createdAt: "2024-01-01T10:00:00Z",
  updatedAt: "2024-01-15T14:30:00Z"
};


export default function UserProfilePage() {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [passwordErrors, setPasswordErrors] = useState({ oldPassword: '', newPassword: '' });

  // Demo state for profile data
  const [profileData, setProfileData] = useState(demoProfileData);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [isEnabling2FA, setIsEnabling2FA] = useState(false);

  const [editFormData, setEditFormData] = useState({
    fullName: '',
    profile: null as File | null,
    location: '',
    dateOfBirth: '' as string | Date
  });

  // Activity log with dynamic timestamps
  const [activityLog, setActivityLog] = useState<Array<{
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
    timestamp: string;
    bgColor: string;
    iconColor: string;
  }>>([]);

  // Initialize form data when component mounts
  useEffect(() => {
    setIsLoading(true);

    // Simulate API loading delay
    setTimeout(() => {
      // Parse dateOfBirth string to Date object if it exists
      let dobDate: Date | string = '';
      if (demoProfileData.dateOfBirth) {
        const parsedDate = new Date(demoProfileData.dateOfBirth);
        if (!isNaN(parsedDate.getTime())) {
          dobDate = parsedDate;
        }
      }

      setEditFormData({
        fullName: `${demoProfileData.first_name || ''} ${demoProfileData.last_name || ''}`.trim(),
        profile: null,
        location: demoProfileData.location || '',
        dateOfBirth: dobDate
      });

      // Create activity log based on profile data
      const activities = [];

      if (demoProfileData.updatedAt) {
        activities.push({
          icon: User,
          title: 'Profile Updated',
          description: 'Profile information was updated',
          timestamp: demoProfileData.updatedAt,
          bgColor: 'bg-purple-100',
          iconColor: 'text-purple-600'
        });
      }

      if (demoProfileData.twoStepVerification) {
        activities.push({
          icon: Shield,
          title: 'Security Settings Updated',
          description: 'Enabled Two-Factor Authentication',
          timestamp: demoProfileData.updatedAt,
          bgColor: 'bg-purple-100',
          iconColor: 'text-purple-600'
        });
      }

      // Add some demo activities
      activities.push({
        icon: User,
        title: 'Account Created',
        description: 'Your account was successfully created',
        timestamp: demoProfileData.createdAt,
        bgColor: 'bg-blue-100',
        iconColor: 'text-blue-600'
      });

      activities.push({
        icon: Shield,
        title: 'Login',
        description: 'You logged in from a new device',
        timestamp: '2024-01-10T09:15:00Z',
        bgColor: 'bg-green-100',
        iconColor: 'text-green-600'
      });

      setActivityLog(activities);
      setIsLoading(false);
    }, 500);
  }, []);

  // Add new activity to log
  const addActivityLog = (title: string, description: string, icon: React.ComponentType<{ className?: string }>) => {
    const newActivity = {
      icon,
      title,
      description,
      timestamp: new Date().toISOString(),
      bgColor: 'bg-purple-100',
      iconColor: 'text-purple-600'
    };
    setActivityLog(prev => [newActivity, ...prev]);
  };

  const handleSaveChanges = async () => {
    setIsUpdatingProfile(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      // Update profile data
      const updatedProfile = {
        ...profileData,
        fullName: editFormData.fullName,
        location: editFormData.location,
        dateOfBirth: editFormData.dateOfBirth instanceof Date
          ? editFormData.dateOfBirth.toISOString().split('T')[0]
          : editFormData.dateOfBirth,
        updatedAt: new Date().toISOString()
      };

      // Update profile image if new one is selected
      if (previewImage) {
        updatedProfile.profile = previewImage;
      }

      setProfileData(updatedProfile);

      toast.success('Profile updated successfully');
      addActivityLog('Profile Updated', 'Profile information was updated', User);
      setIsEditDialogOpen(false);
      setPreviewImage(null);
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Update profile error:', error);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const validatePasswordFields = () => {
    const errors = { oldPassword: '', newPassword: '' };
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

    setPasswordErrors(errors);
    return isValid;
  };

  const handlePasswordChange = async () => {
    if (!validatePasswordFields()) {
      return;
    }

    setIsResettingPassword(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      if (oldPassword !== 'demo123') {
        toast.error('Old password is incorrect');
        return;
      }
      toast.success('Password changed successfully');
      addActivityLog('Security Settings Updated', 'Password was changed', Shield);
      setOldPassword('');
      setNewPassword('');
      setPasswordErrors({ oldPassword: '', newPassword: '' });
    } catch (error) {
      toast.error('Failed to change password');
      console.error('Password change error:', error);
    } finally {
      setIsResettingPassword(false);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading profile...</div>
      </div>
    );
  }

  // Get profile image URL - use default if no profile image
  const profileImageUrl = profileData?.profile || '/default-avatar.png';

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
                  src={profileImageUrl.startsWith('data:') ? profileImageUrl : profileImageUrl}
                  alt="Profile"
                  width={1000}
                  height={1000}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Profile Info Grid */}
              <div className="grid grid-cols-3 gap-x-16 gap-y-6 flex-1">
                <div>
                  <div className="text-sm  text-white mb-1">First Name</div>
                  <div className="text-base font-medium text-gray-300">{profileData?.fullName || 'N/A'}</div>
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
                  <div className="text-base font-medium text-gray-300">{profileData?.phone || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-sm text-white mb-1">Location</div>
                  <div className="text-base font-medium text-gray-300">{profileData?.location || 'N/A'}</div>
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
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-4 w-full mr-4">
              <div className='grid grid-cols-2 gap-6'>
                <div className='w-full'>
                  <div className="text-base text-white font-semibold mb-3">Old Password</div>
                  <Input
                    type="password"
                    placeholder="Enter your old password here..."
                    className={`w-full text-white placeholder:text-white ${passwordErrors.oldPassword ? 'border-red-500' : ''}`}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                  {passwordErrors.oldPassword && (
                    <p className="text-red-500 text-sm mt-1">{passwordErrors.oldPassword}</p>
                  )}
                </div>
                <div className='w-full'>
                  <div className="text-base font-semibold mb-3 text-white">New Password</div>
                  <Input
                    type="password"
                    placeholder="Enter your new password here..."
                    className={`w-full text-white placeholder:text-white ${passwordErrors.newPassword ? 'border-red-500' : ''}`}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  {passwordErrors.newPassword && (
                    <p className="text-red-500 text-sm mt-1">{passwordErrors.newPassword}</p>
                  )}
                </div>
              </div>
            </div>
            <Button
              className="text-white px-6 mt-9 shrink-0"
              onClick={handlePasswordChange}
              disabled={isResettingPassword}
            >
              {isResettingPassword ? 'Changing...' : 'Change password'}
            </Button>
          </div>
        </div>

        {/* Security Section */}


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

            {/* Location and Date of Birth Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="location" className="text-sm font-medium mb-2 block text-white">
                  Location
                </Label>
                <Input
                  id="location"
                  value={editFormData.location}
                  onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                  className="w-full text-white placeholder:text-white"
                  placeholder="e.g., bangladesh"
                />
              </div>
              <div>
                <Label htmlFor="dateOfBirth" className="text-sm font-medium mb-2 block text-white">
                  Date of Birth
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full bg-[#1C2936] text-white hover:text-white hover:bg-[#1C2936] justify-start text-left font-normal",
                        !editFormData.dateOfBirth && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {editFormData.dateOfBirth ? (
                        format(
                          editFormData.dateOfBirth instanceof Date
                            ? editFormData.dateOfBirth
                            : new Date(editFormData.dateOfBirth),
                          "PPP"
                        )
                      ) : (
                        <span className='text-white'>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 text-white" align="start">
                    <Calendar
                      mode="single"
                      selected={
                        editFormData.dateOfBirth
                          ? (editFormData.dateOfBirth instanceof Date
                            ? editFormData.dateOfBirth
                            : new Date(editFormData.dateOfBirth))
                          : undefined
                      }
                      onSelect={(date) =>
                        setEditFormData({ ...editFormData, dateOfBirth: date || '' })
                      }
                      initialFocus
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      className="p-3 pointer-events-auto text-black"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
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