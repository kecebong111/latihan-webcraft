"use client";

import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createCommunity } from "@/actions/community";
import { uploadCommunityIcon } from "@/actions/admin";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CreateCommunityPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const generatedSlug = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    setSlug(generatedSlug);
  }, [name]);

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setIcon(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id || !icon) return;

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("icon", icon);
      const iconUrl = await uploadCommunityIcon(formData);

      await createCommunity(name, slug, description, session.user.id, iconUrl);
      router.push("/admin/communities");
    } catch (error) {
      console.error("Failed to create community:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full font-sans bg-gray-900 min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8 text-white">Create Community</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="text-white">Name</label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label htmlFor="slug" className="text-white">Slug</label>
          <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
        </div>
        <div>
          <label htmlFor="description" className="text-white">Description</label>
          <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div>
          <label htmlFor="icon" className="text-white">Icon</label>
          <Input id="icon" type="file" onChange={handleIconChange} />
        </div>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Community"}
        </Button>
      </form>
    </div>
  );
}
