import * as sql from 'mssql';

const config: sql.config = {
    user: 'petsaude',
    password: 'petSaude@2026',
    server: '172.21.31.107',
    // port: 1433, // Default port
    options: {
        encrypt: false, // Frequentemente desabilitado em conexões locais/VPN
        trustServerCertificate: true, // Necessário para evitar erros de certificado auto-assinado
    }
};

async function runDiagnostics() {
    console.log('--- TESTE DE CONEXÃO SQL SERVER (PREFEITURA) ---');
    console.log(`Tentando conectar ao servidor: ${config.server}`);

    try {
        const pool = await sql.connect(config);
        console.log('✅ Conexão estabelecida com sucesso!');

        // 1. Identificar o Banco de Dados atual
        const currentDbResult = await pool.request().query('SELECT DB_NAME() as currentDb');
        const currentDb = currentDbResult.recordset[0].currentDb;
        console.log(`\n📂 Você está conectado ao banco: "${currentDb}"`);

        // 2. Tentar listar as tabelas do banco atual
        try {
            console.log('\n--- 📋 Primeiras 20 tabelas encontradas:');
            const tables = await pool.request().query('SELECT TOP 20 TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = \'BASE TABLE\' ORDER BY TABLE_NAME');
            
            if (tables.recordset.length === 0) {
                console.log('⚠️ Nenhuma tabela encontrada no contexto atual.');
            } else {
                tables.recordset.forEach(t => console.log(` - ${t.TABLE_NAME}`));
            }
        } catch (tableErr) {
            console.error('\n❌ Erro ao listar tabelas: Talvez o usuário não tenha permissão de leitura no INFORMATION_SCHEMA.');
        }

        // 3. Tentar listar outros bancos (opcional - pode falhar se não tiver acesso ao master)
        try {
            console.log('\n--- 📁 Outros bancos (tentando carregar):');
            const dbs = await pool.request().query('SELECT name FROM sys.databases WHERE database_id > 4');
            dbs.recordset.forEach(db => console.log(` - ${db.name}`));
        } catch (dbErr) {
            console.log('\nℹ️ Não foi possível listar outros bancos de dados (acesso restrito ao master).');
        }

        await pool.close();
        console.log('\n--- FIM DOS TESTES ---');
    } catch (err) {
        console.error('\n❌ Erro durante o diagnóstico:');
        if (err instanceof Error) {
            console.error(err.message);
        } else {
            console.error(err);
        }
        console.log('\n💡 DICA: Verifique se a VPN está ativa e se o IP 172.21.31.107 está acessível (tente dar um ping no terminal).');
    }
}

runDiagnostics();
