import { Controller, Get, Post, Body, Patch, Param, Query } from '@nestjs/common';
import { FilaService } from './fila.service';
import { StatusFila } from '@prisma/client';

@Controller('fila')
export class FilaController {
    constructor(private readonly filaService: FilaService) { }

    @Post()
    create(@Body() createFilaDto: any) {
        return this.filaService.create(createFilaDto);
    }

    @Get()
    findAll(@Query('medicoId') medicoId?: string) {
        return this.filaService.findAll(medicoId);
    }

    @Get('tv')
    getChamadasTV() {
        return this.filaService.getChamadasTV();
    }

    @Get('estatisticas')
    getEstatisticas(@Query('medicoId') medicoId: string) {
        return this.filaService.getEstatisticas(medicoId);
    }

    @Get('dashboard')
    getDashboard(@Query('periodo') periodo: string) {
        return this.filaService.getDashboard(periodo);
    }

    @Post('reset')
    resetData() {
        return this.filaService.resetData();
    }

    @Post('limpar-logs')
    limparLogs() {
        return this.filaService.limparLogs();
    }

    @Patch(':id/status')
    updateStatus(@Param('id') id: string, @Body('status') status: StatusFila) {
        return this.filaService.updateStatus(id, status);
    }

    @Patch(':id/chamar')
    chamarPaciente(@Param('id') id: string, @Body('sala') sala: string) {
        return this.filaService.chamarPaciente(id, sala);
    }

    @Post('sessao')
    registrarSessao(@Body() data: { medico_id: string, medico_nome: string, sala: string, setor: string }) {
        return this.filaService.registrarSessao(data);
    }

    @Post('sessao/remover')
    removerSessao(@Body() data: { medico_id: string }) {
        return this.filaService.removerSessao(data.medico_id);
    }
    @Post('medicos')
    createMedico(@Body() data: { nome: string; crm: string; especialidade: string; login: string; senha: string }) {
        return this.filaService.createMedico(data);
    }

    @Post('login')
    async login(@Body() data: { login: string; senha: string }) {
        const medico = await this.filaService.loginMedico(data);
        if (!medico) {
            return { error: 'Credenciais inválidas' };
        }
        return medico;
    }

    @Get('medicos')
    findAllMedicos() {
        return this.filaService.findAllMedicos();
    }
}
