import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Video {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column({ unique: true, nullable: false, length: 200 })
  title: string;

  @Column({ nullable: false, length: 500 })
  description: string;

  @Column({ nullable: false })
  url: string;
}
