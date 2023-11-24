import { MigrationInterface, QueryRunner } from "typeorm";

export class AddComNumbers1700852664029 implements MigrationInterface {
    name = 'AddComNumbers1700852664029'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "comp_number" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "comp_number"`);
    }

}
