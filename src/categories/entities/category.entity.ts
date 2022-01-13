/* eslint-disable @typescript-eslint/no-unused-vars */
import { Video } from '../../videos/entities/video.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column({ unique: true, nullable: false, length: 100 })
  title: string;

  @Column({ unique: true, nullable: false })
  color: string;

  @OneToMany((type) => Video, (video) => video.category, { eager: true })
  videos: Video[];

  constructor(title: string, color: string, videos: Video[]) {
    Object.assign({}, this);
  }
}
