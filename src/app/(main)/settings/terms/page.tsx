"use client";

import { useState } from "react";
import TipTapEditor from '../../../../TipTapEditor/TipTapEditor';





// Main Policy Component
function PolicyEditor() {
  const [termsContent, setTermsContent] = useState(
    "Lorem ipsum dolor sit amet consectetur. Fringilla a cras vitae orci. Egestas duis id nisl sed ante congue scelerisque. Eleifend facilisis aliquet tempus morbi leo sagittis. Pellentesque odio amet turpis habitant. Imperdiet tincidunt nisl consectetur hendrerit accumsan vehicula imperdiet mattis. Neque a vitae diam pharetra duis habitasse convallis luctus pulvinar. Pharetra nunc morbi elementum nisl magnis convallis arcu enim tortor. Cursus a sed tortor enim mi imperdiet massa donec mauris. Sem morbi morbi posuere faucibus. Cras risus ultrices duis pharetra sit porttitor elementum sagittis elementum. Ut vitae blandit pulvinar fermentum in id sed. At pellentesque non semper eget egestas vulputate id volutpat quis. Dolor etiam sodales at elementum mattis nibh quam placerat ut. Suspendisse est adipiscing proin et. Leo nisi bibendum donec ac non eget euismod suscipit. At ultricies nullam ipsum tellus. Non dictum orci at tortor convallis tortor suspendisse. Ac duis senectus arcu nullam in suspendisse vitae. Tellus interdum enim lorem vel morbi lectus."
  );

  const handleContentChange = (content: string) => {
    setTermsContent(content);
  };

  const handleSave = () => {
    console.log("Saving policy content:", termsContent);
    alert("Changes saved successfully!");
  };

  return (
    <div className=" text-white p-6">
      <div className="space-y-6">


        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-white">Change Terms & Conditions</h1>
          <p className="text-gray-400">Write and Update Terms & Conditions</p>
        </div>

        {/* Editor Card */}
        <div className="bg-[#1C2936] rounded-lg p-6 space-y-6">
          <TipTapEditor
            handleJobDescription={handleContentChange}
            resetTrigger={false}
            description={termsContent}
            minHeight="400px"
            maxHeight="600px"
          />

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              className="px-6 py-2.5 rounded-lg bg-[#2a3f54] hover:bg-[#364b63] text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 rounded-lg bg-[#3b82f6] hover:bg-[#2563eb] text-white transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PolicyEditor;