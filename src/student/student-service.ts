import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './student.model';
import * as moment from 'moment';
import { StudentResponse } from './dto/student-response';
import { AddUpdateStudentRequest } from './dto/add-student-request';
import { getConnection } from 'typeorm';
import { Logger } from '@nestjs/common';

export class StudentService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
  ) {}

  private readonly logger = new Logger(StudentService.name);

  async findAll(): Promise<StudentResponse[]> {
    const response: StudentResponse[] = [];
    try {
      const students = await this.studentRepository.find({
        where: [{ is_active: true }],
        order: { id: 'DESC' },
      });
      students.forEach((student) => {
        response.push({
          id: student.id,
          name: student.name,
          address: student.address,
          mobile: student.mobile,
          dob: student.dob,
          age: moment().diff(student.dob, 'year'),
          gender: student.gender,
          is_active: student.is_active,
        });
      });
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
    return response;
  }

  save(request: AddUpdateStudentRequest): Promise<Student> {
    try {
      const student = {
        name: request.name,
        gender: request.gender,
        address: request.address,
        mobile: request.mobile,
        dob: request.dob,
        is_active: true,
      };
      return this.studentRepository.save(student);
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async saveList(students: AddUpdateStudentRequest[]): Promise<Student[]> {
    try {
      const result = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(Student)
        .values(students)
        .execute();
      return result.identifiers as Student[];
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async update(id: number, student: Student): Promise<Student> {
    try {
      const existingStudent = await this.studentRepository.findOne(id);
      if (!existingStudent) throw new Error("couldn't find student");
      Object.assign(existingStudent, student);
      return this.studentRepository.save(existingStudent);
    } catch (ex) {
      console.log(ex);

      this.logger.error(ex);
      throw ex;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const existingStudent = await this.studentRepository.findOne(id);
      if (!existingStudent) throw new Error("couldn't find student");
      existingStudent.is_active = false;
      this.studentRepository.save(existingStudent);
      return true;
    } catch (ex) {
      this.logger.error(ex);
      return false;
    }
  }
}
