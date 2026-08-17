import { prisma } from '../src/lib/prisma';

async function main() {
  console.log("Seeding legacy data...");

  // 1. Create Users & Organiser Profiles
  
  const orgsData = [
    { name: "HealthSummits.tv", org: "HealthSummits Team", slug: "healthsummits" },
    { name: "Dr. Sarah Jenkins", org: "Functional Medicine Institute UK", slug: "sarah-jenkins" },
    { name: "Prof. Liam Vance", org: "UK Longevity & Cellular Forum", slug: "liam-vance" },
    { name: "Coach Marcus Thorne", org: "Integrative Health UK Summit", slug: "marcus-thorne" },
    { name: "Fiona Gallagher", org: "Natural Wellness UK", slug: "fiona-gallagher" },
    { name: "Jeanette Cole", org: "Herbal Health UK", slug: "jeanette-cole" }
  ];

  const createdOrgs: Record<string, any> = {};

  for (const o of orgsData) {
    let orgProfile = await prisma.organiserProfile.findUnique({
      where: { slug: o.slug }
    });

    if (!orgProfile) {
      const user = await prisma.user.create({
        data: {
          username: o.slug.split('-')[0],
          email: `${o.slug}@example.com`,
          password: o.slug.split('-')[0],
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
      orgProfile = user.organiserProfile;
    } else {
      // Update existing user password and username
      await prisma.user.update({
        where: { id: orgProfile.userId },
        data: { 
          username: o.slug.split('-')[0],
          password: o.slug.split('-')[0] 
        }
      });
    }
    
    if (orgProfile) {
      createdOrgs[o.slug] = orgProfile;
    }
  }

  // 2. Create Videos
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
      console.log(`Created video: ${v.title}`);
    } else {
      console.log(`Video already exists: ${v.title}`);
    }
  }

  console.log("Seeding complete!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
