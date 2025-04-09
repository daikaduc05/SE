import { MigrationInterface, QueryRunner } from "typeorm";

export class InitSchema1744118366300 implements MigrationInterface {
    name = 'InitSchema1744118366300'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "roles" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "roles_users_projects" ("id" SERIAL NOT NULL, "userId" integer, "roleId" integer, "projectId" integer, CONSTRAINT "PK_a595613d866fc26960169338c85" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "projects" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tasks" ("id" SERIAL NOT NULL, "project_id" integer NOT NULL, "task_description" character varying NOT NULL, "task_state" character varying NOT NULL, "task_priority" character varying NOT NULL, "task_name" character varying NOT NULL, "created_time" TIMESTAMP NOT NULL, "task_deadline" TIMESTAMP NOT NULL, "done_at" TIMESTAMP NOT NULL, "projectId" integer, "createdById" integer, CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "task_user" ("id" SERIAL NOT NULL, "userId" integer, "taskId" integer, CONSTRAINT "PK_6ea2c1c13f01b7a383ebbeaebb0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "nofitications-user" ("id" SERIAL NOT NULL, "is_read" boolean NOT NULL, "userId" integer, "notificationId" integer, CONSTRAINT "PK_5b6d6f50bcef0280dd3855d03b7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "nofitications" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "content" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL, "createdById" integer, CONSTRAINT "PK_502a8728498d5e9bae4d1b93519" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "noti_settings" boolean NOT NULL DEFAULT true, "is_banned" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "roles_users_projects" ADD CONSTRAINT "FK_db4144a24108a3835a4bf540357" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "roles_users_projects" ADD CONSTRAINT "FK_ace5fe88d0950333206ceecc80c" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "roles_users_projects" ADD CONSTRAINT "FK_a5dbc89430a891057373d445f34" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_e08fca67ca8966e6b9914bf2956" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_660898d912c6e71107e9ef8f38d" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task_user" ADD CONSTRAINT "FK_0f500c19a4a119f22a82c9b3640" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "task_user" ADD CONSTRAINT "FK_ff099dc6756bfef736ebe18ea9a" FOREIGN KEY ("taskId") REFERENCES "tasks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "nofitications-user" ADD CONSTRAINT "FK_727b925882b5f841ab4a86fa995" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "nofitications-user" ADD CONSTRAINT "FK_cf8de016e471f03a06b80470c5e" FOREIGN KEY ("notificationId") REFERENCES "nofitications"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "nofitications" ADD CONSTRAINT "FK_a5293f4060e358e18923d8d127f" FOREIGN KEY ("createdById") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "nofitications" DROP CONSTRAINT "FK_a5293f4060e358e18923d8d127f"`);
        await queryRunner.query(`ALTER TABLE "nofitications-user" DROP CONSTRAINT "FK_cf8de016e471f03a06b80470c5e"`);
        await queryRunner.query(`ALTER TABLE "nofitications-user" DROP CONSTRAINT "FK_727b925882b5f841ab4a86fa995"`);
        await queryRunner.query(`ALTER TABLE "task_user" DROP CONSTRAINT "FK_ff099dc6756bfef736ebe18ea9a"`);
        await queryRunner.query(`ALTER TABLE "task_user" DROP CONSTRAINT "FK_0f500c19a4a119f22a82c9b3640"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_660898d912c6e71107e9ef8f38d"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_e08fca67ca8966e6b9914bf2956"`);
        await queryRunner.query(`ALTER TABLE "roles_users_projects" DROP CONSTRAINT "FK_a5dbc89430a891057373d445f34"`);
        await queryRunner.query(`ALTER TABLE "roles_users_projects" DROP CONSTRAINT "FK_ace5fe88d0950333206ceecc80c"`);
        await queryRunner.query(`ALTER TABLE "roles_users_projects" DROP CONSTRAINT "FK_db4144a24108a3835a4bf540357"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "nofitications"`);
        await queryRunner.query(`DROP TABLE "nofitications-user"`);
        await queryRunner.query(`DROP TABLE "task_user"`);
        await queryRunner.query(`DROP TABLE "tasks"`);
        await queryRunner.query(`DROP TABLE "projects"`);
        await queryRunner.query(`DROP TABLE "roles_users_projects"`);
        await queryRunner.query(`DROP TABLE "roles"`);
    }

}
