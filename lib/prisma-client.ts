import { PrismaClient } from "@/lib/generated/prisma";

export class PrismaClientWithSchema extends PrismaClient {
  private currentSchema: string = "public";

  constructor(url?: string, silent?: boolean) {
    super(
      url
        ? {
            datasources: {
              db: {
                url
              }
            },
            log: silent ? [] : ["info", "warn", "error"],
            errorFormat: "minimal"
          }
        : {
            log: silent ? [] : ["info", "warn", "error"],
            errorFormat: "minimal"
          }
    );
  }

  async useSchema(schema: string) {
    this.currentSchema = schema;

    await this.$disconnect();

    await this.$executeRawUnsafe(`CREATE SCHEMA IF NOT EXISTS "${schema}"`);

    // Set schema for all queries in this connection
    await this.$executeRawUnsafe(`SET search_path TO "${schema}"`);
  }

  getCurrentSchema() {
    return this.currentSchema;
  }
}

let prismaClient: PrismaClientWithSchema;

if (!(global as any).prismaClient) {
  (global as any).prismaClient = new PrismaClientWithSchema(
    undefined,
    process.env.NODE_ENV === "test"
  );
}

prismaClient = (global as any).prismaClient;

export { prismaClient };
