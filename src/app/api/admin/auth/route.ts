import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { username, password, ipAddress } = data;

    // Seed admin if it doesn't exist
    let admin = await prisma.user.findUnique({
      where: { email: 'admin@healthsummits.tv' }
    });

    if (!admin) {
      admin = await prisma.user.create({
        data: {
          email: 'admin@healthsummits.tv',
          password: 'admin', // default password
          role: 'ADMIN'
        }
      });
    }

    if (username === 'admin' && password === admin.password) {
      // Log success
      await prisma.securityLog.create({
        data: {
          event: 'LOGIN_SUCCESS',
          ipAddress: ipAddress || 'Unknown',
          userId: admin.id,
          details: 'Admin successfully logged in.'
        }
      });
      return NextResponse.json({ success: true });
    } else {
      // Log failure
      await prisma.securityLog.create({
        data: {
          event: 'LOGIN_FAILED',
          ipAddress: ipAddress || 'Unknown',
          details: `Failed login attempt for username: ${username}`
        }
      });
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
  } catch (error) {
    console.error("Auth error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
