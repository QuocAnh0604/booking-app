import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Booking } from '../../bookings/entities/booking.entity';
import { Hotel } from '../../hotels/entities/hotel.entity';
import { RoomType } from '../../room-types/entities/room-type.entity';

@Entity('rooms')
@Unique(['hotelId', 'number'])
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  hotelId!: string;

  @ManyToOne(() => Hotel, (hotel) => hotel.rooms, { onDelete: 'CASCADE' })
  @JoinColumn()
  hotel!: Hotel;

  @Column({ type: 'uuid' })
  roomTypeId!: string;

  @ManyToOne(() => RoomType, (roomType) => roomType.rooms, { onDelete: 'RESTRICT' })
  @JoinColumn()
  roomType!: RoomType;

  @Column({ type: 'int' })
  floor!: number;

  @Column({ type: 'int' })
  number!: number;

  @Column({ type: 'boolean', default: true })
  isActive!: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt!: Date;

  @OneToMany(() => Booking, (booking) => booking.room)
  bookings!: Booking[];
}
