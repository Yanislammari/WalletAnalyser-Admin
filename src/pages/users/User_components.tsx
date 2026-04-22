import { useState } from "react";
import type { User } from "../../models/User";

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
  onToggle: (userId: string, value: boolean) => void;
}

function BanToggle({
  userId,
  initialBan,
  onToggle,
}: BanToggleProps) {
  const [banned, setBanned] = useState<boolean>(initialBan);

  const handleChange = () => {
    const newVal = !banned;
    setBanned(newVal);
    onToggle(userId, newVal);
  };

  return (
    <div className="toggle-wrap">
        <button
          onClick={() => handleChange()}
          className={`toggle-btn ${banned ? "toggled" : ""}`}
        >
          <div className="toggle-thumb" /> 
        </button>

      <span className={`ban-label ${banned ? "ban-on" : "ban-off"}`}>
        {banned ? "Banned" : "Active"}
      </span>
    </div>
  );
}

/* ───────────────────── UserRow ───────────────────── */

export interface UserRowProps {
  user: User;
  onToggle: (userId: string, value: boolean) => void;
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