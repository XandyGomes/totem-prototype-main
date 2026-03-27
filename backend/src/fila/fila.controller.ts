import { Controller, Get, Post, Body, Patch, Param, Query } from '@nestjs/common';
import { FilaService } from './fila.service';

@Controller('fila')
export class FilaController {
    constructor(private readonly filaService: FilaService) { }

    @Post()
    create(@Body() createFilaDto: any) {
        return this.filaService.create(createFilaDto);
    }

    @Get()
    findAll(@Query('medicoId') medicoId?: string) {
        return this.filaService.findAll(Number(medicoId));
    }

    @Get('tv')
    getChamadasTV() {
        return this.filaService.getChamadasTV();
    }

    @Get('dashboard')
    getDashboard() {
        return this.filaService.getDashboard();
    }

    // Adaptado para simular o "Chamar" do SIGS usando a consulta
    @Patch('chamar')
    chamarPaciente(@Body() body: { compositeKey: any, sala: string }) {
        return this.filaService.chamarPaciente(body.compositeKey, body.sala);
    }

    @Patch('iniciar')
    iniciarAtendimento(@Body() body: { compositeKey: any }) {
        return this.filaService.iniciarAtendimento(body.compositeKey);
    }

    @Patch('finalizar')
    finalizarAtendimento(@Body() body: { compositeKey: any }) {
        return this.filaService.finalizarAtendimento(body.compositeKey);
    }

    @Post('sessao')
    registrarSessao(@Body() data: { medico_id: string, medico_nome: string, sala: string, setor: string }) {
        return this.filaService.registrarSessao(data);
    }

    @Post('sessao/remover')
    removerSessao(@Body() data: { medico_id: string }) {
        return this.filaService.removerSessao(data.medico_id);
    }

    @Get('medicos')
    findAllMedicos() {
        return this.filaService.findAllMedicos();
    }

    @Post('login')
    async login(@Body() data: { login: string; senha: string }) {
        const medico = await this.filaService.loginMedico(data);
        if (!medico) {
            return { error: 'Credenciais inválidas' };
        }
        return medico;
    }

    @Post('reset')
    reset() {
        return this.filaService.reset();
    }

    @Post('limpar-logs')
    limparLogs() {
        return this.filaService.limparLogs();
    }
}
