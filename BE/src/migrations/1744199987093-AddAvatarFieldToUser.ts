import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAvatarFieldToUser1744199987093 implements MigrationInterface {
  name = 'AddAvatarFieldToUser1744199987093';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "avatar" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "avatar"`);
  }
}
