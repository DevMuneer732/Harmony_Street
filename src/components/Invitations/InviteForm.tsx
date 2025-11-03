"use client";

import React, { useMemo, useState } from "react";
import { Send } from "lucide-react";
import MultiSelectInput from "./MultiSelectInput";

import useUsersStore from "@/store/getUsersStore";
import useSendInviteStore from "@/store/sendInviteStore";

// optional: if you want a platform selector later
type Platform = "ios" | "android";
const MAX_INVITES = 10;
const InviteForm: React.FC = () => {
  const { users: apiUsers } = useUsersStore();
  const { sendInvites, isLoading, lastSuccess } = useSendInviteStore();

  const [emailsToInvite, setEmailsToInvite] = useState<string[]>([]);
  const [platform, setPlatform] = useState<Platform>("ios"); // not used by API now
  const [message, setMessage] = useState<string>("");        // not used by API now

  // Map your API users to {id, name, email} for suggestions
  const allUsers = useMemo(
    () =>
      (Array.isArray(apiUsers) ? apiUsers : []).map((u: any) => ({
        id: u?._id || u?.id || u?.email,
        name:
          u?.fullName ||
          [u?.firstName, u?.lastName].filter(Boolean).join(" ") ||
          u?.name ||
          u?.email ||
          "User",
        email: u?.email,
      })),
    [apiUsers]
  );

const handleSendInvitations = async () => {
  if (emailsToInvite.length === 0) {
    alert("Please add at least one email to send invitations.");
    return;
  }
  if (emailsToInvite.length > MAX_INVITES) {
    alert(`You can only invite up to ${MAX_INVITES} users at a time.`);
    return;
  }
  const ok = await sendInvites(emailsToInvite);
  if (ok) {
    setEmailsToInvite([]);
    setPlatform("ios");
    setMessage("");
  }
};

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">
        Invite New & Existing Users
      </h2>

      <div className="space-y-4">
        {/* 1) Multi-Select (uses real users list for suggestions) */}
        <MultiSelectInput
          allUsers={allUsers}
          selectedEmails={emailsToInvite}
          onEmailsChange={setEmailsToInvite}
        />

        {/* If you later need platform/message in backend, keep the inputs */}
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value as Platform)}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ios">iOS</option>
            <option value="android">Android</option>
          </select>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Optional message"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500"
          />
        </div> */}

        {/* 4) Send Button */}
      <button
  onClick={handleSendInvitations}
  disabled={emailsToInvite.length === 0 || emailsToInvite.length > MAX_INVITES || isLoading}
  className={`w-full text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
    emailsToInvite.length > 0 &&
    emailsToInvite.length <= MAX_INVITES &&
    !isLoading
      ? "bg-indigo-600 hover:bg-indigo-700"
      : "bg-indigo-300 cursor-not-allowed"
  }`}
>
  <Send size={18} />
  {isLoading ? "Sending…" : `Send Invitation (${emailsToInvite.length}/${MAX_INVITES})`}
</button>

        {lastSuccess === true && (
          <p className="text-sm text-emerald-600">
            Invitations sent successfully.
          </p>
        )}
      </div>
    </div>
  );
};

export default InviteForm;
