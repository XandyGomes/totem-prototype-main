import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
    async onModuleInit() {
        try {
            // Log de diagnóstico (seguro, sem senha)
            const dbUrl = process.env.DATABASE_URL || '';
            const maskedUrl = dbUrl.replace(/:([^@]+)@/, ':****@');
            console.log(`[PRISMA] Tentando conectar ao banco: ${maskedUrl}`);

            await this.$connect();
            console.log('[PRISMA] Conexão com o banco de dados estabelecida com sucesso.');
        } catch (error) {
            console.error('[PRISMA] Erro ao conectar no banco de dados:');
            if (error instanceof Error) {
                console.error(`Mensagem: ${error.message}`);
                // Caso o erro contenha dicas específicas do Prisma
                if (error.message.includes('Tenant or user not found')) {
                    console.error('DICA: O Supabase não reconheceu o ID do projeto no usuário. Verifique se o ID no DATABASE_URL está correto.');
                }
            }
            throw error;
        }
    }
}
