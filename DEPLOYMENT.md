# Gamanitas Deployment Guide

## Overview

This guide covers deploying the Gamanitas community web application to production using Vercel for the frontend and Neon for the PostgreSQL database.

## Prerequisites

- Node.js 18+ installed locally
- Git repository with the project code
- Vercel account (https://vercel.com)
- Neon database account (https://neon.tech)
- GitHub account (recommended for automatic deployments)

## Database Setup (Neon)

### 1. Create Neon Database

1. Sign up at https://neon.tech
2. Create a new project:
   - Choose a project name (e.g., `gamanitas-db`)
   - Select a region closest to your users
   - Choose PostgreSQL version (latest recommended)
3. Once created, copy the connection string from the dashboard

### 2. Configure Database

1. Go to the Neon dashboard
2. Navigate to your project
3. Copy the connection string (it should look like):
   ```
   postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require
   ```

### 3. Run Database Migrations

1. Set up your local environment with the Neon database URL:
   ```bash
   export DATABASE_URL="your-neon-connection-string"
   ```

2. Run migrations to set up the database schema:
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

## Vercel Deployment

### 1. Install Vercel CLI

```bash
npm i -g vercel
```

### 2. Prepare Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database
DATABASE_URL="your-neon-connection-string"

# NextAuth.js
NEXTAUTH_SECRET="your-random-secret-key"
NEXTAUTH_URL="https://your-app-domain.vercel.app"

# Optional: App URL for redirects
NEXT_PUBLIC_APP_URL="https://your-app-domain.vercel.app"
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 3. Verify Styling Configuration

Ensure Tailwind CSS v4 and shadcn/ui are properly configured:

1. **Check package.json dependencies**:
   ```json
   "tailwindcss": "^4.0.0",
   "@tailwindcss/vite": "^4.0.0",
   "postcss": "^8.4.35"
   ```

2. **Verify configuration files**:
   - `tailwind.config.ts` - Contains Tailwind v4 configuration
   - `postcss.config.mjs` - Contains Tailwind and Autoprefixer
   - `app/globals.css` - Contains Tailwind directives
   - `components.json` - Contains shadcn/ui configuration

3. **Test styling locally**:
   ```bash
   npm run dev
   ```
   # Visit any page to verify shadcn/ui components are working
   ```

### 3. Deploy via Vercel CLI

1. Login to Vercel:
   ```bash
   vercel login
   ```

2. Deploy from project root:
   ```bash
   vercel
   ```

3. Follow the prompts:
   - Set up and deploy? `Y`
   - Which scope? Choose your Vercel account
   - Link to existing project? `N` (first time)
   - Project name? `gamanitas-app` (or your choice)
   - In which directory is your code located? `./`
   - Want to override settings? `N`

4. Add environment variables when prompted:
   - `DATABASE_URL`: Your Neon connection string
   - `NEXTAUTH_SECRET`: Your generated secret
   - `NEXTAUTH_URL`: Your Vercel URL (will be provided)

### 4. Configure Environment Variables in Vercel Dashboard

Alternatively, set environment variables in the Vercel dashboard:

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add the following variables:
   - `DATABASE_URL` (Production)
   - `NEXTAUTH_SECRET` (Production)
   - `NEXTAUTH_URL` (Production)

### 5. Deploy with GitHub Integration (Recommended)

1. Push your code to GitHub:
   ```bash
   git add .
   git commit -m "Initial deployment setup"
   git push origin main
   ```

2. In Vercel dashboard:
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Configure build settings:
     - Framework Preset: Next.js
     - Root Directory: `./`
     - Build Command: `npm run build`
     - Output Directory: `.next`
   - Add environment variables
   - Deploy

## Post-Deployment Setup

### 1. Create Admin User

After deployment, you'll need to create an admin user:

1. Register a new account on your deployed app
2. Connect to your Neon database directly (using Neon's SQL editor or psql)
3. Update the user role to ADMIN:

```sql
UPDATE "User" SET role = 'ADMIN' WHERE email = 'your-admin-email@example.com';
```

### 2. Verify Database Connection

Check that your application can connect to the database:

1. Visit your deployed app
2. Try registering a new user
3. Check if the user appears in the database

### 3. Test Authentication

1. Test login/logout functionality
2. Verify session persistence
3. Test admin panel access

## Environment Configuration

### Development Environment

Create `.env.local` for local development:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/gamanitas"
NEXTAUTH_SECRET="your-local-secret"
NEXTAUTH_URL="http://localhost:3000"
```

### Production Environment

Environment variables should be set in Vercel dashboard:

```env
DATABASE_URL="your-neon-connection-string"
NEXTAUTH_SECRET="your-production-secret"
NEXTAUTH_URL="https://your-app-domain.vercel.app"
```

## Custom Domain Setup (Optional)

### 1. Configure Domain in Vercel

1. Go to your project settings in Vercel
2. Navigate to "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions

### 2. Update Environment Variables

Update `NEXTAUTH_URL` to your custom domain:
```env
NEXTAUTH_URL="https://your-custom-domain.com"
```

### 3. SSL Certificate

Vercel automatically provides SSL certificates for custom domains.

## Monitoring and Maintenance

### 1. Vercel Analytics

Enable Vercel Analytics in your project settings to monitor:
- Page views
- Web Vitals
- User demographics

### 2. Database Monitoring

Monitor your Neon database:
- Connection usage
- Query performance
- Storage usage

### 3. Error Tracking

Consider integrating error tracking:
- Sentry for error monitoring
- LogRocket for session replay

## Scaling Considerations

### Database Scaling

Neon automatically scales, but monitor:
- Connection limits
- Storage usage
- Query performance

### Application Scaling

Vercel automatically scales, but consider:
- Edge function timeouts
- Build times
- Bundle size optimization

## Backup and Recovery

### Database Backups

Neon provides automated backups:
- Point-in-time recovery
- Daily backups
- Manual backup creation

### Application Backup

Your code is safely stored in GitHub/Vercel.

## Security Considerations

### Environment Variables

- Never commit `.env` files
- Use strong, unique secrets
- Rotate secrets periodically

### Database Security

- Use SSL connections (enforced by Neon)
- Implement connection pooling
- Monitor for unusual activity

### Application Security

- Keep dependencies updated
- Monitor security advisories
- Implement rate limiting if needed

## Troubleshooting

### Common Issues

#### Database Connection Errors
```bash
# Check connection string format
# Verify SSL mode is required
# Test connection locally first
```

#### Authentication Issues
```bash
# Verify NEXTAUTH_SECRET is set
# Check NEXTAUTH_URL matches deployment
# Clear browser cookies
```

#### Build Errors
```bash
# Check Node.js version compatibility
# Verify all dependencies are installed
# Check TypeScript compilation
```

#### Next.js 16 Dynamic Route Issues
```bash
# Check for PrismaClientValidationError in dynamic routes
# Verify await params is used in all dynamic route pages
# Test /c/[slug] and /post/[id] routes specifically
# Look for "where: { slug: undefined }" errors in logs
```

### Debug Commands

```bash
# Local development with production database
DATABASE_URL="your-neon-url" npm run dev

# Check database connection
npx prisma db pull

# Verify migrations
npx prisma migrate status
```

### Performance Optimization

#### Database Optimization
```sql
-- Check slow queries
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;
```

#### Application Optimization
```bash
# Analyze bundle size
npm run build
npx @next/bundle-analyzer

# Check build performance
npm run build -- --debug
```

## Deployment Checklist

### Pre-Deployment
- [ ] All tests passing locally
- [ ] Environment variables configured
- [ ] Database migrations tested
- [ ] Build process successful
- [ ] Security review completed
- [ ] Next.js 16 dynamic route parameters verified
- [ ] All dynamic routes (`/c/[slug]`, `/post/[id]`) tested locally

### Post-Deployment
- [ ] Basic functionality tested
- [ ] Authentication flow verified
- [ ] Admin access confirmed
- [ ] Database connectivity verified
- [ ] Dynamic routes working without `PrismaClientValidationError`
- [ ] Error monitoring configured
- [ ] Performance baseline established

### Regular Maintenance
- [ ] Dependencies updated monthly
- [ ] Security patches applied
- [ ] Database backups verified
- [ ] Performance metrics reviewed
- [ ] Error logs monitored

## Rollback Procedures

### Application Rollback

If deployment causes issues:

1. Via Vercel Dashboard:
   - Go to Deployments tab
   - Find previous stable deployment
   - Click "..." → "Promote to Production"

2. Via Git:
   ```bash
   git revert <commit-hash>
   git push origin main
   ```

### Database Rollback

If database migration causes issues:

1. Create new migration to revert:
   ```bash
   npx prisma migrate dev --name rollback
   ```

2. Or use point-in-time recovery in Neon dashboard.

## Support Resources

### Documentation
- Vercel Documentation: https://vercel.com/docs
- Neon Documentation: https://neon.tech/docs
- Next.js Documentation: https://nextjs.org/docs

### Community Support
- Vercel Discord: https://vercel.com/discord
- Neon Discord: https://discord.gg/neon
- Next.js GitHub: https://github.com/vercel/next.js

### Emergency Contacts
- Vercel Support: Available for Pro/Enterprise plans
- Neon Support: Available for paid plans
- Community forums for general questions