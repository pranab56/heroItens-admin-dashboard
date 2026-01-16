"use client";

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Minus, Plus } from 'lucide-react';
import { useState } from 'react';

export default function GlobalSystemSettings() {
  const [platformName, setPlatformName] = useState('My Garage');
  const [timezone, setTimezone] = useState('UTC-5:00 Eastern Time (US & Canada)');
  const [votingEnabled, setVotingEnabled] = useState(true);
  const [voteLimit, setVoteLimit] = useState(5);

  const incrementVoteLimit = () => {
    setVoteLimit(prev => prev + 1);
  };

  const decrementVoteLimit = () => {
    setVoteLimit(prev => Math.max(1, prev - 1));
  };

  return (
    <div className=" text-white p-6">


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
                className="bg-[#0f1419] border-[#2a3744] text-white h-12 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* System Timezone */}
            <div>
              <label className="block text-sm text-gray-300 mb-2">System Timezone</label>
              <Input
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="bg-[#0f1419] border-[#2a3744] text-white h-12 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Voting Rules & Limits Section */}
        <div className="mb-8">
          <h2 className="text-xl font-medium mb-6">Voting Rules & Limits</h2>

          {/* Enable Global Voting */}
          <div className="flex items-center justify-between mb-8 pb-8 border-b border-[#2a3744]">
            <div>
              <h3 className="text-base font-medium mb-1">Enable Global Voting</h3>
              <p className="text-sm text-gray-400">
                Allow users to vote on vehicle builds and community challenges.
              </p>
            </div>
            <Switch
              checked={votingEnabled}
              onCheckedChange={setVotingEnabled}
              className="data-[state=checked]:bg-blue-600"
            />
          </div>

          {/* Daily Vote Limit */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-medium mb-1">Daily Vote Limit per User</h3>
              <p className="text-sm text-gray-400">
                Maximum number of votes a single user can cast within 24 hours.
              </p>
            </div>

            {/* Counter */}
            <div className="flex items-center gap-3 bg-[#0f1419] border border-[#2a3744] rounded-lg px-4 py-2">
              <button
                onClick={decrementVoteLimit}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Minus className="w-5 h-5" />
              </button>
              <span className="text-2xl font-semibold w-12 text-center">{voteLimit}</span>
              <button
                onClick={incrementVoteLimit}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-6">
          <Button
            variant="outline"
            className="bg-[#3a2832] border-[#3a2832] text-red-400 hover:bg-[#4a3842] hover:text-red-300 px-8 h-11"
          >
            Cancel
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 h-11">
            <Plus className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}