import { MigrationInterface, QueryRunner } from "typeorm";

export class AddGroups1699367019352 implements MigrationInterface {
    name = 'AddGroups1699367019352'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "groups" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "group_name" character varying NOT NULL, "teacher" character varying NOT NULL, "student" character varying NOT NULL, "teacher_nick" character varying, "student_nick" character varying, CONSTRAINT "PK_659d1483316afb28afd3a90646e" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "groups"`);
    }

}
