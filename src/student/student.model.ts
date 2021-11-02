import { Field, ObjectType } from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum Gender {
  MALE = 1,
  FEMALE = 2,
}

@ObjectType()
@Entity()
export class Student {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column('text')
  name: string;

  @Field()
  @Column({
    type: 'enum',
    enum: Gender,
  })
  gender: Gender;

  @Field()
  @Column('text')
  address: string;

  @Field()
  @Column('text')
  mobile: string;

  @Field()
  @Column()
  dob: Date;

  @Field()
  @Column()
  @CreateDateColumn()
  created_date: Date;

  @Field()
  @Column()
  @UpdateDateColumn()
  updated_date: Date;

  @Field()
  @Column({ default: true })
  is_active: boolean;
}
