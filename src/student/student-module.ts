import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentResolver } from './student-resolver';
import { StudentService } from './student-service';
import { Student } from './student.model';

@Module({
  imports: [TypeOrmModule.forFeature([Student])],
  providers: [StudentResolver, StudentService],
  // exports: [StudentResolver],
})
export class StudentModule {}
