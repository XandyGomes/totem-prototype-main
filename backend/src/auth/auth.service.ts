import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) { }

  async validateUser(codigo: number, pass: string): Promise<any> {
    const user = await this.prisma.medicoIntegracao.findUnique({
      where: { codigo },
    });

    if (user && user.senha) {
      const isMatch = await bcrypt.compare(pass, user.senha);
      if (isMatch) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { senha, ...result } = user;
        return result;
      }
    }
    
    return null;
  }

  async login(user: any) {
    const payload = { username: user.nome, sub: user.codigo, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.codigo,
        nome: user.nome,
        role: user.role
      }
    };
  }
}
