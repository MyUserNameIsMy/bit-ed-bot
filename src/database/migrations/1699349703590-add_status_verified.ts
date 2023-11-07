import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStatusVerified1699349703590 implements MigrationInterface {
    name = 'AddStatusVerified1699349703590'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "verified" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "verified"`);
    }

}
