import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNull1699124975204 implements MigrationInterface {
    name = 'AddNull1699124975204'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "telegram_nick" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "telegram_nick" SET NOT NULL`);
    }

}
