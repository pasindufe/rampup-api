import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import ormConfig from './ormconfig';
import { BulkStudentUploader } from './student/bulk-student-uploader';
import { StudentModule } from './student/student-module';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormConfig),
    MulterModule.register({ dest: './uploads' }),
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.graphql'),
    }),
    StudentModule,
  ],
  controllers: [BulkStudentUploader],
})
export class AppModule {}
