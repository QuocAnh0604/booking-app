import 'dotenv/config';
import dataSource from './data-source';
import { Category } from '../features/categories/entities/category.entity';
import { Provider } from '../features/providers/entities/provider.entity';

type SeedCategory = {
  id: string;
  providerId: string;
  name: string;
  description: string;
};

const seedCategories: SeedCategory[] = [
  {
    id: 'a1111111-1111-4111-8111-111111111111',
    providerId: '11111111-1111-4111-8111-111111111111',
    name: 'Spa & Wellness',
    description: 'Dịch vụ thư giãn và chăm sóc sức khỏe.',
  },
  {
    id: 'a2222222-2222-4222-8222-222222222222',
    providerId: '11111111-1111-4111-8111-111111111111',
    name: 'Ẩm thực',
    description: 'Nhà hàng, bữa sáng và dịch vụ ẩm thực tại khách sạn.',
  },
  {
    id: 'a3333333-3333-4333-8333-333333333333',
    providerId: '22222222-2222-4222-8222-222222222222',
    name: 'Hoạt động biển',
    description: 'Các hoạt động giải trí và thể thao trên biển.',
  },
  {
    id: 'a4444444-4444-4444-8444-444444444444',
    providerId: '22222222-2222-4222-8222-222222222222',
    name: 'Gia đình & trẻ em',
    description: 'Dịch vụ phù hợp cho gia đình và trẻ em.',
  },
];

async function main(): Promise<void> {
  await dataSource.initialize();

  try {
    const categoryRepository = dataSource.getRepository(Category);
    const providerRepository = dataSource.getRepository(Provider);

    for (const input of seedCategories) {
      const provider = await providerRepository.findOneBy({ id: input.providerId });
      if (!provider) {
        throw new Error(
          `Provider ${input.providerId} not found. Run seed-dataProvider.ts first.`,
        );
      }

      const category = categoryRepository.create(input);
      await categoryRepository.save(category);
      console.log(`Created or updated category: ${input.name}`);
    }
  } finally {
    await dataSource.destroy();
  }
}

main().catch((error: unknown) => {
  console.error('Failed to seed categories:', error);
  process.exitCode = 1;
});
