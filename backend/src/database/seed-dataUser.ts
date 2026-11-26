import 'dotenv/config';
import { PasswordHasher } from '@nestjs/authentication';
import { Repository } from 'typeorm';
import dataSource from './data-source';
import { Role } from '../common/enums/role.enum';
import { User } from '../features/users/entities/user.entity';

type SeedUser = {
  fullName: string;
  email: string;
  password: string;
  role: Role;
};

const seedUsers: SeedUser[] = [
  {
    fullName: 'System Administrator',
    email: process.env.SEED_ADMIN_EMAIL ?? 'admin@booking.local',
    password: process.env.SEED_ADMIN_PASSWORD ?? 'Admin@12345!',
    role: Role.ADMIN,
  },
  {
    fullName: 'Booking Staff',
    email: process.env.SEED_STAFF_EMAIL ?? 'staff@booking.local',
    password: process.env.SEED_STAFF_PASSWORD ?? 'Staff@12345!',
    role: Role.STAFF,
  },
  {
    fullName: 'Customer One',
    email: process.env.SEED_CUSTOMER_1_EMAIL ?? 'customer1@booking.local',
    password: process.env.SEED_CUSTOMER_1_PASSWORD ?? 'Customer@12345!',
    role: Role.CUSTOMER,
  },
  {
    fullName: 'Customer Two',
    email: process.env.SEED_CUSTOMER_2_EMAIL ?? 'customer2@booking.local',
    password: process.env.SEED_CUSTOMER_2_PASSWORD ?? 'Customer@12345!',
    role: Role.CUSTOMER,
  },
];

async function seedUser(
  repository: Repository<User>,
  passwordHasher: PasswordHasher,
  input: SeedUser,
): Promise<void> {
  const email = input.email.trim().toLowerCase();
  const existing = await repository.findOneBy({ email });

  if (existing) {
    existing.fullName = input.fullName;
    existing.role = input.role;
    await repository.save(existing);
    console.log(`Skipped existing ${input.role.toLowerCase()} user: ${email}`);
    return;
  }

  const user = repository.create({
    fullName: input.fullName,
    email,
    passwordHash: await passwordHasher.hash(input.password),
    role: input.role,
  });

  await repository.save(user);
  console.log(`Created ${input.role.toLowerCase()} user: ${email}`);
}

async function main(): Promise<void> {
  await dataSource.initialize();

  try {
    const repository = dataSource.getRepository(User);
    const passwordHasher = new PasswordHasher();

    for (const user of seedUsers) {
      await seedUser(repository, passwordHasher, user);
    }
  } finally {
    await dataSource.destroy();
  }
}

main().catch((error: unknown) => {
  console.error('Failed to seed users:', error);
  process.exitCode = 1;
});
