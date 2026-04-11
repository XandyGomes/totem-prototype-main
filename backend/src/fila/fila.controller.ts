import { Controller, Get, Post, Body, Patch, Param, Query, UseGuards, UnauthorizedException } from '@nestjs/common';
import { FilaService } from './fila.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { AuthService } from '../auth/auth.service';

@Controller('fila')
export class FilaController {
    constructor(
        private readonly filaService: FilaService,
        private readonly authService: AuthService
    ) { }

    @Post()
    create(@Body() createFilaDto: any) {
        return this.filaService.create(createFilaDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    findAll(@Query('medicoId') medicoId?: string) {
        return this.filaService.findAll(Number(medicoId));
    }

    @Get('tv')
    getChamadasTV() {
        return this.filaService.getChamadasTV();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('dashboard')
    @Roles('ADMIN')
    getDashboard() {
        return this.filaService.getDashboard();
    }

    @UseGuards(JwtAuthGuard)
    @Patch('chamar')
    chamarPaciente(@Body() body: { compositeKey: any, sala: string }) {
        return this.filaService.chamarPaciente(body.compositeKey, body.sala);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('iniciar')
    iniciarAtendimento(@Body() body: { compositeKey: any }) {
        return this.filaService.iniciarAtendimento(body.compositeKey);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('finalizar')
    finalizarAtendimento(@Body() body: { compositeKey: any }) {
        return this.filaService.finalizarAtendimento(body.compositeKey);
    }

    @UseGuards(JwtAuthGuard)
    @Post('sessao')
    registrarSessao(@Body() data: { medico_id: string, medico_nome: string, sala: string, setor: string }) {
        return this.filaService.registrarSessao(data);
    }

    @UseGuards(JwtAuthGuard)
    @Post('sessao/remover')
    removerSessao(@Body() data: { medico_id: string }) {
        return this.filaService.removerSessao(data.medico_id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('medicos')
    @Roles('ADMIN')
    findAllMedicos() {
        return this.filaService.findAllMedicos();
    }

    @Post('login')
    async login(@Body() data: { login: string; senha: string }) {
        const user = await this.authService.validateUser(Number(data.login), data.senha);
        if (!user) {
            throw new UnauthorizedException('Credenciais inválidas');
        }
        return this.authService.login(user);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Post('reset')
    reset() {
        return this.filaService.reset();
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    @Post('limpar-logs')
    limparLogs() {
        return this.filaService.limparLogs();
    }

    @Post('cadastrar')
    async cadastrar(@Body() data: any) {
        return this.filaService.cadastrar(data);
    }
}
