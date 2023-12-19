import { Migration } from '@mikro-orm/migrations';

export class Migration20231215191924 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "books" ("id" uuid not null default uuid_generate_v4(), "created_at" timestamptz(0) null, "updated_at" timestamptz(0) null, "name" text null, "description" text null, "author" text null, constraint "books_pkey" primary key ("id"));');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "books" cascade;');
  }

}
