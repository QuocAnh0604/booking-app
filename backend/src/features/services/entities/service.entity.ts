
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
import { Provider } from '../../providers/entities/provider.entity';
export enum ServiceStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}

@Entity('services')
@Index(['providerId', 'name'], { unique: true })
@Index(['status'])
export class Service {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ length: 255 })
    name!: string;

    @Column({ type: 'text', nullable: true })
    description!: string | null;
    @Column({ type: 'int', default: 0 })
    price!: number;


    @Column({ type: 'int', default: 1 })
    capacity!: number;

    @Column({ type: 'enum', enum: ServiceStatus, default: ServiceStatus.ACTIVE })
    status!: ServiceStatus;


    @Column({ type: 'uuid' })
    providerId!: string;

    @ManyToOne(() => Provider, { onDelete: 'RESTRICT' })
    @JoinColumn({ name: 'providerId' })
    provider!: Provider;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}