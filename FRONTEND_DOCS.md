# Gamanitas Frontend Documentation

## Overview

This document provides comprehensive information about the frontend architecture, components, pages, and how to consume server actions for the Gamanitas community web application.

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS v4 + shadcn/ui components
- **Icons**: Lucide React
- **Authentication**: NextAuth.js v5
- **State Management**: React hooks + Server Actions
- **TypeScript**: Full type safety

## Next.js 16 Specific Considerations

### Dynamic Route Parameters
Next.js 16 introduced changes to how dynamic route parameters are handled in the App Router:

#### Before Next.js 16 (Deprecated)
```tsx
// This no longer works in Next.js 16+
export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params  // ❌ Will be undefined
  // ...
}
```

#### Next.js 16+ (Required)
```tsx
// Always await params first
export default async function Page({ params }: { params: { slug: string } }) {
  const resolvedParams = await params  // ✅ Correct
  const { slug } = resolvedParams
  // ...
}
```

#### Affected Files
- `app/(main)/c/[slug]/page.tsx` - Community pages
- `app/(main)/post/[id]/page.tsx` - Post detail pages

#### Common Error
If you see `PrismaClientValidationError: where: { slug: undefined }`, it means you're not awaiting the params correctly.

#### Migration Checklist
- [ ] Update all dynamic route pages to use `await params`
- [ ] Test all dynamic routes (`/c/[slug]`, `/post/[id]`)
- [ ] Verify parameter extraction works correctly
- [ ] Check for any remaining destructuring patterns without await

## Project Structure

```
app/
├── (auth)/                 # Authentication pages
│   ├── login/
│   └── register/
├── (main)/                 # Main application pages
│   ├── admin/             # Admin dashboard
│   ├── c/[slug]/          # Community pages
│   ├── post/[id]/         # Post detail pages
│   ├── profile/           # User profile
│   ├── search/            # Search results
│   └── layout.tsx         # Main layout
├── api/auth/[...nextauth] # NextAuth API route
└── layout.tsx             # Root layout

components/
├── feed/                  # Feed-related components
│   ├── post-card.tsx
│   └── search-bar.tsx
├── layout/                # Layout components
│   ├── navbar.tsx
│   ├── sidebar.tsx
│   └── theme-toggle.tsx
└── post/                  # Post-related components
    └── comment-section.tsx
```

## Core Components

### Layout Components

#### Navbar (`components/layout/navbar.tsx`)
- **Purpose**: Main navigation header with user authentication
- **Features**:
  - Logo/home link
  - User avatar dropdown (when authenticated)
  - Login/Register buttons (when unauthenticated)
  - Theme toggle integration
  - Admin panel link (for admin users)

**Usage**:
```tsx
import Navbar from "@/components/layout/navbar"

// Automatically included in main layout
```

#### Sidebar (`components/layout/sidebar.tsx`)
- **Purpose**: Community navigation sidebar
- **Features**:
  - List of all communities
  - Member count display
  - Active community highlighting
  - Responsive design (hidden on mobile)

**Usage**:
```tsx
import Sidebar from "@/components/layout/sidebar"

// Automatically included in main layout
```

#### Theme Toggle (`components/layout/theme-toggle.tsx`)
- **Purpose**: Dark/light mode switching
- **Features**:
  - System preference detection
  - Local storage persistence
  - Smooth theme transitions
  - Icon switching (sun/moon)

**Usage**:
```tsx
import ThemeToggle from "@/components/layout/theme-toggle"

// Integrated into navbar
<ThemeToggle />
```

### Feed Components

#### Post Card (`components/feed/post-card.tsx`)
- **Purpose**: Display individual post in feed format
- **Features**:
  - Post title and content preview
  - Author and community information
  - Comment count
  - Creation date
  - Click to view full post

**Props**:
```tsx
interface PostCardProps {
  post: {
    id: string
    title: string
    content: string
    createdAt: string
    author: { name: string | null }
    community: { name: string; slug: string }
    _count: { comments: number }
  }
}
```

**Usage**:
```tsx
import PostCard from "@/components/feed/post-card"

<PostCard post={postData} />
```

#### Search Bar (`components/feed/search-bar.tsx`)
- **Purpose**: Search functionality for posts and communities
- **Features**:
  - Real-time search suggestions
  - Search by post title/content
  - Search by community name
  - Keyboard navigation support

**Usage**:
```tsx
import SearchBar from "@/components/feed/search-bar"

<SearchBar onSearch={(query) => handleSearch(query)} />
```

### Post Components

#### Comment Section (`components/post/comment-section.tsx`)
- **Purpose**: Display and create comments for posts
- **Features**:
  - Flat comment layout (Instagram-style)
  - Real-time comment creation
  - Character limit validation
  - Author avatars
  - Timestamps

**Props**:
```tsx
interface CommentSectionProps {
  postId: string
  initialComments: Comment[]
}
```

**Usage**:
```tsx
import CommentSection from "@/components/post/comment-section"

<CommentSection postId={post.id} initialComments={comments} />
```

