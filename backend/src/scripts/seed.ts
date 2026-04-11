import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = 'admin123';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.medicoIntegracao.upsert({
    where: { codigo: 1 },
    update: {},
    create: {
      codigo: 1,
      nome: 'Administrador NGA',
      senha: hashedPassword,
      role: 'ADMIN',
    },
  });

  console.log('--- SEED OK ---');
  console.log(`Admin: ${admin.nome} (Código: ${admin.codigo})`);
  console.log('----------------');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
