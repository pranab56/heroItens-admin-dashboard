"use client";

import { useEffect, useState } from "react";
import toast from 'react-hot-toast';
import TipTapEditor from '../../../../TipTapEditor/TipTapEditor';
import { useGetPrivacyPolicyQuery, useUpdatePrivacyPolicyMutation } from '../../../../features/settings/settingsApi';

// Main Policy Component
function PolicyEditor() {
  const [policyContent, setPolicyContent] = useState("");
  const [initialContentLoaded, setInitialContentLoaded] = useState(false);

  const [updatePrivacyPolicy, { isLoading: isUpdatePrivacyPolicyLoading }] = useUpdatePrivacyPolicyMutation();
  const { data: privacyPolicy, isLoading: isPrivacyPolicyLoading, refetch } = useGetPrivacyPolicyQuery({});

  // Load initial data from API
  useEffect(() => {
    if (privacyPolicy?.data?.description && !initialContentLoaded) {
      setPolicyContent(privacyPolicy.data.description);
      setInitialContentLoaded(true);
    }
  }, [privacyPolicy, initialContentLoaded]);

  const handleContentChange = (content: string) => {
    setPolicyContent(content);
  };

  const handleSave = async () => {
    console.log("Saving policy content:", policyContent);
    try {
      const response = await updatePrivacyPolicy({
        description: policyContent
      }).unwrap();
      toast.success(response?.message || "Privacy policy updated successfully");
      // Refetch to get updated data
      refetch();
    } catch (error: any) {
      console.error('Error updating privacy policy:', error);
      toast.error(error?.data?.message || "Failed to update privacy policy");
    }
  };

  const handleCancel = () => {
    // Reset to original value from API
    if (privacyPolicy?.data?.description) {
      setPolicyContent(privacyPolicy.data.description);
      toast.error("Changes cancelled");
    }
  };

  // Show loading state
  if (isPrivacyPolicyLoading && !initialContentLoaded) {
    return (
      <div className="text-white p-6 flex justify-center items-center min-h-[400px]">
        <div className="text-gray-400">Loading privacy policy...</div>
      </div>
    );
  }

  return (
    <div className="text-white p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white">Change Privacy Policy</h1>
          <p className="text-gray-400">Write and Update Privacy Policy</p>
        </div>

        {/* Editor Card */}
        <div className="bg-[#1C2936] rounded-lg p-6 space-y-6">
          <TipTapEditor
            handleJobDescription={handleContentChange}
            description={policyContent}
            minHeight="400px"
            maxHeight="600px"
          />

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={handleCancel}
              className="px-6 py-2.5 rounded-lg bg-[#2a3f54] cursor-pointer hover:bg-[#364b63] text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isUpdatePrivacyPolicyLoading}
              className="px-6 py-2.5 rounded-lg bg-[#3b82f6] cursor-pointer hover:bg-[#2563eb] text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdatePrivacyPolicyLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PolicyEditor;