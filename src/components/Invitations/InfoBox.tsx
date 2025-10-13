import React from 'react';

const InfoBox: React.FC = () => {
    return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">How it works:</h3>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li>Type to search **existing users** and click their name to select them.</li>
                <li>To add a **new user**, type their email (must be correct format) and press **Enter**.</li>
                <li>Selected users/emails appear as chips above the input.</li>
                <li>The system will send a batch of invitations based on the list.</li>
            </ol>
        </div>
    );
};

export default InfoBox;