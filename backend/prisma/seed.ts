import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const founderPassword = await bcrypt.hash('FounderMasterPassword123!', 10);
  const founder = await prisma.user.upsert({
    where: { email: 'founder@nevora.com' },
    update: {},
    create: {
      email: 'founder@nevora.com',
      password: founderPassword,
      name: 'Nevora Founder',
      role: UserRole.FOUNDER,
      wallet: {
        create: {
          balanceNEV: 0,
        },
      },
    },
  });

  const producer1 = await prisma.user.upsert({
    where: { email: 'producer1@nevora.com' },
    update: {},
    create: {
      email: 'producer1@nevora.com',
      password: await bcrypt.hash('ProducerPass123', 10),
      name: 'Produtor 1',
      role: UserRole.PRODUCER,
      wallet: { create: { balanceNEV: 0 } },
    },
  });

  const producer2 = await prisma.user.upsert({
    where: { email: 'producer2@nevora.com' },
    update: {},
    create: {
      email: 'producer2@nevora.com',
      password: await bcrypt.hash('ProducerPass123', 10),
      name: 'Produtor 2',
      role: UserRole.PRODUCER,
      wallet: { create: { balanceNEV: 0 } },
    },
  });

  const ambassador = await prisma.user.upsert({
    where: { email: 'ambassador@nevora.com' },
    update: {},
    create: {
      email: 'ambassador@nevora.com',
      password: await bcrypt.hash('AmbassadorPass123', 10),
      name: 'Embaixador',
      role: UserRole.AMBASSADOR,
      wallet: { create: { balanceNEV: 0 } },
    },
  });

  const client = await prisma.user.upsert({
    where: { email: 'cliente@nevora.com' },
    update: {},
    create: {
      email: 'cliente@nevora.com',
      password: await bcrypt.hash('ClientePass123', 10),
      name: 'Cliente',
      role: UserRole.CLIENT,
      wallet: { create: { balanceNEV: 0 } },
    },
  });

  const demoEvent = await prisma.event.upsert({
    where: { id: 'demo-event' },
    update: {},
    create: {
      id: 'demo-event',
      title: 'Evento de Demonstração Nevora',
      description: 'Evento inicial para validar integrações do app.',
      basePrice: 100,
      producerId: producer1.id,
      analytics: { create: {} },
    },
  });

  await prisma.eventAnalytics.upsert({
    where: { eventId: demoEvent.id },
    update: {},
    create: {
      eventId: demoEvent.id,
    },
  });

  await prisma.transaction.createMany({
    data: [
      { walletId: founder.wallet!.id, amount: 0, type: 'CREDIT', description: 'Initial founder wallet' },
    ],
    skipDuplicates: true,
  });

  console.log('Seed completed:', {
    founder: founder.email,
    producers: [producer1.email, producer2.email],
    ambassador: ambassador.email,
    client: client.email,
    demoEvent: demoEvent.title,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
