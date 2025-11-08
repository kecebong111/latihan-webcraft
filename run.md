1 # How to Run the Gamanitas Backend for Testing
    2
    3 This tutorial will guide you through setting up and running the Gamanitas web application's
      backend on your local machine. This is essential for testing features, developing new ones,
      or simply exploring how the application works.
    4
    5 ## Prerequisites
    6
    7 Before you begin, ensure you have the following installed on your system:
    8
    9 1.  **Node.js**: The backend is built with Next.js, which requires Node.js. It's recommended
      to use the latest LTS (Long Term Support) version. You can download it from [nodejs.org](
      https://nodejs.org/).
   10 2.  **pnpm**: This project uses `pnpm` as its package manager. If you don't have it, install
      it globally:
      npm install -g pnpm

   1 3.  **Docker**: We'll use Docker to easily set up a PostgreSQL database without manual
     installation. Download and install Docker Desktop from [docker.com](https:
     //www.docker.com/products/docker-desktop/).
   2
   3 ## Step 1: Get the Code
   4
   5 First, you need to get a copy of the project's codebase.
   6
   7 1.  **Clone the repository:**
      git clone <repository-url>
   1     (Replace `<repository-url>` with the actual Git repository URL provided by your friend.)
   2
   3 2.  **Navigate into the project directory:**
      cd gamanitas-app

   1
   2 ## Step 2: Install Dependencies
   3
   4 Once you're in the project directory, install all the necessary Node.js packages.
  pnpm install

   1
   2 ## Step 3: Set up the Database
   3
   4 The Gamanitas application uses a PostgreSQL database managed by Prisma.
   5
   6 1.  **Start PostgreSQL with Docker:**
   7     This command will start a PostgreSQL container named `gamanitas-postgres` and expose it on
     port `5432`.
  docker run --name gamanitas-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=gamanitas -p
  5432:5432 -d postgres

   1     *   `POSTGRES_PASSWORD=password`: Sets the database password to `password`.
   2     *   `POSTGRES_DB=gamanitas`: Creates a database named `gamanitas`.
   3     *   `-p 5432:5432`: Maps the container's port 5432 to your local machine's port 5432.
   4
   5 2.  **Create an `.env` file:**
   6     In the root of your `gamanitas-app` directory, create a new file named `.env`. This file
     will store your environment variables. Copy and paste the following content into it:
      DATABASE_URL="postgresql://postgres:password@localhost:5432/gamanitas"
      NEXTAUTH_SECRET="your-super-secret-key-here"
      NEXTAUTH_URL="http://localhost:3000"

   1     *   `DATABASE_URL`: This connects the application to your local PostgreSQL database.
   2     *   `NEXTAUTH_SECRET`: **IMPORTANT:** Replace `"your-super-secret-key-here"` with a long,
     random string. You can generate one online (e.g., a UUID or a string from a password generator
     ). This is crucial for security.
   3     *   `NEXTAUTH_URL`: This should match the URL where your application will run locally.
   4
   5 3.  **Run Prisma Migrations:**
   6     These commands will apply the database schema defined in `prisma/schema.prisma` to your
     PostgreSQL database and generate the Prisma client.
      npx prisma migrate dev
      npx prisma generate

   1     Follow any prompts from `npx prisma migrate dev`.
   2
   3 ## Step 4: Start the Backend Server
   4
   5 Finally, you can start the Next.js development server, which runs the backend.
  pnpm dev

   1
   2 The application should now be running and accessible in your web browser, usually at `http:
     //localhost:3000`.
   3
   4 ## Troubleshooting
   5
   6 If you encounter any issues, please refer to the `BACKEND_DOCS.md` file in the project root
     for more detailed troubleshooting steps, common issues, and debug commands.