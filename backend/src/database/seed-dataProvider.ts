import 'dotenv/config';
import dataSource from './data-source';
import { Provider } from '../features/providers/entities/provider.entity';

type SeedProvider = {
  id: string;
  name: string;
  address: string;
  description: string;
  imageUrl: string;
};

/**
 * Demo providers used by the provider/category/service seed files.
 * The fixed IDs make relationships between seed files predictable.
 */
const seedProviders: SeedProvider[] = [
  {
    id: '11111111-1111-4111-8111-111111111111',
    name: 'Sunrise Hotel',
    address: '12 Nguyen Hue, District 1, Ho Chi Minh City',
    description: 'A central hotel with accommodation and wellness services.',
    imageUrl: 'https://images.example.com/providers/sunrise-hotel.jpg',
  },
  {
    id: '22222222-2222-4222-8222-222222222222',
    name: 'Green Bay Resort',
    address: '88 Tran Phu, Nha Trang, Khanh Hoa',
    description: 'A seaside resort offering relaxation and family services.',
    imageUrl: 'https://images.example.com/providers/green-bay-resort.jpg',
  },
];

async function seedProvider(
  repository: ReturnType<typeof dataSource.getRepository<Provider>>,
  input: SeedProvider,
): Promise<void> {
  const existing = await repository.findOne({
    where: { name: input.name, address: input.address },
  });

  const provider = repository.create({
    ...(existing ?? {}),
    id: existing?.id ?? input.id,
    name: input.name,
    address: input.address,
    description: input.description,
    imageUrl: input.imageUrl,
  });

  await repository.save(provider);
  console.log(`${existing ? 'Updated' : 'Created'} provider: ${input.name}`);
}

async function main(): Promise<void> {
  await dataSource.initialize();

  try {
    const repository = dataSource.getRepository(Provider);

    for (const provider of seedProviders) {
      await seedProvider(repository, provider);
    }
  } finally {
    await dataSource.destroy();
  }
}

main().catch((error: unknown) => {
  console.error('Failed to seed providers:', error);
  process.exitCode = 1;
});
