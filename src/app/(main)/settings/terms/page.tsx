"use client";

import { useEffect, useState } from "react";
import TipTapEditor from '../../../../TipTapEditor/TipTapEditor';

import toast from 'react-hot-toast';
import { useGetTermsAndConditionsQuery, useUpdateTermsAndConditionsMutation } from '../../../../features/settings/settingsApi';
import { CustomLoading } from '../../../../hooks/CustomLoading';

// Main Policy Component
function PolicyEditor() {
  const [termsContent, setTermsContent] = useState("");
  const [initialContentLoaded, setInitialContentLoaded] = useState(false);

  const { data: termsPolicy, isLoading: isTermsPolicyLoading, refetch } = useGetTermsAndConditionsQuery({});
  const [updateTermsPolicy, { isLoading: isUpdateTermsPolicyLoading }] = useUpdateTermsAndConditionsMutation();

  // Load initial data from API
  useEffect(() => {
    if (termsPolicy?.data?.description && !initialContentLoaded) {
      setTermsContent(termsPolicy.data.description);
      setInitialContentLoaded(true);
    }
  }, [termsPolicy, initialContentLoaded]);

  const handleContentChange = (content: string) => {
    setTermsContent(content);
  };

  const handleSave = async () => {
    console.log("Saving policy content:", termsContent);
    try {
      const response = await updateTermsPolicy({
        description: termsContent
      }).unwrap();
      toast.success(response?.message || "Terms policy updated successfully");
      // Refetch to get updated data
      refetch();
    } catch (error: any) {
      console.error('Error updating terms policy:', error);
      toast.error(error?.data?.message || "Failed to update terms policy");
    }
  };

  const handleCancel = () => {
    // Reset to original value from API
    if (termsPolicy?.data?.description) {
      setTermsContent(termsPolicy.data.description);
      toast.error("Changes cancelled");
    }
  };

  // Show loading state
  if (isTermsPolicyLoading && !initialContentLoaded) {
    return <CustomLoading />
  }

  return (
    <div className="text-white p-4 sm:p-6 pb-12">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Change Terms & Conditions</h1>
          <p className="text-gray-400 text-sm md:text-base">Write and Update Terms & Conditions</p>
        </div>

        {/* Editor Card */}
        <div className="bg-[#1C2936] rounded-lg p-4 sm:p-6 space-y-6">
          <div className="min-h-[400px]">
            <TipTapEditor
              handleJobDescription={handleContentChange}
              description={termsContent}
              minHeight="400px"
              maxHeight="600px"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
            <button
              onClick={handleCancel}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#2a3f54] cursor-pointer hover:bg-[#364b63] text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isUpdateTermsPolicyLoading}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-[#3b82f6] cursor-pointer hover:bg-[#2563eb] text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdateTermsPolicyLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PolicyEditor;