import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const maintenanceSetting = await prisma.systemSetting.findUnique({
      where: { id: 'MAINTENANCE_MODE' }
    });
    return NextResponse.json({ maintenanceMode: maintenanceSetting?.value === 'true' });
  } catch (error) {
    console.error("Settings GET error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Toggle Maintenance Mode
    if ('maintenanceMode' in data) {
      await prisma.systemSetting.upsert({
        where: { id: 'MAINTENANCE_MODE' },
        update: { value: data.maintenanceMode ? 'true' : 'false' },
        create: { id: 'MAINTENANCE_MODE', value: data.maintenanceMode ? 'true' : 'false' }
      });
      
      await prisma.securityLog.create({
        data: {
          event: 'SETTINGS_CHANGED',
          ipAddress: data.ipAddress || 'Unknown',
          details: `Maintenance Mode set to ${data.maintenanceMode}`
        }
      });
      return NextResponse.json({ success: true });
    }

    // Change Admin Password
    if (data.currentPassword && data.newPassword) {
      const admin = await prisma.user.findUnique({ where: { email: 'admin@healthsummits.tv' } });
      if (!admin || admin.password !== data.currentPassword) {
        return NextResponse.json({ error: 'Invalid current password' }, { status: 401 });
      }

      await prisma.user.update({
        where: { id: admin.id },
        data: { password: data.newPassword }
      });

      await prisma.securityLog.create({
        data: {
          event: 'PASSWORD_CHANGED',
          ipAddress: data.ipAddress || 'Unknown',
          userId: admin.id,
          details: 'Admin password was updated.'
        }
      });
      
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Bad Request" }, { status: 400 });
  } catch (error) {
    console.error("Settings POST error", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
