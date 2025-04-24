import { MigrationInterface, QueryRunner } from 'typeorm';

export class GrammarFixed1745512220806 implements MigrationInterface {
  name = 'GrammarFixed1745512220806';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "notifications" ("id" SERIAL NOT NULL, "content" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL, "type" character varying NOT NULL, "projectId" integer NOT NULL, "taskId" integer NOT NULL, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "notification-users" ("id" SERIAL NOT NULL, "is_read" boolean NOT NULL, "userId" integer, "notificationId" integer, CONSTRAINT "PK_eda4de5dd0b79f0d833aca3dbb7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification-users" ADD CONSTRAINT "FK_a4269bff9680b4778bf4ae59296" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification-users" ADD CONSTRAINT "FK_44bdcad853fe83de062d2271d0a" FOREIGN KEY ("notificationId") REFERENCES "notifications"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notification-users" DROP CONSTRAINT "FK_44bdcad853fe83de062d2271d0a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification-users" DROP CONSTRAINT "FK_a4269bff9680b4778bf4ae59296"`,
    );
    await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "avatar" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "projects" ALTER COLUMN "endDate" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "projects" ALTER COLUMN "startDate" DROP NOT NULL`);
    await queryRunner.query(`DROP TABLE "notification-users"`);
    await queryRunner.query(`DROP TABLE "notifications"`);
  }
}
