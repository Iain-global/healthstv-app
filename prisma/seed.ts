import 'dotenv/config'
import { PrismaClient } from '../src/generated/prisma/client.ts'
const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // 1. Create Main Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@healthstv.com' },
    update: {},
    create: {
      email: 'admin@healthstv.com',
      password: 'admin', // In a real app, this must be hashed!
      role: 'ADMIN',
    },
  })
  console.log('Created Admin:', admin.email)

  // 2. Create an Organiser (Dr. Sarah Jenkins)
  const sarahUser = await prisma.user.upsert({
    where: { email: 'sarah.jenkins@example.com' },
    update: {},
    create: {
      email: 'sarah.jenkins@example.com',
      password: 'sarah',
      role: 'ORGANISER',
      organiserProfile: {
        create: {
          slug: 'sarah-jenkins',
          name: 'Dr. Sarah Jenkins, ND',
          organization: 'Functional Medicine Institute UK',
          bio: 'Specializing in gastrointestinal wellness, microbiome restoration, and chronic inflammation management. Host of the annual UK Gut Health Symposium with over 15 years of clinical practice in integrative medicine.',
          website: 'https://functionalhealth.org',
          avatarInitials: 'SJ',
          isVerified: true,
          isFounding: true,
          events: {
            create: [
              {
                title: 'UK Gut Health & Microbiome Summit 2026',
                description: '3 days of clinical masterclasses covering dysbiosis, small intestinal bacterial overgrowth, and dietary interventions.',
                date: 'OCTOBER 14-16, 2026',
                location: 'ROYAL COLLEGE OF PHYSICIANS',
                imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800',
                price: 120.00,
              }
            ]
          },
          videos: {
            create: [
              {
                title: 'Introduction to Microbiome Restoration',
                description: 'A deep dive into the foundational elements of gut health.',
                thumbnailUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800',
                videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
                isFree: true,
              }
            ]
          }
        }
      }
    },
  })
  console.log('Created Organiser:', sarahUser.email)

  // 3. Create another dummy Organiser
  const markUser = await prisma.user.upsert({
    where: { email: 'mark.davidson@example.com' },
    update: {},
    create: {
      email: 'mark.davidson@example.com',
      password: 'mark',
      role: 'ORGANISER',
      organiserProfile: {
        create: {
          slug: 'mark-davidson',
          name: 'Mark Davidson',
          organization: 'Longevity Tech Network',
          bio: 'Exploring the intersection of human longevity and biohacking technologies.',
          avatarInitials: 'MD',
          isVerified: false,
          isFounding: false,
        }
      }
    },
  })
  console.log('Created Organiser:', markUser.email)

  console.log('Seeding completed successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
