# Tech Spec: Gamanitas - Aplikasi Komunitas Universitas Gajah Mada

## 1. Gambaran Umum & Tujuan

- **Nama Proyek:** Gamanitas
- **Deskripsi:** Aplikasi web berbasis komunitas yang mirip dengan Reddit atau Instagram, dikhususkan untuk ekosistem Universitas Gajah Mada. Pengguna dapat mendaftar, masuk, dan mengikuti komunitas untuk melihat dan berinteraksi dengan konten yang relevan.
- **Target Pengguna:** Mahasiswa, dosen, dan staf Universitas Gajah Mada.
- **Tujuan Utama:**
  - Menyediakan platform terpusat untuk diskusi dan informasi komunitas di UGM.
  - Meningkatkan engagement melalui alur follow komunitas yang sederhana.
  - Memberikan alat moderasi yang efektif bagi admin untuk menjaga kualitas konten.

## 2. Teknologi Stack

- **Framework:** Next.js 16 (latest) dengan App Router.
- **Autentikasi:** NextAuth.js.
- **Database:** PostgreSQL, dijalankan dengan Docker.
- **ORM:** Prisma.
- **Styling:**
  - **Framework:** Tailwind CSS v4.
  - **Component Library:** shadcn/ui.
  - **Theme Support:** Dark/light modes with custom theme implementation.
- **Ikon:** Lucide React.
- **Dokumentasi Referensi:**
  - Next.js: [https://nextjs.org/docs/llms-full.txt](https://nextjs.org/docs/llms-full.txt)
  - shadcn/ui: [https://ui.shadcn.com/docs](https://ui.shadcn.com/docs)
  - Prisma: [https://www.prisma.io/llms-full.txt](https://www.prisma.io/llms-full.txt)

## 3. Arsitektur Aplikasi

Aplikasi ini dibangun dengan arsitektur full-stack di dalam satu proyek Next.js, dengan pemisahan tugas yang jelas:

- **Backend:** Logika bisnis, akses database, dan aturan keamanan diimplementasikan menggunakan **Server Actions** (di folder `actions/`) dan fungsi query (di folder `lib/`). Ini adalah "API" internal aplikasi.
- **Frontend:** Antarmuka pengguna (UI) dan interaksi diimplementasikan menggunakan **Komponen React/TSX** (di folder `components/` dan `app/`). Komponen-komponen ini akan memanggil Server Actions yang disediakan oleh backend.

## 4. Skema Database (Prisma Schema)

Skema ini mencerminkan kebutuhan aplikasi, termasuk peran pengguna, status moderasi, dan sistem follow.

```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  passwordHash  String    // Hashed password
  avatar        String?
  role          Role      @default(USER)
  status        UserStatus @default(ACTIVE)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relasi
  posts         Post[]
  comments      Comment[]
  createdCommunities Community[] // Komunitas yang dibuat oleh admin
  // Relasi Many-to-Many
  follows       Follow[]

  @@map("users")
}

model Community {
  id          String   @id @default(cuid())
  name        String   @unique
  slug        String   @unique
  icon        String?  // URL atau path ke ikon komunitas
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relasi
  creatorId   String
  creator     User     @relation(fields: [creatorId], references: [id], onDelete: Cascade)
  posts       Post[]
  follows     Follow[]

  @@map("communities")
}

model Post {
  id          String   @id @default(cuid())
  title       String
  content     String
  status      PostStatus @default(ACTIVE)
  isBoardPost Boolean  @default(false) // Untuk pengumuman dari admin
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relasi
  authorId    String
  author      User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  communityId String
  community   Community @relation(fields: [communityId], references: [id], onDelete: Cascade)
  comments    Comment[]

  @@map("posts")
}

model Comment {
  id        String   @id @default(cuid())
  text      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relasi
  authorId  String
  author    User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
  postId    String
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)

  @@map("comments")
}

// Tabel Hubungan (Many-to-Many) untuk Follow
model Follow {
  userId       String
  communityId  String

  user       User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  community  Community  @relation(fields: [communityId], references: [id], onDelete: Cascade)
  followedAt DateTime   @default(now())

  @@id([userId, communityId])
  @@map("follows")
}

// Enums
enum Role {
  USER
  ADMIN
}

enum UserStatus {
  ACTIVE
  SUSPENDED // Tidak bisa posting, hanya baca
}

enum PostStatus {
  ACTIVE
  SUSPENDED // Tidak ditampilkan
}
```

## 5. Project Structure

/
├── app/ # Area Frontend (Halaman & Routing)
│ ├── (auth)/ # Route Group untuk halaman auth (login, register)
│ ├── (main)/ # Route Group untuk halaman utama setelah login
│ │ ├── profile/
│ │ └── search/[...query]/ # Halaman pencarian
│ ├── admin/ # Halaman admin (dilindungi)
│ │ ├── users/
│ │ ├── communities/
│ │ └── posts/
│ ├── c/[slug]/ # Halaman dinamis untuk komunitas (Next.js 16+ parameter handling)
│ ├── post/[id]/ # Halaman detail post (Next.js 16+ parameter handling)
│ ├── globals.css
│ ├── layout.tsx # Layout utama (navbar, sidebar)
│ └── page.tsx # Halaman utama (feed semua komunitas diikuti)
├── actions/ # Area Backend (Server Actions)
│ ├── auth.ts
│ ├── community.ts
│ ├── post.ts
│ ├── comment.ts
│ └── admin.ts
├── components/ # Area Frontend (Komponen UI)
│ ├── ui/ # Komponen dasar (shadcn/ui)
│ ├── forms/ # Komponen form
│ ├── layout/ # Header, Sidebar, Footer
│ └── feed/ # PostCard, CommentSection, dll
├── lib/ # Area Backend (Utilitas & Query)
│ ├── db.ts
│ ├── utils.ts
│ └── queries.ts # Fungsi query kompleks
├── prisma/
│ └── schema.prisma
└── public/ # File statis

## 6. Next.js 16 Implementation Notes

### Dynamic Route Parameter Handling

Next.js 16 mengubah cara parameter route dinamik di-handle di App Router. Semua halaman dengan route dinamis harus menggunakan `await params` sebelum destructuring.

#### Pattern yang Benar (Next.js 16+)
```tsx
// Community Page: app/(main)/c/[slug]/page.tsx
export default async function CommunityPage({ params }: { params: { slug: string } }) {
  const resolvedParams = await params  // WAJIB: await params dulu
  const slug = resolvedParams.slug     // Baru destructuring
  const community = await getCommunityBySlug(slug)
  // ...
}

// Post Page: app/(main)/post/[id]/page.tsx
export default async function PostPage({ params }: { params: { id: string } }) {
  const { id } = await params  // Bisa langsung destructuring setelah await
  const post = await getPostById(id)
  // ...
}
```

#### Error yang Umum
Jika melihat error `PrismaClientValidationError: where: { slug: undefined }`, artinya parameter tidak di-await dengan benar.

#### Files yang Terpengaruh
- `app/(main)/c/[slug]/page.tsx` - Halaman komunitas
- `app/(main)/post/[id]/page.tsx` - Halaman detail post

#### Migration Checklist
- [ ] Update semua halaman dinamis untuk menggunakan `await params`
- [ ] Test semua route dinamis (`/c/[slug]`, `/post/[id]`)
- [ ] Verifikasi parameter extraction berfungsi dengan benar
- [ ] Cek error `PrismaClientValidationError` sudah tidak ada
