import { useState } from "react";
import type { User } from "../../models/User";
import Loading from "../../components/Loading";
import { ConfirmDialog } from "../../components/Confirm/Confirm";

/* ───────────────────── StatCard ───────────────────── */

interface StatCardProps {
  label: string;
  value: number | undefined;
}

export function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
    </div>
  );
}

/* ───────────────────── Avatar ───────────────────── */

interface AvatarProps {
  firstName?: string;
  lastName?: string;
}

function Avatar({ firstName, lastName }: AvatarProps) {
  const initials = (
    (firstName?.[0] ?? "?") +
    (lastName?.[0] ?? "?")
  ).toUpperCase();

  return <span className="avatar">{initials}</span>;
}

/* ───────────────────── SubscriptionBadge ───────────────────── */

interface SubscriptionBadgeProps {
  isPaid: boolean;
}

function SubscriptionBadge({ isPaid }: SubscriptionBadgeProps) {
 return (
    <span className={`sub-badge ${isPaid ? "sub-yes" : "sub-no"}`}>
      <span className="sub-icon">{isPaid ? "✓" : "✕"}</span>
      {isPaid ? "Yes" : "No"}
    </span>
  );
}

/* ───────────────────── BanToggle ───────────────────── */

interface BanToggleProps {
  userId: string;
  initialBan: boolean;
  onToggle: (userId : string, ban : boolean, setLoading : React.Dispatch<React.SetStateAction<boolean>>, setBan :  React.Dispatch<React.SetStateAction<boolean>>) => void;
}

function BanToggle({
  userId,
  initialBan,
  onToggle,
}: BanToggleProps) {
  const [banned, setBanned] = useState<boolean>(initialBan);
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = () => {
    const newVal = !banned;
    onToggle(userId, newVal , setLoading, setBanned);
  };

  return (
    <div className="toggle-wrap">
      {loading ? (
        <Loading style={{ width: '100%', height: '100%' }} fullPage={false} spinnerSize={20} />
      ) : (
        <>
        <ConfirmDialog
          title="Ban user"
          description="This will restrict the user's access. You can reverse this at any time."
          confirmLabel= {banned ? "User will be active again" : "User will be ban"}
          cancelLabel="Cancel"
          variant="danger"
          onConfirm={handleChange}
        >
          <button className={`toggle-btn ${banned ? "toggled" : ""}`}>
            <div className="toggle-thumb" />
          </button>
        </ConfirmDialog>
          <span className={`ban-label ${banned ? "ban-on" : "ban-off"}`}>
            {banned ? "Banned" : "Active"}
          </span>
        </>
      )}
    </div>
  );
}

/* ───────────────────── UserRow ───────────────────── */

export interface UserRowProps {
  user: User;
  onToggle: (userId : string, ban : boolean, setLoading : React.Dispatch<React.SetStateAction<boolean>>, setBan :  React.Dispatch<React.SetStateAction<boolean>>) => void;
}

export function UserRow({ user, onToggle }: UserRowProps) {
  return (
    <tr>
      <td className="email-cell">{user.email}</td>

      <td>
        <div className="name-cell">
          <Avatar
            firstName={user.firstName}
            lastName={user.lastName}
          />
          {user.firstName} - {user.lastName}
        </div>
      </td>

      <td>
        <SubscriptionBadge isPaid={!!user.subscribe} />
      </td>

      <td>
        <BanToggle
          userId={user.id}
          initialBan={user.ban}
          onToggle={onToggle}
        />
      </td>
    </tr>
  );
}