# HealthSummits.tv Next.js Application

This directory contains the Next.js 15 rewrite of the HealthSummits.tv platform, moving away from the legacy PHP infrastructure to a modern React-based stack using TailwindCSS and Prisma.

## Key Features Implemented

*   **Organiser Hub (`/organiser-hub`)**: A complete dashboard for health practitioners and summit organisers.
    *   Analytics and metrics for ticket sales and views.
    *   Ability to upload new Virtual Events and Vault Videos.
    *   **Account Settings**: Organisers can manage their public profile, company details, avatar, and set global subscription prices.
    *   **Editing & Moderation Pipeline**: Organisers can edit live videos and events. Edits to live items are placed in a `pendingEdits` queue without taking the original item offline, ensuring viewers always have uninterrupted access.

*   **Admin Governance Portal (`/admin`)**: A centralized moderation hub for platform administrators.
    *   **Organiser Verification**: Approve new practitioner accounts.
    *   **Content Moderation**: Review and approve newly submitted videos and virtual events.
    *   **Edit Moderation**: Review "Pending Edits" submitted by organisers to live content before merging changes.
    *   **Security & Settings**: View login security logs and toggle global maintenance mode.

*   **Database Schema (`/prisma`)**:
    *   Migrated to MySQL using Prisma ORM.
    *   Defined relations between `User`, `OrganiserProfile`, `Event`, and `Video`.
    *   Implemented `pendingEdits` JSON fields for content versioning during the moderation workflow.

## Getting Started

### Prerequisites
- Node.js 18+
- MySQL database

### Setup
1. Clone the repository and navigate to `healthstv-app`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your `.env` file with the `DATABASE_URL` pointing to your MySQL instance.
4. Push the schema to the database:
   ```bash
   npx prisma db push
   npx prisma generate
   ```
5. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
