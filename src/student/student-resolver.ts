import { Inject } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { StudentResponse } from './dto/student-response';
import { StudentService } from './student-service';
import { Student } from './student.model';
import { AddUpdateStudentRequest } from './dto/add-student-request';

@Resolver(() => Student)
export class StudentResolver {
  constructor(@Inject(StudentService) private studentService: StudentService) {}

  @Query(() => [StudentResponse], { name: 'students' })
  async getStudents(): Promise<StudentResponse[]> {
    return await this.studentService.findAll();
  }

  @Mutation(() => Student, { name: 'student' })
  async addStudent(
    @Args('student') student: AddUpdateStudentRequest,
  ): Promise<Student> {
    return this.studentService.save(student);
  }

  @Mutation(() => Student, { name: 'updated_student' })
  async updateStudent(
    @Args('id') id: number,
    @Args('student') student: AddUpdateStudentRequest,
  ) {
    return this.studentService.update(id, student as Student);
  }

  @Mutation(() => Boolean, { name: 'deleted_student' })
  async deleteStudent(@Args('id') id: number) {
    return this.studentService.delete(id);
  }
}
