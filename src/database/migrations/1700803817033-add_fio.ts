import { MigrationInterface, QueryRunner } from "typeorm";

export class AddFio1700803817033 implements MigrationInterface {
    name = 'AddFio1700803817033'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "fio" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "fio"`);
    }

}
