import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCategory1795415917490 implements MigrationInterface {
  name = 'CreateCategory1795415917490';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const hasCategories = await queryRunner.hasTable('categories');

    if (!hasCategories) {
      await queryRunner.query(`
        CREATE TABLE "categories" (
          "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
          "providerId" uuid NOT NULL,
          "name" character varying(255) NOT NULL,
          "description" text,
          "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
          "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
          CONSTRAINT "UQ_categories_provider_name" UNIQUE ("providerId", "name"),
          CONSTRAINT "PK_categories_id" PRIMARY KEY ("id"),
          CONSTRAINT "FK_categories_provider"
            FOREIGN KEY ("providerId") REFERENCES "providers"("id")
            ON DELETE CASCADE ON UPDATE NO ACTION
        )
      `);
    }

    if (await queryRunner.hasTable('services')) {
      const serviceTable = await queryRunner.getTable('services');
      const hasCategoryId = serviceTable?.columns.some(
        (column) => column.name === 'categoryId',
      );

      if (!hasCategoryId) {
        await queryRunner.query(
          `ALTER TABLE "services" ADD "categoryId" uuid`,
        );
      }

      await queryRunner.query(`
        INSERT INTO "categories" ("providerId", "name")
        SELECT DISTINCT "providerId", 'General'
        FROM "services"
        WHERE "providerId" IS NOT NULL
        ON CONFLICT ("providerId", "name") DO NOTHING
      `);

      await queryRunner.query(`
        UPDATE "services" AS service
        SET "categoryId" = category."id"
        FROM "categories" AS category
        WHERE category."providerId" = service."providerId"
          AND category."name" = 'General'
          AND service."categoryId" IS NULL
      `);

      await queryRunner.query(
        `ALTER TABLE "services" ALTER COLUMN "categoryId" SET NOT NULL`,
      );
      await queryRunner.query(`
        ALTER TABLE "services"
        ADD CONSTRAINT "FK_services_category"
        FOREIGN KEY ("categoryId") REFERENCES "categories"("id")
        ON DELETE RESTRICT ON UPDATE NO ACTION
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    if (await queryRunner.hasTable('services')) {
      const serviceTable = await queryRunner.getTable('services');
      const hasCategoryId = serviceTable?.columns.some(
        (column) => column.name === 'categoryId',
      );

      if (hasCategoryId) {
        await queryRunner.query(
          `ALTER TABLE "services" DROP CONSTRAINT IF EXISTS "FK_services_category"`,
        );
        await queryRunner.query(
          `ALTER TABLE "services" DROP COLUMN "categoryId"`,
        );
      }
    }

    if (await queryRunner.hasTable('categories')) {
      await queryRunner.query(`DROP TABLE "categories"`);
    }
  }
}
