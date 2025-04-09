import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAssignTime1744128715150 implements MigrationInterface {
  name = 'AddAssignTime1744128715150';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "task_user" ADD "assign_time" TIMESTAMP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "task_user" DROP COLUMN "assign_time"`);
  }
}
