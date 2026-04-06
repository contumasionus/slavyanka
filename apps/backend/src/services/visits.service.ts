import { PrismaClient } from '@prisma/client';

export class VisitsService {
  constructor(private prisma: PrismaClient) {}

  async trackVisit(userId: string) {
    return this.prisma.userVisit.create({
      data: {
        userId,
      },
    });
  }

  async getVisitStats(userId: string) {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [totalVisits, weeklyVisits, monthlyVisits] = await Promise.all([
      this.prisma.userVisit.count({
        where: { userId },
      }),
      this.prisma.userVisit.count({
        where: {
          userId,
          visitedAt: { gte: weekAgo },
        },
      }),
      this.prisma.userVisit.count({
        where: {
          userId,
          visitedAt: { gte: monthAgo },
        },
      }),
    ]);

    return {
      totalVisits,
      weeklyVisits,
      monthlyVisits,
    };
  }

  async getRecentVisits(userId: string, limit: number = 10) {
    return this.prisma.userVisit.findMany({
      where: { userId },
      orderBy: { visitedAt: 'desc' },
      take: limit,
    });
  }
}