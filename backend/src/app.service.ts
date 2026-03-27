import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Totem Backend rodando na porta 3001 (Integração SQL Server Ativa)';
  }
}
