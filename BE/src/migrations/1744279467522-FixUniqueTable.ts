import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixUniqueTable1744279467522 implements MigrationInterface {
  name = 'FixUniqueTable1744279467522';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "project_id"`);
    await queryRunner.query(
      `ALTER TABLE "users" ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles_users_projects" ADD CONSTRAINT "UQ_c214b31ba357c340b36397e03e5" UNIQUE ("userId", "roleId", "projectId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks_users" ADD CONSTRAINT "UQ_3426b283452e258dee10ab92536" UNIQUE ("userId", "taskId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tasks_users" DROP CONSTRAINT "UQ_3426b283452e258dee10ab92536"`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles_users_projects" DROP CONSTRAINT "UQ_c214b31ba357c340b36397e03e5"`,
    );
    await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3"`);
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "avatar" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "tasks" ADD "project_id" integer NOT NULL`);
  }
}
