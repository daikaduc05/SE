import { MigrationInterface, QueryRunner } from 'typeorm';

export class LastMigration1745298300090 implements MigrationInterface {
  name = 'LastMigration1745298300090';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "nofitications" ADD "type" character varying `);
    await queryRunner.query(`ALTER TABLE "nofitications" ADD "idObject" integer`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "projects" ALTER COLUMN "endDate" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "projects" ALTER COLUMN "startDate" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "avatar" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "nofitications" DROP COLUMN "idObject"`);
    await queryRunner.query(`ALTER TABLE "nofitications" DROP COLUMN "type"`);
  }
}
