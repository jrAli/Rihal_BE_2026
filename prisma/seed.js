import { PrismaClient } from "@prisma/client/extension";
const prisma = new PrismaClient();

async function main(){
  // Add seed data goes here

}

main()
  .catch(console.error)
  .finall(() => prisma.$disconnect());
