import { Field, InputType } from '@nestjs/graphql';
import { Gender } from '../student.model';

@InputType()
export class AddUpdateStudentRequest {
  @Field()
  name: string;

  @Field()
  gender: Gender;

  @Field()
  address: string;

  @Field()
  mobile: string;

  @Field()
  dob: Date;
}
