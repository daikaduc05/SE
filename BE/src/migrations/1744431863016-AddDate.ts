import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDate1744431863016 implements MigrationInterface {
  name = 'AddDate1744431863016';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "createAt"`);
    await queryRunner.query(`ALTER TABLE "projects" ADD "startDate" TIMESTAMP `);
    await queryRunner.query(`ALTER TABLE "projects" ADD "endDate" TIMESTAMP `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "avatar" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "endDate"`);
    await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "startDate"`);
    await queryRunner.query(`ALTER TABLE "projects" ADD "createAt" TIMESTAMP`);
  }
}