## Pages

### Authentication Pages

#### Login Page (`app/(auth)/login/page.tsx`)
- **Route**: `/login`
- **Purpose**: User authentication
- **Features**:
  - Email/password form
  - Client-side validation
  - Error handling
  - Loading states
  - Redirect to home on success

**Form Validation**:
- Email format validation
- Password required (min 6 chars)
- Real-time error display

#### Register Page (`app/(auth)/register/page.tsx`)
- **Route**: `/register`
- **Purpose**: New user registration
- **Features**:
  - Name, email, password fields
  - Password confirmation
  - Complex password requirements
  - Client-side validation
  - Success redirect to login

**Form Validation**:
- Name (min 2 chars)
- Email format validation
- Password complexity (uppercase, lowercase, numbers, min 6 chars)
- Password confirmation match

### Main Application Pages

#### Home Feed (`app/(main)/page.tsx`)
- **Route**: `/`
- **Purpose**: Main feed of all posts
- **Features**:
  - Paginated post feed
  - Post cards with interactions
  - Search integration
  - Responsive layout

**Data Fetching**:
```tsx
// Server-side data fetching
const posts = await getFeed(1, 20)
```

#### Community Page (`app/(main)/c/[slug]/page.tsx`)
- **Route**: `/c/[slug]`
- **Purpose**: Community-specific feed
- **Features**:
  - Community information display
  - Filtered posts by community
  - Member count
  - Follow/unfollow functionality

**Dynamic Routing**:
```tsx
// Access community slug from params (Next.js 16+)
const resolvedParams = await params
const slug = resolvedParams.slug
const community = await getCommunityBySlug(slug)
```

#### Post Detail (`app/(main)/post/[id]/page.tsx`)
- **Route**: `/post/[id]`
- **Purpose**: Individual post with comments
- **Features**:
  - Full post content display
  - Comment section
  - Author information
  - Community context

#### User Profile (`app/(main)/profile/page.tsx`)
- **Route**: `/profile`
- **Purpose**: User profile and posts
- **Features**:
  - User information display
  - User's posts list
  - Authentication required

#### Search Results (`app/(main)/search/page.tsx`)
- **Route**: `/search?q=query`
- **Purpose**: Search results page
- **Features**:
  - Query parameter handling
  - Results display
  - No results state

### Admin Pages

#### Admin Dashboard (`app/(main)/admin/page.tsx`)
- **Route**: `/admin`
- **Purpose**: Admin dashboard home
- **Features**:
  - Navigation cards for admin functions
  - Access control (admin only)
  - Quick stats overview

#### Users Management (`app/(main)/admin/users/page.tsx`)
- **Route**: `/admin/users`
- **Purpose**: User account management
- **Features**:
  - Paginated user list
  - User status management (activate/suspend)
  - User statistics
  - Search functionality

#### Communities Management (`app/(main)/admin/communities/page.tsx`)
- **Route**: `/admin/communities`
- **Purpose**: Community management
- **Features**:
  - All communities grid
  - Community statistics
  - Create new community link
  - View community details

#### Create Community (`app/(main)/admin/communities/create/page.tsx`)
- **Route**: `/admin/communities/create`
- **Purpose**: Create new community
- **Features**:
  - Community creation form
  - Slug generation
  - Icon upload (URL)
  - Validation

**Form Validation**:
- Name (3-50 chars)
- Auto-generated slug
- Description (max 500 chars)
- Optional icon URL

#### Posts Management (`app/(main)/admin/posts/page.tsx`)
- **Route**: `/admin/posts`
- **Purpose**: Post management
- **Features**:
  - All posts with status
  - Post status management
  - Delete functionality
  - Board post indicators

#### Create Board Post (`app/(main)/admin/posts/create/page.tsx`)
- **Route**: `/admin/posts/create`
- **Purpose**: Create admin board post
- **Features**:
  - Post creation form
  - Community selection
  - Rich text content
  - Board post designation

## Server Actions Integration

### Consuming Server Actions

#### Authentication Actions
```tsx
import { login, register } from "@/actions/auth"
import { signIn } from "next-auth/react"

// Login
const result = await login(email, password)
if (result.success) {
  await signIn("credentials", { email, password, redirect: false })
  router.push("/")
}

// Register
await register(email, password, name)
router.push("/login?message=Registration successful")
```

#### Data Fetching Actions
```tsx
import { getFeed, getCommunityBySlug } from "@/actions/community"

// Server-side fetching
const posts = await getFeed(1, 20)
const community = await getCommunityBySlug(slug)
```

#### Creation Actions
```tsx
import { createComment } from "@/actions/comment"

const comment = await createComment(text, userId, postId)
setComments([comment, ...comments])
```

### Error Handling Patterns

#### Try-Catch with User Feedback
```tsx
const [error, setError] = useState("")
const [isLoading, setIsLoading] = useState(false)

const handleSubmit = async () => {
  setIsLoading(true)
  setError("")
  
  try {
    await serverAction(data)
    router.push("/success")
  } catch (error: any) {
    setError(error.message || "Operation failed")
  } finally {
    setIsLoading(false)
  }
}
```

