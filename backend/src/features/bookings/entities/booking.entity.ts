import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BookingStatus } from '../../../common/enums/booking-status.enum';
import { User } from '../../users/entities/user.entity';
import { Room } from '../../rooms/entities/room.entity';

@Entity('bookings')
@Index(['roomId', 'checkIn', 'checkOut'])
@Index(['status', 'createdAt'])
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  userId!: string;

  @ManyToOne(() => User, (user) => user.bookings, { onDelete: 'RESTRICT' })
  @JoinColumn()
  user!: User;

  @Column({ type: 'uuid' })
  roomId!: string;

  @ManyToOne(() => Room, (room) => room.bookings, { onDelete: 'RESTRICT' })
  @JoinColumn()
  room!: Room;

  @Column({ type: 'date' })
  checkIn!: string;

  @Column({ type: 'date' })
  checkOut!: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  totalPrice!: string;

  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.PENDING })
  status!: BookingStatus;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  cancellationFee!: string | null;

  @Column({ type: 'timestamp', nullable: true })
  cancelledAt!: Date | null;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;
}
