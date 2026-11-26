import 'dotenv/config';
import dataSource from './data-source';
import { Booking } from '../features/bookings/entities/booking.entity';
import { Service } from '../features/services/entities/service.entity';
import { User } from '../features/users/entities/user.entity';
import { BookingStatus } from '../common/enums/booking-status.enum';

type SeedBooking = {
  id: string;
  userEmail: string;
  serviceId: string;
  startAt: string;
  endAt: string;
  quantity: number;
  totalPrice: string;
  status: BookingStatus;
  note: string;
};

const seedBookings: SeedBooking[] = [
  {
    id: 'c1111111-1111-4111-8111-111111111111',
    userEmail: 'customer1@booking.local',
    serviceId: 'b1111111-1111-4111-8111-111111111111',
    startAt: '2026-12-10T09:00:00.000Z',
    endAt: '2026-12-10T10:00:00.000Z',
    quantity: 1,
    totalPrice: '500000.00',
    status: BookingStatus.CONFIRMED,
    note: 'Khách muốn phòng yên tĩnh.',
  },
  {
    id: 'c2222222-2222-4222-8222-222222222222',
    userEmail: 'customer1@booking.local',
    serviceId: 'b2222222-2222-4222-8222-222222222221',
    startAt: '2026-12-11T01:00:00.000Z',
    endAt: '2026-12-11T02:00:00.000Z',
    quantity: 2,
    totalPrice: '360000.00',
    status: BookingStatus.PENDING,
    note: 'Đặt bàn cho hai người.',
  },
  {
    id: 'c3333333-3333-4333-8333-333333333333',
    userEmail: 'customer2@booking.local',
    serviceId: 'b3333333-3333-4333-8333-333333333331',
    startAt: '2026-12-12T02:00:00.000Z',
    endAt: '2026-12-12T06:00:00.000Z',
    quantity: 2,
    totalPrice: '1500000.00',
    status: BookingStatus.REJECTED,
    note: 'Không đủ chỗ trong chuyến đi đã chọn.',
  },
  {
    id: 'c4444444-4444-4444-8444-444444444444',
    userEmail: 'customer2@booking.local',
    serviceId: 'b4444444-4444-4444-8444-444444444442',
    startAt: '2026-12-13T03:00:00.000Z',
    endAt: '2026-12-13T05:00:00.000Z',
    quantity: 2,
    totalPrice: '400000.00',
    status: BookingStatus.CANCELLED,
    note: 'Khách thay đổi lịch trình.',
  },
];

async function main(): Promise<void> {
  await dataSource.initialize();

  try {
    const bookingRepository = dataSource.getRepository(Booking);
    const userRepository = dataSource.getRepository(User);
    const serviceRepository = dataSource.getRepository(Service);

    for (const input of seedBookings) {
      const [user, service] = await Promise.all([
        userRepository.findOneBy({ email: input.userEmail }),
        serviceRepository.findOneBy({ id: input.serviceId }),
      ]);

      if (!user || !service) {
        throw new Error(
          `Missing user/service for booking ${input.id}. Run user and service seeds first.`,
        );
      }

      await bookingRepository.save(
        bookingRepository.create({
          id: input.id,
          userId: user.id,
          serviceId: service.id,
          startAt: new Date(input.startAt),
          endAt: new Date(input.endAt),
          quantity: input.quantity,
          totalPrice: input.totalPrice,
          status: input.status,
          note: input.note,
          confirmedAt:
            input.status === BookingStatus.CONFIRMED
              ? new Date(input.startAt)
              : null,
          cancelledAt:
            input.status === BookingStatus.CANCELLED
              ? new Date(input.startAt)
              : null,
          cancellationFee:
            input.status === BookingStatus.CANCELLED ? '0.00' : null,
          rejectedAt:
            input.status === BookingStatus.REJECTED
              ? new Date(input.startAt)
              : null,
          rejectionReason:
            input.status === BookingStatus.REJECTED
              ? 'Demo booking bị từ chối.'
              : null,
        }),
      );
      console.log(`Created or updated booking: ${input.id}`);
    }
  } finally {
    await dataSource.destroy();
  }
}

main().catch((error: unknown) => {
  console.error('Failed to seed bookings:', error);
  process.exitCode = 1;
});
