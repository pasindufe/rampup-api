import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from './student.model';
import * as moment from 'moment';
import { StudentResponse } from './dto/student-response';
import { AddUpdateStudentRequest } from './dto/add-student-request';

export class StudentService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
  ) {}

  async findAll(): Promise<StudentResponse[]> {
    const response: StudentResponse[] = [];
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
    return response;
  }

  save(request: AddUpdateStudentRequest): Promise<Student> {
    const student = {
      name: request.name,
      gender: request.gender,
      address: request.address,
      mobile: request.mobile,
      dob: request.dob,
      is_active: true,
    };
    return this.studentRepository.save(student);
  }

  async update(id: number, student: Student): Promise<Student> {
    const existingStudent = await this.studentRepository.findOne(id);
    if (!existingStudent) throw new Error("couldn't find student");
    Object.assign(existingStudent, student);
    return this.studentRepository.save(existingStudent);
  }

  async delete(id: number): Promise<boolean> {
    const existingStudent = await this.studentRepository.findOne(id);
    if (!existingStudent) throw new Error("couldn't find student");
    existingStudent.is_active = false;
    this.studentRepository.save(existingStudent);
    return true;
  }

  findOne(id: number): Promise<Student> {
    return this.studentRepository.findOne(id);
  }
}
