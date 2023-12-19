import { Migration } from '@mikro-orm/migrations';

export class Migration20231214155056 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "users" ("id" uuid not null default uuid_generate_v4(), "created_at" timestamptz(0) null, "updated_at" timestamptz(0) null, "email" text null, "first_name" text null, "last_name" text null, "last_login" timestamptz(0) null, "password" varchar(255) not null, constraint "users_pkey" primary key ("id"));');
    this.addSql('alter table "users" add constraint "users_email_unique" unique ("email");');

    this.addSql('create table "refresh_tokens" ("id" uuid not null default uuid_generate_v4(), "created_at" timestamptz(0) null, "user_id" uuid not null, "token" text not null, "expires_at" timestamptz(0) null, constraint "refresh_tokens_pkey" primary key ("id"));');

    this.addSql('alter table "refresh_tokens" add constraint "refresh_tokens_user_id_foreign" foreign key ("user_id") references "users" ("id") on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "refresh_tokens" drop constraint "refresh_tokens_user_id_foreign";');

    this.addSql('drop table if exists "users" cascade;');

    this.addSql('drop table if exists "refresh_tokens" cascade;');
  }

}
