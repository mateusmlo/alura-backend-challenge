/* eslint-disable @typescript-eslint/no-unused-vars */
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

  @Column({
    nullable: true,
    transformer: {
      to: (value: string) => Boolean(value),
      from: (value: string) => value,
    },
  })
  isFree: boolean;

  @ManyToOne((type) => Category, (category) => category.videos, {
    eager: false,
  })
  category: Category;

  constructor(
    title: string,
    description: string,
    url: string,
    category: Category,
    isFree?: boolean,
  ) {
    Object.assign({}, this);
  }
}
