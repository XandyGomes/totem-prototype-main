import { Controller, Get, Post, Body, Query, Delete, Param } from '@nestjs/common';
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

    @Post('check-in')
    checkIn(@Body() body: {
        matricula_paciente: number;
        codigo_medico: number;
        codigo_unidade: number;
        data: string;
        hora: number;
    }) {
        return this.sigsService.checkIn(
            body.matricula_paciente,
            body.codigo_medico,
            body.codigo_unidade,
            new Date(body.data),
            body.hora
        );
    }

    @Post()
    create(@Body() body: any) {
        return this.sigsService.create(body);
    }

    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.sigsService.delete(id);
    }
}
