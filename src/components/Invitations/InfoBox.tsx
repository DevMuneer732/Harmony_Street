import React from "react";

type InfoBoxProps = {
  /** Optional override if you ever change the cap */
  maxInvites?: number;
};

const InfoBox: React.FC<InfoBoxProps> = ({ maxInvites = 10 }) => {
  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
      <h3 className="mb-2 font-semibold text-blue-900">How invites work</h3>

      <ol className="list-inside list-decimal space-y-1 text-sm text-blue-800">
        <li>
          Click the input to see all available users, or start typing to{" "}
          <span className="font-medium">filter and select existing users</span>.
        </li>
        <li>
          To add a <span className="font-medium">new user</span>, type a valid
          email (e.g. <code>user@domain.com</code>) and press{" "}
          <span className="font-medium">Enter</span>.
        </li>
        <li>
          Selected items appear as chips above the input:
          <span className="ml-2 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
            existing
          </span>
          <span className="ml-1 inline-flex items-center rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-800">
            new email
          </span>
          . Click the <span className="font-medium">×</span> to remove any chip.
        </li>
        <li>
          You can invite up to{" "}
          <span className="font-medium">{maxInvites} users</span> at a time. A
          counter (e.g. <code>3/{maxInvites}</code>) shows your current total.
          When you hit the limit, the input is temporarily disabled and a
          warning appears until you remove one.
        </li>
        <li>
          The <span className="font-medium">Send Invitation</span> button is
          enabled only when you have between 1 and {maxInvites} recipients and
          shows the number selected (e.g. <code>Send Invitation (3/10)</code>).
        </li>
      </ol>
    </div>
  );
};

export default InfoBox;
