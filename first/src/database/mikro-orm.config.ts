import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import { join } from 'path';

const config: MikroOrmModuleOptions = {
  migrations: {
    path: join(__dirname, './migrations'),
    pathTs: join(__dirname, './migrations'),
  },
  entities: [join(__dirname, './entities')],
  entitiesTs: [join(__dirname, './entities')],
  host: process.env.POSTGRES_HOST,
  port: +process.env.POSTGRES_PORT,
  dbName: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  type: 'postgresql',
  debug: process.env.NODE_ENV !== 'prod',
};

export default config;
