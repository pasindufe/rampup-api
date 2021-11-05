import { Field, ObjectType } from '@nestjs/graphql';
import { Gender } from '../student.model';

@ObjectType()
export class StudentResponse {
  @Field()
  id: number;
  @Field()
  name: string;
  @Field()
  gender: string;
  @Field()
  address: string;
  @Field()
  mobile: string;
  @Field()
  dob: Date;
  @Field()
  age: number;
  @Field()
  is_active: boolean;
}
