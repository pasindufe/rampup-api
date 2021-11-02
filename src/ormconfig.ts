import { ConnectionOptions } from 'typeorm';

const config: ConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'root',
  database: 'rampup-project',
  entities: [__dirname + '/**/*.model{.ts,.js}'],
  synchronize: true,
};

export default config;
