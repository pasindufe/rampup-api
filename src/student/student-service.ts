import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './student.model';
import * as moment from 'moment';
import { StudentResponse } from './dto/student-response';
import { AddUpdateStudentRequest } from './dto/add-student-request';
import { getConnection } from 'typeorm';
import { Logger } from '@nestjs/common';
import * as _ from 'lodash';

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
      this.logger.log(`${students.length} students retrieved`);
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
    return response;
  }

  save(request: AddUpdateStudentRequest): Promise<Student> {
    try {
      if (!this.validateStudent(request))
        throw new Error('missing required fields');
      const student = {
        name: request.name,
        gender: request.gender,
        address: request.address,
        mobile: request.mobile,
        dob: request.dob,
        is_active: true,
      };
      const result = this.studentRepository.save(student);
      this.logger.log('student created');
      return result;
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  validateStudent(request: AddUpdateStudentRequest): boolean {
    return !_.isEmpty(request.name);
  }

  async saveList(students: AddUpdateStudentRequest[]): Promise<Student[]> {
    try {
      const result = await getConnection()
        .createQueryBuilder()
        .insert()
        .into(Student)
        .values(students)
        .execute();
      this.logger.log('bulk student created');
      return result.identifiers as Student[];
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  async update(id: number, student: AddUpdateStudentRequest): Promise<Student> {
    try {
      const existingStudent = await this.studentRepository.findOne(id);
      if (!existingStudent) throw new Error("couldn't find student");
      if (!this.validateStudent(student))
        throw new Error('missing required fields');
      Object.assign(existingStudent, student);
      const result = this.studentRepository.save(existingStudent);
      this.logger.log(`students id -${id} updated`);
      return result;
    } catch (ex) {
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
      this.logger.log(`students id -${id} deleted`);
      return true;
    } catch (ex) {
      this.logger.error(ex);
      return false;
    }
  }
}
