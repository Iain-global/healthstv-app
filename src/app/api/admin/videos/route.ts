import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

async function verifyAdmin() {
  const cookieStore = await cookies();
  return cookieStore.get('adminAuth')?.value === 'true';
}

export async function POST(request: Request) {
  if (!(await verifyAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await request.json();
    
    // Check if it's an approval toggle
    if (data.id && data.isApproved !== undefined) {
      const video = await prisma.video.update({
        where: { id: data.id },
        data: { isApproved: data.isApproved },
        include: { organiser: true }
      });
      return NextResponse.json(video);
    }
    
    // Otherwise it's a create
    if (!data.id) {
      const isFree = data.isFree !== undefined ? Boolean(data.isFree) : true;
      const price = !isFree && data.price ? parseFloat(data.price) : 0;
      const video = await prisma.video.create({
        data: {
          title: data.title,
          category: data.category,
          isFree,
          price,
          videoUrl: data.videoUrl,
          thumbnailUrl: data.thumbnailUrl,
          description: data.description || "",
          organiserId: parseInt(data.organiserId),
          isApproved: true // new platform videos are approved by default
        },
        include: { organiser: true }
      });
      return NextResponse.json(video);
    }

  } catch (error) {
    console.error("Error creating/updating video", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!(await verifyAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const data = await request.json();
    
    if (data.id) {
      const isFree = data.isFree !== undefined ? Boolean(data.isFree) : undefined;
      const price = data.price !== undefined ? (isFree === false ? parseFloat(data.price) : 0) : undefined;
      const video = await prisma.video.update({
        where: { id: data.id },
        data: {
          title: data.title,
          category: data.category,
          ...(isFree !== undefined ? { isFree } : {}),
          ...(price !== undefined ? { price } : {}),
          videoUrl: data.videoUrl,
          thumbnailUrl: data.thumbnailUrl,
          description: data.description,
          organiserId: parseInt(data.organiserId)
        },
        include: { organiser: true }
      });
      return NextResponse.json(video);
    }
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  } catch (error) {
    console.error("Error updating video", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await verifyAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (id) {
      await prisma.video.delete({
        where: { id: parseInt(id) }
      });
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  } catch (error) {
    console.error("Error deleting video", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
