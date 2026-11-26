import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameHotelsToProviders1795415917489
  implements MigrationInterface
{
  name = 'RenameHotelsToProviders1795415917489';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rooms" RENAME CONSTRAINT "FK_e9d4d68c8c47b7fe47b8e233f60" TO "FK_rooms_provider"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rooms" RENAME CONSTRAINT "UQ_735a215d684354ae4631b64e3b7" TO "UQ_rooms_provider_number"`,
    );
    await queryRunner.query(`ALTER TABLE "hotels" RENAME TO "providers"`);
    await queryRunner.query(
      `ALTER TABLE "rooms" RENAME COLUMN "hotelId" TO "providerId"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "rooms" RENAME COLUMN "providerId" TO "hotelId"`,
    );
    await queryRunner.query(`ALTER TABLE "providers" RENAME TO "hotels"`);
    await queryRunner.query(
      `ALTER TABLE "rooms" RENAME CONSTRAINT "UQ_rooms_provider_number" TO "UQ_735a215d684354ae4631b64e3b7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "rooms" RENAME CONSTRAINT "FK_rooms_provider" TO "FK_e9d4d68c8c47b7fe47b8e233f60"`,
    );
  }
}
