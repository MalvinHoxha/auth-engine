// test.ts
import "dotenv/config";
import { prisma } from "./lib/db";

async function main() {
  const post = await prisma.post.create({
    data: {
      title: "Hello Prisma",
      content: "Testing connection",
    },
  });

  console.log(post);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });