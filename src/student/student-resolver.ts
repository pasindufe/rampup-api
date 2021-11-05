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

  @Mutation(() => Student, { name: 'addStudent' })
  async addStudent(
    @Args('student') student: AddUpdateStudentRequest,
  ): Promise<Student> {
    return this.studentService.save(student);
  }

  @Mutation(() => [Student], { name: 'addStudentList' })
  async addBulkStudents(
    @Args({ name: 'students', type: () => [AddUpdateStudentRequest] })
    students: AddUpdateStudentRequest[],
  ): Promise<Student[]> {
    return await this.studentService.saveList(students);
  }

  @Mutation(() => Student, { name: 'updateStudent' })
  async updateStudent(
    @Args('id') id: number,
    @Args('student') student: AddUpdateStudentRequest,
  ) {
    return this.studentService.update(id, student as Student);
  }

  @Mutation(() => Boolean, { name: 'deleteStudent' })
  async deleteStudent(@Args('id') id: number) {
    return this.studentService.delete(id);
  }
}
