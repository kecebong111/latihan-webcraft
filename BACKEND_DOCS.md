# Gamanitas Backend Documentation

## Overview

This document provides comprehensive information about the backend architecture, server actions, database schema, and deployment setup for the Gamanitas community web application.

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js v5 with custom credentials provider
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Deployment**: Vercel (frontend) + Neon/PostgreSQL (database)

## Database Schema

### Core Models

#### User
```typescript
interface User {
  id: string
  email: string (unique)
  name: string
  password: string (hashed)
  role: 'USER' | 'ADMIN'
  status: 'ACTIVE' | 'SUSPENDED'
  image?: string
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### Community
```typescript
interface Community {
  id: string
  name: string (unique)
  slug: string (unique)
  description?: string
  icon?: string
  creatorId: string (foreign key to User)
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### Post
```typescript
interface Post {
  id: string
  title: string
  content: string
  status: 'ACTIVE' | 'SUSPENDED'
  isBoardPost: boolean
  authorId: string (foreign key to User)
  communityId: string (foreign key to Community)
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### Comment
```typescript
interface Comment {
  id: string
  text: string
  authorId: string (foreign key to User)
  postId: string (foreign key to Post)
  createdAt: DateTime
  updatedAt: DateTime
}
```

#### Follow
```typescript
interface Follow {
  id: string
  userId: string (foreign key to User)
  communityId: string (foreign key to Community)
  createdAt: DateTime
}
```

## Server Actions

### Authentication Actions (`actions/auth.ts`)

#### `register(email: string, password: string, name: string)`
- Creates a new user account
- Hashes password using bcrypt
- Assigns 'USER' role by default
- Returns success/error response

#### `login(email: string, password: string)`
- Validates user credentials
- Returns success/error response
- Used by NextAuth.js credentials provider

### User Management Actions (`actions/user.ts`)

#### `getUserById(id: string)`
- Retrieves user by ID with basic profile info

#### `updateUserStatus(userId: string, status: 'ACTIVE' | 'SUSPENDED')`
- Updates user account status
- Admin-only action

### Community Actions (`actions/community.ts`)

#### `createCommunity(name: string, slug: string, description: string, creatorId: string, icon?: string)`
- Creates a new community
- Generates unique slug automatically
- Associates with creator user

#### `getAllCommunities()`
- Returns all communities with member/post counts
- Ordered by name alphabetically

#### `getCommunityBySlug(slug: string)`
- Retrieves single community by slug
- Includes member/post counts

#### `followCommunity(userId: string, communityId: string)`
- Adds user to community followers
- Prevents duplicate follows

#### `unfollowCommunity(userId: string, communityId: string)`
- Removes user from community followers

### Post Actions (`actions/post.ts`)

#### `createPost(title: string, content: string, authorId: string, communityId: string)`
- Creates a new post
- Sets status to 'ACTIVE' by default
- Non-board posts only

#### `getFeed(page: number, limit: number = 20)`
- Returns paginated feed of active posts
- Ordered by creation date (newest first)
- Includes author and community info

#### `getPostsByCommunity(communitySlug: string, page: number, limit: number = 20)`
- Returns paginated posts for specific community
- Only active posts
- Includes author info

#### `updatePostStatus(postId: string, status: 'ACTIVE' | 'SUSPENDED')`
- Updates post status
- Admin-only action

#### `deletePost(postId: string, authorId: string)`
- Soft deletes post (author only)
- Sets status to 'SUSPENDED'

### Comment Actions (`actions/comment.ts`)

#### `createComment(text: string, authorId: string, postId: string)`
- Creates a new comment
- Returns comment with author info

#### `getCommentsByPost(postId: string)`
- Returns all comments for a post
- Ordered by creation date (newest first)
- Includes author info

#### `deleteComment(commentId: string, authorId: string)`
- Deletes comment (author only)

### Admin Actions (`actions/admin.ts`)

#### `getAllUsersForAdmin(page: number, limit: number = 20)`
- Returns paginated list of all users
- Includes post/comment counts
- Admin-only

#### `getAllCommunitiesForAdmin()`
- Returns all communities with full stats
- Admin-only

#### `getAllPostsForAdmin(page: number, limit: number = 20)`
- Returns all posts with status info
- Includes comment counts
- Admin-only

#### `createBoardPost(title: string, content: string, communityId: string, authorId: string)`
- Creates admin board post
- Sets `isBoardPost: true`
- Admin-only

#### `suspendUser(userId: string)`
- Suspends user account
- Admin-only

#### `activateUser(userId: string)`
- Activates suspended user account
- Admin-only

#### `suspendPost(postId: string)`
- Suspends post
- Admin-only

#### `activatePost(postId: string)`
- Activates suspended post
- Admin-only

#### `deletePostAdmin(postId: string)`
- Hard deletes post
- Admin-only

## Database Setup

### Local Development

1. **Install PostgreSQL** (via Docker recommended):
```bash
docker run --name gamanitas-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=gamanitas -p 5432:5432 -d postgres
```

2. **Configure Environment Variables**:
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/gamanitas"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

3. **Run Database Migrations**:
```bash
npx prisma migrate dev
npx prisma generate
```

### Production (Neon)

1. **Create Neon Database**:
   - Sign up at https://neon.tech
   - Create new project
   - Copy connection string

2. **Update Environment Variables**:
```env
DATABASE_URL="postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require"
```

3. **Run Migrations**:
```bash
npx prisma migrate deploy
npx prisma generate
```

## Authentication Setup

### NextAuth.js Configuration (`lib/auth.ts`)

- Uses custom credentials provider
- Integrates with custom login server action
- Session includes user role for admin access
- JWT strategy for session management

### Session Structure
```typescript
interface Session {
  user: {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    role: 'USER' | 'ADMIN'
  }
}
```

## Security Considerations

### Password Security
- All passwords hashed with bcrypt (10 rounds)
- Never store plain text passwords
- Minimum 6 characters with complexity requirements

### Authorization
- Role-based access control (USER vs ADMIN)
- Server actions check user permissions
- Admin-only actions protected at server level

### Input Validation
- Server-side validation on all inputs
- SQL injection prevention via Prisma ORM
- XSS prevention through proper escaping

## API Endpoints

### Authentication
- `POST /api/auth/[...nextauth]` - NextAuth.js handler

### Server Actions
All server actions are called via Next.js's server action mechanism, not traditional REST endpoints.

## Error Handling

### Standard Response Format
```typescript
interface SuccessResponse<T> {
  success: true
  data: T
}

interface ErrorResponse {
  success: false
  error: string
}
```

### Common Error Types
- Authentication errors
- Authorization errors
- Validation errors
- Database errors
- Not found errors

## Performance Optimization

### Database Indexes
- Primary keys on all tables
- Unique indexes on email, community name/slug
- Foreign key indexes for joins

### Query Optimization
- Selective field loading with `include`/`select`
- Pagination for large datasets
- Efficient count queries

## Deployment

### Environment Variables Required
```env
DATABASE_URL=          # PostgreSQL connection string
NEXTAUTH_SECRET=       # Random secret for JWT signing
NEXTAUTH_URL=          # Application URL
```

### Database Migration Commands
```bash
# Development
npx prisma migrate dev

# Production
npx prisma migrate deploy
npx prisma generate
```

## Monitoring and Logging

### Recommended Monitoring
- Database connection pool health
- Query performance metrics
- Authentication success/failure rates
- Error rate monitoring

### Logging Strategy
- Structured logging for server actions
- Error logging with context
- Performance metrics for slow queries

## Testing

### Unit Testing
- Test individual server actions
- Mock database calls
- Test validation logic

### Integration Testing
- Test authentication flow
- Test CRUD operations
- Test admin functions

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   - Check DATABASE_URL format
   - Verify database is running
   - Check network connectivity

2. **Authentication Issues**
   - Verify NEXTAUTH_SECRET is set
   - Check NEXTAUTH_URL matches deployment
   - Clear browser cookies

3. **Migration Issues**
   - Ensure database is empty for first migration
   - Check migration file permissions
   - Verify Prisma schema matches database

### Debug Commands
```bash
# Reset database (development only)
npx prisma migrate reset

# View database schema
npx prisma db pull

# Check migration status
npx prisma migrate status
```

## Contributing Guidelines

### Code Style
- Use TypeScript for all server actions
- Follow existing naming conventions
- Add JSDoc comments for public functions
- Handle errors gracefully

### Database Changes
1. Update `prisma/schema.prisma`
2. Generate migration: `npx prisma migrate dev --name <description>`
3. Update TypeScript types if needed
4. Test migration on fresh database

### Security Review
- All new server actions must include authorization checks
- Validate all user inputs
- Use parameterized queries (Prisma handles this)
- Review for potential security vulnerabilities