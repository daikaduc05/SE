import { MigrationInterface, QueryRunner } from 'typeorm';

export class Delete1745286091228 implements MigrationInterface {
  name = 'Delete1745286091228';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "nofitications" DROP CONSTRAINT "FK_a5293f4060e358e18923d8d127f"`,
    );
    await queryRunner.query(`ALTER TABLE "nofitications" DROP COLUMN "createdById"`);
    await queryRunner.query(`ALTER TABLE "nofitications" DROP COLUMN "title"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "avatar" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "projects" ALTER COLUMN "endDate" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "projects" ALTER COLUMN "startDate" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "nofitications" ADD "title" character varying NOT NULL`);
    await queryRunner.query(`ALTER TABLE "nofitications" ADD "createdById" integer`);
    await queryRunner.query(
      `ALTER TABLE "nofitications" ADD CONSTRAINT "FK_a5293f4060e358e18923d8d127f" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
