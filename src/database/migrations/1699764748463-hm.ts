import { MigrationInterface, QueryRunner } from "typeorm";

export class Hm1699764748463 implements MigrationInterface {
    name = 'Hm1699764748463'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "clients_homeworks" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "student" character varying NOT NULL, "teacher" character varying, "homework" character varying NOT NULL, "score" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_6ffa6b612b35c74b21a1f7b41e6" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "clients_homeworks"`);
    }

}
