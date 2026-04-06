import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword } from '../utils/hash';

export class AuthService {
  constructor(private prisma: PrismaClient) {}

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async register(data: { email: string; password: string; name: string }) {
    const existingUser = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await hashPassword(data.password);
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        role: 'customer',
      },
    });

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new Error('User not found');
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}