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
    update: { username: 'sarah' },
    create: {
      username: 'sarah',
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
                videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
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
    update: { username: 'mark' },
    create: {
      username: 'mark',
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

  // 4. Create Legacy Organisers
  const orgsData = [
    { name: "HealthSummits.tv", org: "HealthSummits Team", slug: "healthsummits" },
    { name: "Prof. Liam Vance", org: "UK Longevity & Cellular Forum", slug: "liam-vance" },
    { name: "Coach Marcus Thorne", org: "Integrative Health UK Summit", slug: "marcus-thorne" },
    { name: "Fiona Gallagher", org: "Natural Wellness UK", slug: "fiona-gallagher" },
    { name: "Jeanette Cole", org: "Herbal Health UK", slug: "jeanette-cole" }
  ];

  const createdOrgs: Record<string, any> = {
    'sarah-jenkins': sarahUser.organiserProfile ? sarahUser.organiserProfile[0] || (await prisma.organiserProfile.findUnique({where: {slug: 'sarah-jenkins'}})) : await prisma.organiserProfile.findUnique({where: {slug: 'sarah-jenkins'}})
  };

  for (const o of orgsData) {
    const pwd = o.slug.split('-')[0];
    const user = await prisma.user.upsert({
      where: { email: `${o.slug}@example.com` },
      update: {
        username: pwd,
        password: pwd
      },
      create: {
        username: pwd,
        email: `${o.slug}@example.com`,
        password: pwd,
        role: 'ORGANISER',
        organiserProfile: {
          create: {
            slug: o.slug,
            name: o.name,
            organization: o.org,
            isVerified: true
          }
        }
      },
      include: { organiserProfile: true }
    });
    createdOrgs[o.slug] = user.organiserProfile;
    console.log('Created Organiser:', user.email);
  }

  // 5. Create Legacy Videos
  const videosData = [
    {
      title: "Timeline 1",
      description: "Special feature presentation and video timeline stream from HealthSummits.tv.",
      thumbnailUrl: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800",
      videoUrl: "https://play.webvideocore.net/popplayer.php?it=g5tf7vci5y8g&is_link=1&w=720&h=405&pause=1",
      category: "Featured",
      isFree: true,
      organiserId: createdOrgs['healthsummits'].id
    },
    {
      title: "HeathSummit.TV Advert",
      description: "Watch the official introductory preview and advert for HealthSummits.tv.",
      thumbnailUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=800",
      videoUrl: "https://play.webvideocore.net/popplayer.php?it=71l483wh19ss&is_link=1&w=720&h=405&pause=1",
      category: "Featured",
      isFree: true,
      organiserId: createdOrgs['healthsummits'].id
    },
    {
      title: "Introduction to Cellular Detoxification & Natural Health",
      description: "Official broadcast showcasing clinical detoxification, cellular regeneration, and integrative medicine.",
      thumbnailUrl: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800",
      videoUrl: "https://play.webvideocore.net/popplayer.php?it=71l483wh19ss&is_link=1&w=720&h=405&pause=1",
      category: "Functional Medicine",
      isFree: true,
      organiserId: createdOrgs['sarah-jenkins'].id
    },
    {
      title: "Circadian Rhythm & Optimizing Melatonin",
      description: "Prof. Liam Vance discusses light hygiene, sleep architecture, and cellular repair.",
      thumbnailUrl: "https://images.unsplash.com/photo-1511295742364-92767fa62d9f?q=80&w=800",
      videoUrl: "https://play.webvideocore.net/popplayer.php?it=g5tf7vci5y8g&is_link=1&w=720&h=405&pause=1",
      category: "Longevity",
      isFree: true,
      organiserId: createdOrgs['liam-vance'].id
    },
    {
      title: "Understanding Food Label Pitfalls",
      description: "A practical guide to decoding deceptive marketing terms on food packaging and avoiding seed oils.",
      thumbnailUrl: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?q=80&w=800",
      videoUrl: "https://play.webvideocore.net/popplayer.php?it=71l483wh19ss&is_link=1&w=720&h=405&pause=1",
      category: "Nutrition",
      isFree: true,
      organiserId: createdOrgs['marcus-thorne'].id
    },
    {
      title: "Breathing Protocols for Vagus Activation",
      description: "Physiological techniques to stimulate vagal tone and improve heart rate variability.",
      thumbnailUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800",
      videoUrl: "https://play.webvideocore.net/popplayer.php?it=g5tf7vci5y8g&is_link=1&w=720&h=405&pause=1",
      category: "Mental Wellbeing",
      isFree: true,
      organiserId: createdOrgs['fiona-gallagher'].id
    },
    {
      title: "Herbal Extracts & Infusion Basics",
      description: "An introduction to water infusions, decoctions, and tincture preparations using UK plants.",
      thumbnailUrl: "https://images.unsplash.com/photo-1512438248247-f0f2a5a8b7f0?q=80&w=800",
      videoUrl: "https://play.webvideocore.net/popplayer.php?it=71l483wh19ss&is_link=1&w=720&h=405&pause=1",
      category: "Natural Medicine",
      isFree: true,
      organiserId: createdOrgs['jeanette-cole'].id
    }
  ];

  for (const v of videosData) {
    const exists = await prisma.video.findFirst({ where: { title: v.title } });
    if (!exists) {
      await prisma.video.create({
        data: {
          ...v,
          isApproved: true
        }
      });
      console.log(`Created legacy video: ${v.title}`);
    }
  }

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
