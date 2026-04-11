import { Module } from '@nestjs/common';
import { FilaService } from './fila.service';
import { FilaController } from './fila.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [FilaService],
  controllers: [FilaController]
})
export class FilaModule {}
