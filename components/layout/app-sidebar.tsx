"use client"

import { GalleryVerticalEnd, Users, Heart } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function AppSidebar({ 
  communities = [], 
  followedCommunities = [] 
}: { 
  communities?: Array<{ id: string; name: string; slug: string }>
  followedCommunities?: Array<{ id: string; name: string; slug: string }>
}) {
  const pathname = usePathname()

  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Gamanitas</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>My Community</SidebarGroupLabel>
          <SidebarMenu>
            {followedCommunities.length > 0 ? (
              followedCommunities.map((community) => (
                <SidebarMenuItem key={community.id}>
                  <SidebarMenuButton asChild isActive={pathname === `/c/${community.slug}`}>
                    <Link href={`/c/${community.slug}`}>
                      <div className="flex aspect-square size-4 items-center justify-center rounded-sm bg-primary/10">
                        <Heart className="size-2 text-primary" />
                      </div>
                      <span>{community.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))
            ) : (
              <SidebarMenuItem>
                <div className="px-2 py-1 text-sm text-muted-foreground">
                  No followed communities yet
                </div>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarGroup>
        
        {communities.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel>All Communities</SidebarGroupLabel>
            <SidebarMenu>
              {communities.map((community) => (
                <SidebarMenuItem key={community.id}>
                  <SidebarMenuButton asChild isActive={pathname === `/c/${community.slug}`}>
                    <Link href={`/c/${community.slug}`}>
                      <div className="flex aspect-square size-4 items-center justify-center rounded-sm bg-primary/10">
                        <span className="text-xs font-bold text-primary">
                          {community.name.charAt(0)}
                        </span>
                      </div>
                      <span>{community.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        )}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/admin">
                <Users />
                <span>Admin</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}