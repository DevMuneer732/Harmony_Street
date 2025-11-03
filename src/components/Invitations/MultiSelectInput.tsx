import React, { useState, useMemo, ChangeEvent, KeyboardEvent, MouseEvent } from "react";
import { X, User as UserIcon, AlertTriangle } from "lucide-react";

interface User {
  id: string | number;
  name: string;
  email: string;
}

interface MultiSelectInputProps {
  allUsers: User[];
  selectedEmails: string[];
  onEmailsChange: (emails: string[]) => void;
}

const isValidEmail = (email: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const MAX_INVITES = 10;

const MultiSelectInput: React.FC<MultiSelectInputProps> = ({
  allUsers,
  selectedEmails,
  onEmailsChange,
}) => {
  const [currentInput, setCurrentInput] = useState<string>("");
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [limitMsg, setLimitMsg] = useState<string>("");

  const isExistingUser = (email: string) =>
    (allUsers || []).some((u) => u.email === email);

  // Only show users that are not already selected
  const filteredUsers = useMemo<User[]>(() => {
    const unselected = (allUsers || []).filter(
      (u) => !selectedEmails.includes(u.email)
    );

    if (!currentInput.trim()) return unselected;

    const q = currentInput.toLowerCase();
    return unselected.filter(
      (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  }, [allUsers, selectedEmails, currentInput]);

  /** Safely push an email, enforcing the 10-user cap */
  const pushEmail = (email: string) => {
    if (selectedEmails.length >= MAX_INVITES) {
      setLimitMsg(`You can only invite up to ${MAX_INVITES} users at a time.`);
      return false;
    }
    if (!selectedEmails.includes(email)) {
      onEmailsChange([...selectedEmails, email]);
    }
    setLimitMsg(""); // clear any previous warning
    return true;
  };

  const handleAddManualEmail = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    e.preventDefault();

    const email = currentInput.trim().toLowerCase();
    if (!email) return;

    if (!isValidEmail(email)) {
      setLimitMsg(`"${email}" is not a valid email address (use user@domain.com).`);
      return;
    }

    if (pushEmail(email)) {
      setCurrentInput("");
      setShowSuggestions(false);
    }
  };

  const handleAddExistingUser = (email: string) => {
    if (pushEmail(email)) {
      setCurrentInput("");
      setShowSuggestions(false);
    }
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    const next = selectedEmails.filter((e) => e !== emailToRemove);
    onEmailsChange(next);
    if (next.length < MAX_INVITES) setLimitMsg("");
  };

  const atLimit = selectedEmails.length >= MAX_INVITES;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-slate-700">
          User Emails or Search Existing Users
        </label>
        <span
          className={`text-xs font-medium ${
            atLimit ? "text-red-600" : "text-slate-500"
          }`}
        >
          {selectedEmails.length}/{MAX_INVITES}
        </span>
      </div>

      {selectedEmails.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3 p-2 border border-slate-300 rounded-lg min-h-[44px]">
          {selectedEmails.map((email) => (
            <span
              key={email}
              className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full ${
                isExistingUser(email)
                  ? "bg-green-100 text-green-800"
                  : "bg-indigo-100 text-indigo-800"
              }`}
            >
              {email}
              <button
                type="button"
                onClick={() => handleRemoveEmail(email)}
                className={`ml-1.5 p-0.5 rounded-full transition-colors ${
                  isExistingUser(email) ? "hover:bg-green-200" : "hover:bg-indigo-200"
                }`}
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="relative">
        <input
          type="text"
          placeholder={
            atLimit
              ? `Invite limit reached (${MAX_INVITES}). Remove one to add more.`
              : "Click or type to select users, or enter a new email…"
          }
          value={currentInput}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setCurrentInput(e.target.value);
            setShowSuggestions(true);
            if (!atLimit) setLimitMsg("");
          }}
          onKeyDown={handleAddManualEmail}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          disabled={atLimit} // block typing when at cap
          className={`w-full px-4 py-2 border rounded-lg outline-none ${
            atLimit
              ? "bg-slate-100 cursor-not-allowed border-slate-300 text-slate-500"
              : "border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          }`}
        />

        {showSuggestions && filteredUsers.length > 0 && !atLimit && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-slate-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {filteredUsers.map((u) => (
              <div
                key={u.id}
                onMouseDown={(e: MouseEvent) => {
                  e.preventDefault();
                  handleAddExistingUser(u.email);
                }}
                className="flex items-center gap-3 p-3 cursor-pointer hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0"
              >
                <UserIcon size={16} className="text-green-500" />
                <div>
                  <p className="font-medium text-slate-800">{u.name}</p>
                  <p className="text-sm text-slate-500">{u.email}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {showSuggestions && !currentInput && filteredUsers.length === 0 && !atLimit && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-slate-300 rounded-lg shadow-lg p-3 text-slate-500 text-sm">
            All available users have been selected.
          </div>
        )}
      </div>

      {/* Guidance + hard-cap message */}
      <div className="mt-2 space-y-1">
        <p className="text-xs text-slate-500">
          You can send invites to <strong>up to {MAX_INVITES} users</strong> at a time.
        </p>
        {limitMsg && (
          <p className="text-xs text-red-600 flex items-center gap-1">
            <AlertTriangle size={14} /> {limitMsg}
          </p>
        )}
      </div>
    </div>
  );
};

export default MultiSelectInput;
