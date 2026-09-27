"use client";

import * as React from "react";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Download,
  Upload,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  XCircle,
  MoreVertical,
  Trash2,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Guest {
  id: string;
  name: string;
  email: string | null;
  status: "attending" | "pending" | "declined";
  party_size: number;
  meal: string | null;
  dietary: string | null;
  access_code: string;
}

const INITIAL_GUESTS: Guest[] = [
  {
    id: "g-1",
    name: "Eleanor Vance",
    email: "eleanor.vance@example.com",
    status: "attending",
    party_size: 2,
    meal: "Filet Mignon",
    dietary: "None",
    access_code: "EV2027",
  },
  {
    id: "g-2",
    name: "Dr. Montague",
    email: "montague@example.com",
    status: "attending",
    party_size: 1,
    meal: "Wild Mushroom Risotto (V)",
    dietary: "Vegetarian",
    access_code: "DM9912",
  },
  {
    id: "g-3",
    name: "Luke Sanderson",
    email: "luke.s@example.com",
    status: "pending",
    party_size: 1,
    meal: null,
    dietary: null,
    access_code: "LS4401",
  },
  {
    id: "g-4",
    name: "Theodora Crain",
    email: "theo.crain@example.com",
    status: "attending",
    party_size: 2,
    meal: "Pan-Seared Sea Bass",
    dietary: "Gluten-Free",
    access_code: "TC8823",
  },
  {
    id: "g-5",
    name: "Arthur Parker",
    email: "arthur.p@example.com",
    status: "declined",
    party_size: 1,
    meal: null,
    dietary: null,
    access_code: "AP1209",
  },
];

