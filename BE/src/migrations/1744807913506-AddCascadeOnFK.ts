import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCascadeOnFK1744807913506 implements MigrationInterface {
  name = 'AddCascadeOnFK1744807913506';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "roles_users_projects" DROP CONSTRAINT "FK_db4144a24108a3835a4bf540357"`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles_users_projects" DROP CONSTRAINT "FK_ace5fe88d0950333206ceecc80c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles_users_projects" DROP CONSTRAINT "FK_a5dbc89430a891057373d445f34"`,
    );
    await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_e08fca67ca8966e6b9914bf2956"`);
    await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_660898d912c6e71107e9ef8f38d"`);
    await queryRunner.query(
      `ALTER TABLE "tasks_users" DROP CONSTRAINT "FK_f6d8bf273b892dfcedfb3798a65"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks_users" DROP CONSTRAINT "FK_f85bfa2db65883ce21f52fe9567"`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles_users_projects" ADD CONSTRAINT "FK_db4144a24108a3835a4bf540357" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles_users_projects" ADD CONSTRAINT "FK_ace5fe88d0950333206ceecc80c" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles_users_projects" ADD CONSTRAINT "FK_a5dbc89430a891057373d445f34" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD CONSTRAINT "FK_e08fca67ca8966e6b9914bf2956" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD CONSTRAINT "FK_660898d912c6e71107e9ef8f38d" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks_users" ADD CONSTRAINT "FK_f6d8bf273b892dfcedfb3798a65" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks_users" ADD CONSTRAINT "FK_f85bfa2db65883ce21f52fe9567" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tasks_users" DROP CONSTRAINT "FK_f85bfa2db65883ce21f52fe9567"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks_users" DROP CONSTRAINT "FK_f6d8bf273b892dfcedfb3798a65"`,
    );
    await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_660898d912c6e71107e9ef8f38d"`);
    await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_e08fca67ca8966e6b9914bf2956"`);
    await queryRunner.query(
      `ALTER TABLE "roles_users_projects" DROP CONSTRAINT "FK_a5dbc89430a891057373d445f34"`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles_users_projects" DROP CONSTRAINT "FK_ace5fe88d0950333206ceecc80c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles_users_projects" DROP CONSTRAINT "FK_db4144a24108a3835a4bf540357"`,
    );
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "avatar" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "projects" ALTER COLUMN "endDate" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "projects" ALTER COLUMN "startDate" DROP NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "tasks_users" ADD CONSTRAINT "FK_f85bfa2db65883ce21f52fe9567" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks_users" ADD CONSTRAINT "FK_f6d8bf273b892dfcedfb3798a65" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD CONSTRAINT "FK_660898d912c6e71107e9ef8f38d" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD CONSTRAINT "FK_e08fca67ca8966e6b9914bf2956" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles_users_projects" ADD CONSTRAINT "FK_a5dbc89430a891057373d445f34" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles_users_projects" ADD CONSTRAINT "FK_ace5fe88d0950333206ceecc80c" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles_users_projects" ADD CONSTRAINT "FK_db4144a24108a3835a4bf540357" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
