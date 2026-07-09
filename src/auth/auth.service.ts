import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string) {
    const findUser = await this.prisma.user.findUnique({ where: { email } });
    if (!findUser) throw new UnauthorizedException('Credenciales inválidas');

    const isMatch = await bcrypt.compare(password, findUser.passwordHash);
    if (!isMatch) throw new UnauthorizedException('Credenciales inválidas');

    const payload = {
      sub: findUser.id,
      role: findUser.role,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return {
      access_token: accessToken,
    };
  }
}
