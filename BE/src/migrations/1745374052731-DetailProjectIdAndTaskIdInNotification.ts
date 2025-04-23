import { MigrationInterface, QueryRunner } from 'typeorm';

export class DetailProjectIdAndTaskIdInNotification1745374052731 implements MigrationInterface {
  name = 'DetailProjectIdAndTaskIdInNotification1745374052731';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "nofitications" DROP COLUMN "idObject"`);
    await queryRunner.query(`ALTER TABLE "nofitications" ADD "projectId" integer`);
    await queryRunner.query(`ALTER TABLE "nofitications" ADD "taskId" integer`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "avatar" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "nofitications" ALTER COLUMN "type" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "projects" ALTER COLUMN "endDate" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "projects" ALTER COLUMN "startDate" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "nofitications" DROP COLUMN "taskId"`);
    await queryRunner.query(`ALTER TABLE "nofitications" DROP COLUMN "projectId"`);
    await queryRunner.query(`ALTER TABLE "nofitications" ADD "idObject" integer`);
  }
}
