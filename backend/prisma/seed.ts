import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('--- Iniciando Sincronização de Banco de Dados ---');

    // 1. Limpar dados antigos
    await prisma.consultaIntegracao.deleteMany({});
    await prisma.pacienteIntegracao.deleteMany({});
    await prisma.medicoIntegracao.deleteMany({});
    await prisma.unidadeIntegracao.deleteMany({});

    // 2. Criar Unidade
    const unidade = await prisma.unidadeIntegracao.create({
        data: {
            codigo: 101,
            nome: 'NGA 16 - FRANCA',
            setor: 'CLÍNICA GERAL'
        }
    });

    // 3. Criar Médico
    const medico = await prisma.medicoIntegracao.create({
        data: {
            codigo: 500,
            nome: 'MARCOS SILVA'
        }
    });

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    // 4. Criar Pacientes e Agendamentos
    const pacientesData = [
        { matricula: 1001, nome: 'ALEXANDRE GOMES', cpf: '12345678901', hora: 800 }, // 08:00
        { matricula: 1002, nome: 'MARIA OLIVEIRA', cpf: '98765432100', hora: 830 },
        { matricula: 1003, nome: 'JOAO SOUZA', cpf: '11122233344', hora: 900 },
        { matricula: 1004, nome: 'ANA REGINA', cpf: '55566677788', hora: 930 },
        { matricula: 1005, nome: 'PEDRO SANTOS', cpf: '99988877766', hora: 1000 }
    ];

    for (const p of pacientesData) {
        await prisma.pacienteIntegracao.create({
            data: {
                matricula: p.matricula,
                nome: p.nome,
                cpf: p.cpf,
                dataNascimento: new Date(1990, 1, 1)
            }
        });

        await prisma.consultaIntegracao.create({
            data: {
                matricula_paciente: p.matricula,
                codigo_medico: medico.codigo,
                codigo_unidade: unidade.codigo,
                data: hoje,
                hora: p.hora,
                presencaConfirmada: 'N'
            }
        });
        console.log(`- Criado agendamento para ${p.nome} (CPF: ${p.cpf})`);
    }

    console.log('--- Seed Finalizado com Sucesso! ---');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
