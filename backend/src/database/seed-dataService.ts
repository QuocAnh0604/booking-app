import 'dotenv/config';
import dataSource from './data-source';
import { Category } from '../features/categories/entities/category.entity';
import { Provider } from '../features/providers/entities/provider.entity';
import { Service, ServiceStatus } from '../features/services/entities/service.entity';

type SeedService = {
  id: string;
  providerId: string;
  categoryId: string;
  name: string;
  description: string;
  price: number;
  capacity: number;
};

const seedServices: SeedService[] = [
  {
    id: 'b1111111-1111-4111-8111-111111111111',
    providerId: '11111111-1111-4111-8111-111111111111',
    categoryId: 'a1111111-1111-4111-8111-111111111111',
    name: 'Massage thư giãn toàn thân',
    description: 'Massage toàn thân giúp thư giãn sau một ngày di chuyển.',
    price: 500000,
    capacity: 2,
  },
  {
    id: 'b1111111-1111-4111-8111-111111111112',
    providerId: '11111111-1111-4111-8111-111111111111',
    categoryId: 'a1111111-1111-4111-8111-111111111111',
    name: 'Chăm sóc da mặt',
    description: 'Liệu trình làm sạch và chăm sóc da mặt cơ bản.',
    price: 350000,
    capacity: 2,
  },
  {
    id: 'b1111111-1111-4111-8111-111111111113',
    providerId: '11111111-1111-4111-8111-111111111111',
    categoryId: 'a1111111-1111-4111-8111-111111111111',
    name: 'Xông hơi thư giãn',
    description: 'Phòng xông hơi riêng dành cho khách lưu trú.',
    price: 250000,
    capacity: 4,
  },
  {
    id: 'b2222222-2222-4222-8222-222222222221',
    providerId: '11111111-1111-4111-8111-111111111111',
    categoryId: 'a2222222-2222-4222-8222-222222222222',
    name: 'Buffet sáng',
    description: 'Buffet sáng với món Việt và món quốc tế.',
    price: 180000,
    capacity: 80,
  },
  {
    id: 'b2222222-2222-4222-8222-222222222222',
    providerId: '11111111-1111-4111-8111-111111111111',
    categoryId: 'a2222222-2222-4222-8222-222222222222',
    name: 'Bữa tối set menu',
    description: 'Set menu buổi tối dành cho một người.',
    price: 320000,
    capacity: 60,
  },
  {
    id: 'b2222222-2222-4222-8222-222222222223',
    providerId: '11111111-1111-4111-8111-111111111111',
    categoryId: 'a2222222-2222-4222-8222-222222222222',
    name: 'Ăn tối riêng tại phòng',
    description: 'Phục vụ bữa tối tại phòng theo thực đơn có sẵn.',
    price: 450000,
    capacity: 4,
  },
  {
    id: 'b3333333-3333-4333-8333-333333333331',
    providerId: '22222222-2222-4222-8222-222222222222',
    categoryId: 'a3333333-3333-4333-8333-333333333333',
    name: 'Tour ngắm san hô',
    description: 'Tour nửa ngày khám phá các điểm ngắm san hô gần resort.',
    price: 750000,
    capacity: 12,
  },
  {
    id: 'b3333333-3333-4333-8333-333333333332',
    providerId: '22222222-2222-4222-8222-222222222222',
    categoryId: 'a3333333-3333-4333-8333-333333333333',
    name: 'Thuê kayak đôi',
    description: 'Thuê kayak đôi và áo phao trong khu vực được phép hoạt động.',
    price: 300000,
    capacity: 2,
  },
  {
    id: 'b3333333-3333-4333-8333-333333333333',
    providerId: '22222222-2222-4222-8222-222222222222',
    categoryId: 'a3333333-3333-4333-8333-333333333333',
    name: 'Lặn biển có hướng dẫn',
    description: 'Trải nghiệm lặn biển cùng hướng dẫn viên chuyên nghiệp.',
    price: 1200000,
    capacity: 8,
  },
  {
    id: 'b4444444-4444-4444-8444-444444444441',
    providerId: '22222222-2222-4222-8222-222222222222',
    categoryId: 'a4444444-4444-4444-8444-444444444444',
    name: 'Khu vui chơi trẻ em',
    description: 'Vé vào khu vui chơi trong nhà dành cho trẻ em.',
    price: 150000,
    capacity: 30,
  },
  {
    id: 'b4444444-4444-4444-8444-444444444442',
    providerId: '22222222-2222-4222-8222-222222222222',
    categoryId: 'a4444444-4444-4444-8444-444444444444',
    name: 'Thuê xe đạp gia đình',
    description: 'Thuê xe đạp theo giờ để khám phá khu nghỉ dưỡng.',
    price: 200000,
    capacity: 4,
  },
  {
    id: 'b4444444-4444-4444-8444-444444444443',
    providerId: '22222222-2222-4222-8222-222222222222',
    categoryId: 'a4444444-4444-4444-8444-444444444444',
    name: 'Trông trẻ theo giờ',
    description: 'Dịch vụ hỗ trợ trông trẻ theo khung giờ đăng ký.',
    price: 250000,
    capacity: 3,
  },
];

async function main(): Promise<void> {
  await dataSource.initialize();

  try {
    const serviceRepository = dataSource.getRepository(Service);
    const providerRepository = dataSource.getRepository(Provider);
    const categoryRepository = dataSource.getRepository(Category);

    for (const input of seedServices) {
      const [provider, category] = await Promise.all([
        providerRepository.findOneBy({ id: input.providerId }),
        categoryRepository.findOneBy({ id: input.categoryId }),
      ]);

      if (!provider || !category) {
        throw new Error(
          `Missing provider/category for service ${input.name}. Run provider and category seeds first.`,
        );
      }

      await serviceRepository.save(
        serviceRepository.create({
          ...input,
          status: ServiceStatus.ACTIVE,
        }),
      );
      console.log(`Created or updated service: ${input.name}`);
    }
  } finally {
    await dataSource.destroy();
  }
}

main().catch((error: unknown) => {
  console.error('Failed to seed services:', error);
  process.exitCode = 1;
});
