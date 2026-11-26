
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from '../../features/users/entities/user.entity';
import { Provider } from '../../features/providers/entities/provider.entity';
import { Booking } from '../../features/bookings/entities/booking.entity';
import { Category } from '../../features/categories/entities/category.entity';

export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  entities: [User, Provider, Category, Booking],
  migrations: [
    'src/database/migrations/[0-9]*.ts',
  ],

  synchronize: false,
  logging: true,
});
