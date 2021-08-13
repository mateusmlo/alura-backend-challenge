import { Category } from 'src/categories/entities/category.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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

  @ManyToOne((type) => Category, (category) => category.videos, {
    eager: false,
    nullable: false,
  })
  category: Category;
}