#### Loading States
```tsx
<button
  className={`btn btn-primary ${isLoading ? "loading" : ""}`}
  disabled={isLoading}
>
  {isLoading ? "Processing..." : "Submit"}
</button>
```

## Authentication Integration

### Session Management
```tsx
import { useSession } from "next-auth/react"

const { data: session, status } = useSession()

if (status === "loading") return <div>Loading...</div>
if (!session) return <div>Please login</div>

// Access user data
const userRole = (session.user as any)?.role
```

### Protected Routes
```tsx
// Page-level protection
if (!session || (session.user as any)?.role !== "ADMIN") {
  return <div>Access Denied</div>
}

// Component-level protection
{session && (
  <button onClick={handleAction}>
    Protected Action
  </button>
)}
```

## Styling Guidelines

### shadcn/ui Components
- Use semantic shadcn/ui components (`Button`, `Card`, `Input`)
- Follow consistent variants (`variant="default"`, `variant="destructive"`)
- Utilize responsive utilities (`grid-cols-1 md:grid-cols-2`)
- Use CSS variables for theme consistency

### Theme Support
- All components support dark/light themes via `dark` class on HTML element
- Custom theme implementation using Tailwind CSS v4
- Theme switching handled by `ThemeToggle` component
- CSS variables managed through Tailwind configuration

### Custom Styling
- Extend with Tailwind utilities for custom needs
- Maintain consistent spacing and typography
- Use CSS variables for theme consistency

### Theme Support
- All components support dark/light themes
- Use `data-theme` attribute for theme switching
- Test in both themes

## State Management

### Local State
```tsx
const [posts, setPosts] = useState([])
const [loading, setLoading] = useState(false)
const [error, setError] = useState("")
```

### Server State
- Use Next.js server actions for data fetching
- Leverage React Query for complex caching if needed
- Implement optimistic updates for better UX

## Performance Optimization

### Code Splitting
- Dynamic imports for large components
- Route-based code splitting (automatic with Next.js)

### Image Optimization
- Use Next.js Image component for photos
- Implement lazy loading for post images

### Bundle Optimization
- Tree-shake unused imports
- Optimize third-party library usage

## Testing

### Component Testing
- Test component rendering
- Test user interactions
- Test error states

### Integration Testing
- Test page flows
- Test authentication flows
- Test form submissions

## Accessibility

### Semantic HTML
- Use proper heading hierarchy
- Implement ARIA labels where needed
- Ensure keyboard navigation

### Form Accessibility
- Proper label associations
- Error announcements
- Focus management

## Responsive Design

### Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Mobile Considerations
- Touch-friendly button sizes
- Collapsible navigation
- Optimized form layouts

## Deployment Considerations

### Environment Variables
```env
NEXT_PUBLIC_APP_URL=your-app-url
NEXTAUTH_URL=your-auth-url
```

### Build Optimization
- Run `npm run build` to verify production build
- Check bundle size with `npm run analyze`
- Test all routes in production mode

## Troubleshooting

### Common Issues

1. **Server Actions Not Working**
   - Check file is marked "use server"
   - Verify import paths are correct
   - Check network tab for errors

2. **Authentication Issues**
   - Verify NEXTAUTH_SECRET is set
   - Check callback URLs
   - Clear browser storage

3. **Dynamic Route Parameter Issues**
   - **Next.js 16+**: Always use `await params` before destructuring
   - **Correct pattern**: `const resolvedParams = await params; const { slug } = resolvedParams`
   - **Incorrect pattern**: `const { slug } = params` (will cause undefined parameters)
   - This affects all dynamic routes like `/c/[slug]` and `/post/[id]`

4. **Styling Issues**
   - Verify Tailwind CSS is imported in `globals.css`
   - Check shadcn/ui configuration in `components.json`
   - Validate component imports are correct
   - Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
   - Check browser DevTools for CSS loading errors

5. **Theme Not Working**
   - Verify `dark` class is set on `<html>` element
   - Check theme toggle component is properly integrated
   - Ensure Tailwind CSS v4 theme configuration is correct

6. **Build Issues**
   - Run `rm -rf .next` then `npm run build`
   - Check for CSS compilation errors
   - Verify all dependencies are installed

### Debug Tools
- React DevTools for component inspection
- Next.js DevTools for route debugging
- Browser DevTools for network issues

## Contributing Guidelines

### Code Style
- Use TypeScript for all components
- Follow existing naming conventions
- Implement proper error boundaries
- Add loading states for async operations

### Component Guidelines
- Keep components focused and reusable
- Use proper TypeScript interfaces
- Implement accessibility features
- Test in both themes

### Performance Guidelines
- Optimize re-renders with proper dependencies
- Use React.memo for expensive components
- Implement virtual scrolling for long lists
- Lazy load non-critical components