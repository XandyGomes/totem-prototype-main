import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { FilaModule } from './fila/fila.module';
import { SigsModule } from './sigs/sigs.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [PrismaModule, FilaModule, SigsModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
