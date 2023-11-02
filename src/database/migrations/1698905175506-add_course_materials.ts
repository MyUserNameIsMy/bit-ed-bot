import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCourseMaterials1698905175506 implements MigrationInterface {
    name = 'AddCourseMaterials1698905175506'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "homeworks" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "due_to" TIMESTAMP NOT NULL, "text" text NOT NULL, CONSTRAINT "PK_b14704fd42638206031612722de" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "syllabus" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "date" TIMESTAMP NOT NULL, "topic" character varying NOT NULL, "text" text NOT NULL, CONSTRAINT "PK_5205bdbdb2d719615ccf5eabfb5" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "syllabus"`);
        await queryRunner.query(`DROP TABLE "homeworks"`);
    }

}
