/**
 * Official Prisma Docs Resource:
    CRUD + Filtering (most important):
    https://www.prisma.io/docs/orm/prisma-client/queries/crud

    Select fields:
    https://www.prisma.io/docs/orm/prisma-client/queries/select-fields

    Relation queries (include/select nested):
    https://www.prisma.io/docs/orm/prisma-client/queries/relation-queries
    
    Filtering and sorting:
    https://www.prisma.io/docs/orm/prisma-client/queries/filtering-and-sorting
  * 
*/

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL, ssl: false }) // ssl set to false when hosting localy
const prisma = new PrismaClient({ adapter })

// Exporting singleton instance `prisma`
export default prisma;