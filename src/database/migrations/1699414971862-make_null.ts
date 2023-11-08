import { MigrationInterface, QueryRunner } from "typeorm";

export class MakeNull1699414971862 implements MigrationInterface {
    name = 'MakeNull1699414971862'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "groups" ALTER COLUMN "group_name" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "groups" ALTER COLUMN "group_name" SET NOT NULL`);
    }

}
