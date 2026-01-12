import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { FilaModule } from './fila/fila.module';
import { SigsModule } from './sigs/sigs.module';

@Module({
  imports: [PrismaModule, FilaModule, SigsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
