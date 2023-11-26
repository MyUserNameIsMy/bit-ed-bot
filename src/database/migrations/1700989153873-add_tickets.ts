import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTickets1700989153873 implements MigrationInterface {
    name = 'AddTickets1700989153873'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "tickets" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "tickets"`);
    }

}
