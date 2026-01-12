import { Module } from '@nestjs/common';
import { SigsService } from './sigs.service';
import { SigsController } from './sigs.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [SigsController],
    providers: [SigsService],
    exports: [SigsService],
})
export class SigsModule { }
