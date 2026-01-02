import { Module } from '@nestjs/common';
import { FilaService } from './fila.service';
import { FilaController } from './fila.controller';

@Module({
  providers: [FilaService],
  controllers: [FilaController]
})
export class FilaModule {}
