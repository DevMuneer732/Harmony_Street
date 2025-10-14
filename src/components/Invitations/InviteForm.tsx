import React, { useState, ChangeEvent } from 'react';
import { Send } from 'lucide-react';
import MultiSelectInput from './MultiSelectInput'; // Import the new component

// Define Types
type Platform = "ios" | "android";

const InviteForm: React.FC = () => {
    const [emailsToInvite, setEmailsToInvite] = useState<string[]>([]);
    const [platform, setPlatform] = useState<Platform>("ios");
    const [message, setMessage] = useState<string>("");

    const handleSendInvitations = () => {
        if (emailsToInvite.length === 0) {
            alert("Please add at least one email to send invitations.");
            return;
        }

        // --- API CALL HERE ---
        console.log("--- Sending Invitations ---");
        console.log(`To: ${emailsToInvite.join(', ')}`);
        console.log(`Platform: ${platform}`);
        console.log(`Message: ${message || 'None'}`);
        // Example: axios.post('/api/invite', { emails: emailsToInvite, platform, message });
        // --- END API CALL ---

        // alert(`Invitations for ${platform.toUpperCase()} sent to ${emailsToInvite.length} users!`);

        // Reset state
        setEmailsToInvite([]);
        setPlatform('ios');
        setMessage("");
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Invite New & Existing Users</h2>

            <div className="space-y-4">

                {/* 1. Multi-Select Input Component */}
                <MultiSelectInput
                    allUsers={[]} 
                    selectedEmails={emailsToInvite}
                    onEmailsChange={setEmailsToInvite} // Pass the setter to update state
                />

                {/* 2. Platform Selection */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Select Platform
                    </label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="platform"
                                value="ios"
                                checked={platform === 'ios'}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setPlatform(e.target.value as Platform)}
                                className="text-indigo-600"
                            />
                            <span className="text-slate-700">iOS (TestFlight)</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="platform"
                                value="android"
                                checked={platform === 'android'}
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setPlatform(e.target.value as Platform)}
                                className="text-indigo-600"
                            />
                            <span className="text-slate-700">Android (APK)</span>
                        </label>
                    </div>
                </div>

                {/* 3. Optional Message */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Personal Message (Optional)
                    </label>
                    <textarea
                        rows={3}
                        placeholder="Add a personal note to the invitation..."
                        value={message}
                        onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    />
                </div>

                {/* 4. Send Button */}
                <button
                    onClick={handleSendInvitations}
                    disabled={emailsToInvite.length === 0}
                    className={`w-full text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${emailsToInvite.length > 0
                            ? 'bg-indigo-600 hover:bg-indigo-700'
                            : 'bg-indigo-300 cursor-not-allowed'
                        }`}
                >
                    <Send size={18} />
                    Send Invitation ({emailsToInvite.length})
                </button>
            </div>
        </div>
    );
};

export default InviteForm;