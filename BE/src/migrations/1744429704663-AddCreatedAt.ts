import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCreatedAt1744429704663 implements MigrationInterface {
  name = 'AddCreatedAt1744429704663';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "projects" ADD "createAt" TIMESTAMP `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "avatar" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "createAt"`);
  }
}
