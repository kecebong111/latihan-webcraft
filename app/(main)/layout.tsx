import { AppSidebar } from "@/components/layout/app-sidebar"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { getAllCommunities, getUserFollowedCommunitiesSimple } from "@/actions/community"
import { auth } from "@/lib/auth"
import { UserDropdown } from "@/components/layout/user-dropdown"
import ThemeToggle from "@/components/layout/theme-toggle"

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  const communities = await getAllCommunities()
  const followedCommunities = session?.user?.id 
    ? await getUserFollowedCommunitiesSimple(session.user.id)
    : []
  
  return (
    <SidebarProvider>
      <AppSidebar 
        communities={communities} 
        followedCommunities={followedCommunities}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {session?.user && (
              <UserDropdown 
                name={session.user.name}
                email={session.user.email}
                image={session.user.image}
              />
            )}
          </div>
        </header>
        <main className="flex-1 p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}