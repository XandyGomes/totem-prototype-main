import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { SigsService } from './sigs.service';

@Controller('sigs')
export class SigsController {
    constructor(private readonly sigsService: SigsService) { }

    @Get()
    findAll() {
        return this.sigsService.findAll();
    }

    @Get('buscar')
    findByCpf(@Query('cpf') cpf: string) {
        return this.sigsService.findByCpf(cpf);
    }

    @Post()
    create(@Body() data: any) {
        return this.sigsService.create(data);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() data: any) {
        return this.sigsService.update(id, data);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.sigsService.delete(id);
    }

    @Post(':id/check-in')
    checkIn(@Param('id') id: string) {
        return this.sigsService.checkIn(id);
    }
}
