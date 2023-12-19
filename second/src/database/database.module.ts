import { Module, OnModuleInit } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MikroORM } from '@mikro-orm/core';
import options from './mikro-orm.config';

@Module({
  imports: [MikroOrmModule.forRoot(options)],
})
export class DatabaseModule implements OnModuleInit {
  constructor(private readonly orm: MikroORM) {}

  onModuleInit() {
    this.orm.getMigrator().up();
  }
}
