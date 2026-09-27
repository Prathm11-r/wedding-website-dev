"use client";

import * as React from "react";
import {
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  Trash2,
  Star,
  Shield,
  Clock,
  Sparkles,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Photo {
  id: string;
  url: string;
  caption: string;
  is_cover: boolean;
  is_approved: boolean;
  uploaded_by: "couple" | "guest";
  uploaded_at: string;
}

const INITIAL_PHOTOS: Photo[] = [
  {
    id: "p-1",
    url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800",
    caption: "Sunset at the vineyard",
    is_cover: true,
    is_approved: true,
    uploaded_by: "couple",
    uploaded_at: "2026-09-20",
  },
  {
    id: "p-2",
    url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=800",
    caption: "Engagement party toast",
    is_cover: false,
    is_approved: true,
    uploaded_by: "couple",
    uploaded_at: "2026-09-21",
  },
  {
    id: "p-3",
    url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80&w=800",
    caption: "Our weekend getaway",
    is_cover: false,
    is_approved: true,
    uploaded_by: "couple",
    uploaded_at: "2026-09-22",
  },
  {
    id: "p-4",
    url: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&q=80&w=800",
    caption: "Laughing during the photoshoot",
    is_cover: false,
    is_approved: false,
    uploaded_by: "guest",
    uploaded_at: "2026-09-26",
  },
];

export default function GalleryPage() {
  const [photos, setPhotos] = React.useState<Photo[]>(INITIAL_PHOTOS);
  const [activeTab, setActiveTab] = React.useState<"all" | "couple" | "guest">("all");
  const [isUploading, setIsUploading] = React.useState(false);

  const filteredPhotos = photos.filter((p) => {
    if (activeTab === "all") return true;
    return p.uploaded_by === activeTab;
  });

  const handleSetCover = (id: string) => {
    setPhotos(
      photos.map((p) => ({
        ...p,
        is_cover: p.id === id,
      }))
    );
  };

  const handleApprove = (id: string) => {
    setPhotos(
      photos.map((p) => (p.id === id ? { ...p, is_approved: true } : p))
    );
  };

  const handleDelete = (id: string) => {
    setPhotos(photos.filter((p) => p.id !== id));
  };

  const handleMockUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      const newPhoto: Photo = {
        id: `p-${Date.now()}`,
        url: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&q=80&w=800",
        caption: "New uploaded memory",
        is_cover: false,
        is_approved: true,
        uploaded_by: "couple",
        uploaded_at: new Date().toISOString().split("T")[0],
      };
      setPhotos([newPhoto, ...photos]);
      setIsUploading(false);
    }, 700);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-neutral-dark">
            Photo Gallery & Media
          </h1>
          <p className="mt-1 text-sm text-neutral-mid">
            Upload high-resolution photography and curate memories shared by guests.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button size="sm" onClick={handleMockUpload} disabled={isUploading}>
            <Upload className="mr-1.5 h-4 w-4" />
            {isUploading ? "Uploading..." : "Upload Photos"}
          </Button>
        </div>
      </div>

      {/* Storage Limit Banner */}
      <div className="rounded-xl border border-border bg-white p-5 shadow-soft-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <ImageIcon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-neutral-dark">
              Gallery Storage Quota: {photos.length} of 25 Photos Used
            </p>
            <p className="text-xs text-neutral-mid mt-0.5">
              Free plan includes 25 photos. Upgrade to Premium for 500 photos and high-resolution guest uploads.
            </p>
          </div>
        </div>

        <Button variant="secondary" size="sm" asChild>
          <a href="/pricing">Upgrade Plan</a>
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "all"
              ? "bg-primary text-white"
              : "text-neutral-mid hover:text-neutral-dark"
          }`}
        >
          All Photos ({photos.length})
        </button>
        <button
          onClick={() => setActiveTab("couple")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "couple"
              ? "bg-primary text-white"
              : "text-neutral-mid hover:text-neutral-dark"
          }`}
        >
          Our Photos ({photos.filter((p) => p.uploaded_by === "couple").length})
        </button>
        <button
          onClick={() => setActiveTab("guest")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            activeTab === "guest"
              ? "bg-primary text-white"
              : "text-neutral-mid hover:text-neutral-dark"
          }`}
        >
          Guest Shared ({photos.filter((p) => p.uploaded_by === "guest").length})
        </button>
      </div>

      {/* Photos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredPhotos.map((photo) => (
          <div
            key={photo.id}
            className="group relative rounded-2xl overflow-hidden bg-white border border-border shadow-soft-sm hover:shadow-soft-md transition-shadow flex flex-col"
          >
            <div className="relative aspect-square overflow-hidden bg-neutral-100">
              <img
                src={photo.url}
                alt={photo.caption}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />

              {photo.is_cover && (
                <div className="absolute top-2 left-2 inline-flex items-center gap-1 bg-primary text-white text-[11px] font-semibold px-2 py-0.5 rounded-full shadow-sm">
                  <Star className="h-3 w-3 fill-white" />
                  Cover Photo
                </div>
              )}

              {!photo.is_approved && (
                <div className="absolute top-2 right-2 inline-flex items-center gap-1 bg-amber-500 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full shadow-sm">
                  <Clock className="h-3 w-3" />
                  Pending Review
                </div>
              )}
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-dark truncate">
                  {photo.caption}
                </p>
                <p className="text-xs text-neutral-mid mt-0.5 capitalize">
                  Uploaded by {photo.uploaded_by} · {photo.uploaded_at}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-xs">
                {!photo.is_cover && (
                  <button
                    onClick={() => handleSetCover(photo.id)}
                    className="text-neutral-mid hover:text-primary font-medium"
                  >
                    Set as Cover
                  </button>
                )}

                {!photo.is_approved && (
                  <button
                    onClick={() => handleApprove(photo.id)}
                    className="text-green-600 hover:text-green-700 font-medium inline-flex items-center gap-1"
                  >
                    <CheckCircle2 className="h-3 w-3" />
                    Approve
                  </button>
                )}

                <button
                  onClick={() => handleDelete(photo.id)}
                  className="text-neutral-mid hover:text-red-600 p-1 transition-colors ml-auto"
                  title="Delete photo"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
