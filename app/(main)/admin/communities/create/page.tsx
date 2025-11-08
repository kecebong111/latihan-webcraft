"use client";

import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createCommunity } from "@/actions/community";
import { uploadCommunityIcon } from "@/actions/admin";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Home, Upload, Users, Image as ImageIcon } from "lucide-react";

export default function CreateCommunityPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState<File | null>(null);
  const [iconPreview, setIconPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const generatedSlug = name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    setSlug(generatedSlug);
  }, [name]);

  const handleIconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIcon(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setIconPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.id) return;

    setIsSubmitting(true);

    try {
      let iconUrl = "";
      if (icon) {
        const formData = new FormData();
        formData.append("icon", icon);
        iconUrl = await uploadCommunityIcon(formData);
      }

      await createCommunity(name, slug, description, session.user.id, iconUrl);
      router.push("/admin/communities");
    } catch (error) {
      alert("Failed to create community. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackHome = () => {
    router.push("/");
  };

  const handleBackToCommunities = () => {
    router.push("/admin/communities");
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            onClick={handleBackHome}
            className="flex items-center gap-2 bg-gray-800 border-gray-700 text-white hover:bg-gray-700 hover:text-white"
          >
            <Home className="w-4 h-4" />
            Back Home
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">Create Community</h1>
            <p className="text-gray-400">Start a new community for users to join and share content</p>
          </div>
        </div>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="border-b border-gray-700">
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="w-5 h-5" />
              Community Details
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Icon Upload */}
              <div className="flex flex-col items-center gap-4 mb-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center border-4 border-gray-700 overflow-hidden">
                    {iconPreview ? (
                      <img 
                        src={iconPreview} 
                        alt="Community icon preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-white opacity-80" />
                    )}
                  </div>
                  {iconPreview && (
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-gray-800 flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </div>
                
                <div className="text-center">
                  <label htmlFor="icon" className="cursor-pointer">
                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
                      <Upload className="w-4 h-4" />
                      <span className="text-white text-sm font-medium">
                        {icon ? "Change Icon" : "Upload Icon"}
                      </span>
                    </div>
                    <input 
                      id="icon" 
                      type="file" 
                      onChange={handleIconChange} 
                      accept="image/*"
                      className="hidden" 
                    />
                  </label>
                  <p className="text-xs text-gray-400 mt-2">
                    Recommended: 256x256px PNG or JPG
                  </p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Community Name *
                  </label>
                  <Input 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter community name"
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Choose a descriptive name for your community
                  </p>
                </div>

                <div>
                  <label htmlFor="slug" className="block text-sm font-medium text-gray-300 mb-2">
                    URL Slug *
                  </label>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-400 bg-gray-700 border border-r-0 border-gray-600 rounded-l-lg px-3 py-2">
                      /c/
                    </span>
                    <Input 
                      id="slug" 
                      value={slug} 
                      onChange={(e) => setSlug(e.target.value)}
                      placeholder="community-slug"
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 rounded-l-none"
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    This will be used in the community URL
                  </p>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <Textarea 
                    id="description" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what this community is about..."
                    rows={4}
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500 resize-none"
                  />
                  <p className="text-xs text-gray-400 mt-1">
                    Let people know what this community is for
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-700">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBackToCommunities}
                  className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting || !name || !slug}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:bg-gray-600"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Users className="w-4 h-4 mr-2" />
                      Create Community
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Preview Card */}
        {(name || description) && (
          <Card className="bg-gray-800 border-gray-700 mt-6">
            <CardHeader className="border-b border-gray-700">
              <CardTitle className="text-white text-sm">Preview</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  {iconPreview ? (
                    <img 
                      src={iconPreview} 
                      alt="Preview" 
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span className="text-white font-bold text-sm">
                      {name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-white font-semibold">
                    {name || "Community Name"}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    /c/{slug || "community-slug"}
                  </p>
                  {description && (
                    <p className="text-gray-300 text-sm mt-1">{description}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}