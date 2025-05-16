import { eventsSeed } from './event-seed.js';
import { usersSeed } from './user-seed.js';
import bcrypt from 'bcrypt';
import {
  Prisma,
  PrismaClient,
  UserRole,
} from '../../src/generated/mongo/client.js';

class DatabaseSeeder {
  private readonly saltRounds = 10;

  constructor(private readonly prisma: PrismaClient) {}

  async execute() {
    console.log(`Start seeding ...`);
    await this.seedUsers();
    await this.seedEvents();
    console.log(`Seeding finished.`);
  }

  private async seedUsers() {
    console.log(`Creating ${usersSeed.length} users...`);
    for (const userData of usersSeed) {
      const hashedPassword = await bcrypt.hash(
        userData.password,
        this.saltRounds,
      );
      await this.prisma.user.upsert({
        where: { email: userData.email },
        update: {
          username: userData.username,
          password: hashedPassword,
          role: userData.role as UserRole,
        },
        create: {
          email: userData.email,
          username: userData.username,
          password: hashedPassword,
          role: userData.role as UserRole,
        },
      });
    }
    console.log(`Users seeded or updated.`);
  }

  private async seedEvents() {
    console.log(`Creating ${eventsSeed.length} events with their rewards...`);
    for (const eventData of eventsSeed) {
      const { rewardsToCreate, ...eventDetails } = eventData;

      const rewardsInput = rewardsToCreate.map((reward: any) => ({
        name: reward.name,
        type: reward.type,
        quantity: reward.quantity,
        externalItemId: reward.externalItemId,
        rewardOrder: reward.rewardOrder,
        //
      })) as Prisma.RewardCreateWithoutEventInput[];

      await this.prisma.event.create({
        data: {
          ...eventDetails,
          rewards: {
            create: rewardsInput,
          },
        },
      });
    }
    console.log(`Events and rewards seeded.`);
  }
}

console.log('process.env.DATABASE_URL', process.env.DATABASE_URL);

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});
const seeder = new DatabaseSeeder(prisma);

seeder
  .execute()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
