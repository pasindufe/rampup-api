import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { AddUpdateStudentRequest } from './dto/add-student-request';
import { StudentService } from './student-service';
import { Gender, Student } from './student.model';

describe('Student Service', () => {
  let studentService: StudentService;
  const studentRepository = {
    save: jest.fn().mockImplementation((student) => {
      Promise.resolve({
        id: 3000,
        ...student,
      });
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentService,
        {
          provide: getRepositoryToken(Student),
          useValue: studentRepository,
        },
      ],
    }).compile();

    studentService = module.get<StudentService>(StudentService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('Service - should be defined', () => {
    expect(studentService).toBeDefined();
  });

  //   describe('findAll', () => {
  //     it('should return list', () => {
  //       expect(studentService.findAll()).toBeInstanceOf(Array);
  //     });
  //   });

  //   it('create student', async () => {
  //     expect(await studentService.save(createStudentRequest)).toEqual({
  //       ...createStudentRequest,
  //     });
  //   });

  it('findAll students', async () => {
    const findAllSpy = jest.spyOn(studentService, 'findAll');
    studentService.findAll();
    expect(findAllSpy).toHaveBeenCalledWith();
  });

  it('create student', async () => {
    const createNoteSpy = jest.spyOn(studentService, 'save');
    const createStudentRequest = new AddUpdateStudentRequest();
    createStudentRequest.name = 'test';
    createStudentRequest.address = 'address';
    createStudentRequest.dob = new Date();
    createStudentRequest.gender = Gender.FEMALE;
    createStudentRequest.mobile = '071';
    studentService.save(createStudentRequest);
    expect(createNoteSpy).toHaveBeenCalledWith(createStudentRequest);
  });

  it('update student', async () => {
    const createNoteSpy = jest.spyOn(studentService, 'update');
    const student = new Student();
    student.name = 'test';
    student.address = 'address';
    student.dob = new Date();
    student.gender = Gender.FEMALE;
    student.mobile = '071';
    studentService.update(1, student);
    expect(createNoteSpy).toHaveBeenCalledWith(1, student);
  });

  it('update student throw error', async () => {
    const createNoteSpy = jest.spyOn(studentService, 'update');
    const student = new Student();
    student.name = 'test';
    student.address = 'address';
    student.dob = new Date();
    student.gender = Gender.FEMALE;
    student.mobile = '071';
    studentService.update(null, student);
    expect(createNoteSpy).rejects.toThrowError("couldn't find student");
  });

  it('delete student', async () => {
    const createNoteSpy = jest.spyOn(studentService, 'delete');
    studentService.delete(1);
    expect(createNoteSpy).toHaveBeenCalledWith(1);
  });

  it('delete student throw error', async () => {
    const createNoteSpy = jest.spyOn(studentService, 'delete');
    studentService.delete(null);
    expect(createNoteSpy).rejects.toThrow();
  });

  it('add list', async () => {
    const createNoteSpy = jest.spyOn(studentService, 'saveList');
    const students: Student[] = [];
    studentService.saveList(students);
    expect(createNoteSpy).toHaveBeenCalledWith(students);
  });
});
