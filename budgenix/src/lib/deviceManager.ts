import prisma from "@/lib/prisma";
import { getBrowserFromUserAgent, getDeviceNameFromUserAgent, getClientIP } from "@/lib/deviceDetection";

export async function registerOrUpdateDevice(userId: string, req: Request) {
  const userAgent = req.headers.get('user-agent') || 'Unknown';
  const deviceName = getDeviceNameFromUserAgent(userAgent);
  const browser = getBrowserFromUserAgent(userAgent);
  const ipAddress = getClientIP(req);

  // Try to find existing device with same browser and device name
  const existingDevice = await prisma.userDevice.findFirst({
    where: {
      userId,
      deviceName,
      browser
    }
  });

  if (existingDevice) {
    // Update existing device
    await prisma.userDevice.update({
      where: { id: existingDevice.id },
      data: {
        ipAddress,
        lastActiveAt: new Date()
      }
    });
  } else {
    // Create new device
    await prisma.userDevice.create({
      data: {
        userId,
        deviceName,
        browser,
        ipAddress
      }
    });
  }
}
