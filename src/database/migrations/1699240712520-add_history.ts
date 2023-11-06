import { MigrationInterface, QueryRunner } from "typeorm";

export class AddHistory1699240712520 implements MigrationInterface {
    name = 'AddHistory1699240712520'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "histories" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "chat_id" character varying NOT NULL, "message_id" character varying NOT NULL, CONSTRAINT "PK_36b0e707452a8b674f9d95da743" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "histories"`);
    }

}
