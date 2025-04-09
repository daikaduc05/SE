import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeCorrectSchema1744162274615 implements MigrationInterface {
  name = 'ChangeCorrectSchema1744162274615';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "tasks_users" ("id" SERIAL NOT NULL, "assign_time" TIMESTAMP NOT NULL, "userId" integer, "taskId" integer, CONSTRAINT "PK_192fe4da167f58b788330cdf71b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "nofitications-users" ("id" SERIAL NOT NULL, "is_read" boolean NOT NULL, "userId" integer, "notificationId" integer, CONSTRAINT "PK_c00d2d7e9d59a8cd643b5e02b4b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks_users" ADD CONSTRAINT "FK_f6d8bf273b892dfcedfb3798a65" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks_users" ADD CONSTRAINT "FK_f85bfa2db65883ce21f52fe9567" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "nofitications-users" ADD CONSTRAINT "FK_4afdda2cde7f635a2822b4db45e" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "nofitications-users" ADD CONSTRAINT "FK_4ba66795c11bf94a7b98c8c053a" FOREIGN KEY ("notificationId") REFERENCES "nofitications"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "nofitications-users" DROP CONSTRAINT "FK_4ba66795c11bf94a7b98c8c053a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "nofitications-users" DROP CONSTRAINT "FK_4afdda2cde7f635a2822b4db45e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks_users" DROP CONSTRAINT "FK_f85bfa2db65883ce21f52fe9567"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks_users" DROP CONSTRAINT "FK_f6d8bf273b892dfcedfb3798a65"`,
    );
    await queryRunner.query(`DROP TABLE "nofitications-users"`);
    await queryRunner.query(`DROP TABLE "tasks_users"`);
  }
}