export default function GuestsPage() {
  const [guests, setGuests] = React.useState<Guest[]>(INITIAL_GUESTS);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  // New guest modal state
  const [isAdding, setIsAdding] = React.useState(false);
  const [newName, setNewName] = React.useState("");
  const [newEmail, setNewEmail] = React.useState("");
  const [newPartySize, setNewPartySize] = React.useState(1);

  const filteredGuests = guests.filter((g) => {
    const matchesSearch =
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (g.email && g.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      g.access_code.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ? true : g.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const attendingCount = guests.filter((g) => g.status === "attending").length;
  const pendingCount = guests.filter((g) => g.status === "pending").length;
  const declinedCount = guests.filter((g) => g.status === "declined").length;
  const totalSeats = guests.reduce(
    (sum, g) => (g.status === "attending" ? sum + g.party_size : sum),
    0
  );

  const handleCopyInvite = (guest: Guest) => {
    const inviteUrl = `${window.location.origin}/wedding/sarah-and-james/rsvp?code=${guest.access_code}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopiedId(guest.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;

    const newGuest: Guest = {
      id: `g-${Date.now()}`,
      name: newName,
      email: newEmail || null,
      status: "pending",
      party_size: Number(newPartySize),
      meal: null,
      dietary: null,
      access_code: Math.random().toString(36).substring(2, 8).toUpperCase(),
    };

    setGuests([newGuest, ...guests]);
    setNewName("");
    setNewEmail("");
    setNewPartySize(1);
    setIsAdding(false);
  };

  const handleDeleteGuest = (id: string) => {
    setGuests(guests.filter((g) => g.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-neutral-dark">
            Guest List & RSVPs
          </h1>
          <p className="mt-1 text-sm text-neutral-mid">
            Manage your invitations, track attendance, and record meal preferences.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              const csv =
                "Name,Email,Status,Party Size,Meal,Dietary,Code\n" +
                guests
                  .map(
                    (g) =>
                      `"${g.name}","${g.email || ""}","${g.status}",${g.party_size},"${g.meal || ""}","${g.dietary || ""}","${g.access_code}"`
                  )
                  .join("\n");
              const blob = new Blob([csv], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "everafter-guestlist.csv";
              a.click();
            }}
          >
            <Download className="mr-1.5 h-4 w-4" />
            Export CSV
          </Button>

          <Button size="sm" onClick={() => setIsAdding(true)}>
            <UserPlus className="mr-1.5 h-4 w-4" />
            Add Guest
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-white p-5 shadow-soft-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-mid">
            Total Invited
          </p>
          <p className="mt-2 font-display text-3xl font-bold text-neutral-dark">
            {guests.length}
          </p>
          <p className="text-xs text-neutral-mid mt-1">invitations issued</p>
        </div>

        <div className="rounded-xl border border-border bg-white p-5 shadow-soft-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-green-700">
            Attending Seats
          </p>
          <p className="mt-2 font-display text-3xl font-bold text-green-600">
            {totalSeats}
          </p>
          <p className="text-xs text-neutral-mid mt-1">{attendingCount} parties confirmed</p>
        </div>

        <div className="rounded-xl border border-border bg-white p-5 shadow-soft-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
            Awaiting Reply
          </p>
          <p className="mt-2 font-display text-3xl font-bold text-amber-600">
            {pendingCount}
          </p>
          <p className="text-xs text-neutral-mid mt-1">no response yet</p>
        </div>

        <div className="rounded-xl border border-border bg-white p-5 shadow-soft-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-neutral-mid">
            Declined
          </p>
          <p className="mt-2 font-display text-3xl font-bold text-neutral-dark">
            {declinedCount}
          </p>
          <p className="text-xs text-neutral-mid mt-1">unable to attend</p>
        </div>
      </div>

      {/* Add Guest Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-soft-xl border border-border">
            <h2 className="font-display text-xl font-bold text-neutral-dark mb-4">
              Add Wedding Guest
            </h2>
            <form onSubmit={handleAddGuest} className="space-y-4 text-sm">
              <div>
                <label className="block font-medium text-neutral-dark mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Charlotte Lucas"
                  className="w-full rounded-lg border border-border px-3.5 py-2 text-sm focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-neutral-dark mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="charlotte@example.com"
                  className="w-full rounded-lg border border-border px-3.5 py-2 text-sm focus:border-primary focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-neutral-dark mb-1">
                  Party Size (Plus-ones included)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={newPartySize}
                  onChange={(e) => setNewPartySize(Number(e.target.value))}
                  className="w-full rounded-lg border border-border px-3.5 py-2 text-sm focus:border-primary focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsAdding(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Add to List</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-border shadow-soft-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-neutral-mid" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or code..."
            className="w-full rounded-lg border border-border pl-9 pr-3.5 py-2 text-sm focus:border-primary focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-neutral-mid shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-border px-3 py-2 text-sm bg-white focus:border-primary focus:outline-none w-full sm:w-auto"
          >
            <option value="all">All RSVP Statuses</option>
            <option value="attending">Attending</option>
            <option value="pending">Awaiting Reply</option>
            <option value="declined">Declined</option>
          </select>
        </div>
      </div>

      {/* Guest Table */}
      <div className="rounded-xl border border-border bg-white shadow-soft-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-dark">
            <thead className="bg-neutral-light/60 text-xs uppercase font-medium text-neutral-mid border-b border-border">
              <tr>
                <th className="px-6 py-3.5">Guest Name</th>
                <th className="px-6 py-3.5">RSVP Status</th>
                <th className="px-6 py-3.5">Seats</th>
                <th className="px-6 py-3.5">Meal / Dietary</th>
                <th className="px-6 py-3.5">Invite Code</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-neutral-mid">
                    No guests found matching your filter.
                  </td>
                </tr>
              ) : (
                filteredGuests.map((guest) => (
                  <tr key={guest.id} className="hover:bg-neutral-light/40 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-neutral-dark">{guest.name}</div>
                      {guest.email && (
                        <div className="text-xs text-neutral-mid">{guest.email}</div>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          guest.status === "attending"
                            ? "bg-green-50 text-green-700 ring-1 ring-green-200"
                            : guest.status === "pending"
                            ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
                            : "bg-neutral-100 text-neutral-600 ring-1 ring-neutral-200"
                        }`}
                      >
                        {guest.status === "attending" && <CheckCircle2 className="h-3 w-3" />}
                        {guest.status === "pending" && <Clock className="h-3 w-3" />}
                        {guest.status === "declined" && <XCircle className="h-3 w-3" />}
                        <span className="capitalize">{guest.status}</span>
                      </span>
                    </td>

                    <td className="px-6 py-4 text-xs font-medium">
                      {guest.party_size} {guest.party_size === 1 ? "seat" : "seats"}
                    </td>

                    <td className="px-6 py-4 text-xs">
                      {guest.meal ? (
                        <div>
                          <div className="font-medium text-neutral-dark">{guest.meal}</div>
                          {guest.dietary && guest.dietary !== "None" && (
                            <div className="text-primary-dark font-medium">{guest.dietary}</div>
                          )}
                        </div>
                      ) : (
                        <span className="text-neutral-400 italic">Not selected</span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs bg-neutral-100 px-2 py-0.5 rounded border border-border text-neutral-700">
                          {guest.access_code}
                        </span>
                        <button
                          onClick={() => handleCopyInvite(guest)}
                          className="p-1 text-neutral-mid hover:text-neutral-dark transition-colors"
                          title="Copy personalized RSVP link"
                        >
                          {copiedId === guest.id ? (
                            <Check className="h-3.5 w-3.5 text-green-600" />
                          ) : (
                            <Copy className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDeleteGuest(guest.id)}
                        className="p-1 text-neutral-mid hover:text-red-600 transition-colors"
                        title="Remove guest"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
