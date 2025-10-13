import React, { useState, useMemo, ChangeEvent, KeyboardEvent, MouseEvent } from 'react';
import { X, User as UserIcon } from 'lucide-react';

// Define Types
interface User {
    id: number;
    name: string;
    email: string;
}

interface MultiSelectInputProps {
    allUsers: User[]; // The complete list of users
    selectedEmails: string[];
    onEmailsChange: (emails: string[]) => void;
}

const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// --- MOCK DATA (Using the same mock data as before) ---
const MOCK_USERS: User[] = [
    { id: 1, name: "Alice Johnson", email: "alice.j@example.com" },
    { id: 2, name: "Bob Smith", email: "bob.s@example.com" },
    { id: 3, name: "Charlie Brown", email: "charlie.b@example.com" },
    { id: 4, name: "Diana Prince", email: "diana.p@example.com" },
    { id: 5, name: "Ethan Hunt", email: "ethan.h@example.com" },
    { id: 6, name: "Fiona Glenn", email: "fiona.g@example.com" },
];
// --------------------------------------------------------

const MultiSelectInput: React.FC<MultiSelectInputProps> = ({ selectedEmails, onEmailsChange }) => {
    const [currentInput, setCurrentInput] = useState<string>("");
    const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

    // Helper to check if an email is an existing user
    const isExistingUser = (email: string): boolean => MOCK_USERS.some(user => user.email === email);

    // Filtering Logic: Show all unselected users when input is focused, or filter based on input
    const filteredUsers = useMemo((): User[] => {
        // 1. Get all users whose emails are NOT in the selectedEmails list
        const unselectedUsers = MOCK_USERS.filter(user =>
            !selectedEmails.includes(user.email)
        );

        if (!currentInput) {
            // If the input is empty, return ALL unselected users
            return unselectedUsers;
        }

        const searchLower = currentInput.toLowerCase();

        // If there's input, filter the unselected users by name or email
        return unselectedUsers.filter(user =>
            user.name.toLowerCase().includes(searchLower) || user.email.toLowerCase().includes(searchLower)
        );
    }, [currentInput, selectedEmails]);


    // Handler for new manual email input (on 'Enter' key press)
    const handleAddManualEmail = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== 'Enter') return;

        e.preventDefault();

        const trimmedEmail = currentInput.trim().toLowerCase();

        if (trimmedEmail && isValidEmail(trimmedEmail) && !selectedEmails.includes(trimmedEmail)) {
            onEmailsChange([...selectedEmails, trimmedEmail]);
            setCurrentInput("");
            setShowSuggestions(false);
        } else if (trimmedEmail && !isValidEmail(trimmedEmail)) {
            alert(`"${trimmedEmail}" is not a valid email address. Please use the format: user@domain.com`);
        }
    };

    // Handler for selecting an existing user
    const handleAddExistingUser = (email: string) => {
        if (!selectedEmails.includes(email)) {
            onEmailsChange([...selectedEmails, email]);
        }
        setCurrentInput("");
        setShowSuggestions(false);
    };

    // Handler for removing any email
    const handleRemoveEmail = (emailToRemove: string) => {
        onEmailsChange(selectedEmails.filter(email => email !== emailToRemove));
    };


    return (
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
                User Emails or Search Existing Users
            </label>

            {/* Display Added Emails (Chips) */}
            {selectedEmails.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3 p-2 border border-slate-300 rounded-lg min-h-[44px]">
                    {selectedEmails.map(email => (
                        <span
                            key={email}
                            className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full ${isExistingUser(email)
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-indigo-100 text-indigo-800'
                                }`}
                        >
                            {email}
                            <button
                                type="button"
                                onClick={() => handleRemoveEmail(email)}
                                className={`ml-1.5 p-0.5 rounded-full transition-colors ${isExistingUser(email) ? 'hover:bg-green-200' : 'hover:bg-indigo-200'
                                    }`}
                            >
                                <X size={12} />
                            </button>
                        </span>
                    ))}
                </div>
            )}

            {/* Input field for manual typing/searching */}
            <div className="relative">
                <input
                    type="text"
                    placeholder="Click or type to select users, or enter a new email..."
                    value={currentInput}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setCurrentInput(e.target.value);
                        setShowSuggestions(true);
                    }}
                    onKeyDown={handleAddManualEmail}
                    onFocus={() => setShowSuggestions(true)}
                    // Use a slight delay on blur to allow clicking the suggestion list
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />

                {/* Suggestions Dropdown List */}
                {showSuggestions && filteredUsers.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-slate-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {filteredUsers.map(user => (
                            <div
                                key={user.id}
                                onMouseDown={(e: MouseEvent) => {
                                    e.preventDefault();
                                    handleAddExistingUser(user.email);
                                }}
                                className="flex items-center gap-3 p-3 cursor-pointer hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0"
                            >
                                <UserIcon size={16} className="text-green-500" />
                                <div>
                                    <p className="font-medium text-slate-800">{user.name}</p>
                                    <p className="text-sm text-slate-500">{user.email}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {/* Optional: Show a message if all users are selected and input is focused */}
                {showSuggestions && currentInput === "" && filteredUsers.length === 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-slate-300 rounded-lg shadow-lg p-3 text-slate-500 text-sm">
                        All available users have been selected.
                    </div>
                )}
            </div>
            <p className="text-xs text-slate-500 mt-1">
                **Tip:** Click the input to see all available users, or type to filter the list/enter a new email.
            </p>
        </div>
    );
};

export default MultiSelectInput;