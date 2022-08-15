import { PrismaPromise } from "@open-decision/prisma";
import prisma from "../client";

export const clearTrees = async (
  ownerUuid: string,
  transactions: PrismaPromise<any>[]
) => {
  const deletePublishedTrees = prisma.publishedTree.deleteMany();
  const deleteTree = prisma.decisionTree.deleteMany({ where: { ownerUuid } });

  await prisma.$transaction([
    deletePublishedTrees,
    deleteTree,
    ...transactions,
  ]);
};

export async function clearUser(email: string) {
  const deletePublishedTrees = prisma.publishedTree.deleteMany();
  const deleteToken = prisma.token.deleteMany();
  const deleteTree = prisma.decisionTree.deleteMany();
  const deleteManyWhitelistEntries = prisma.whitelistEntry.deleteMany();
  const deleteUser = prisma.user.deleteMany({ where: { email } });

  await prisma.$transaction([
    deletePublishedTrees,
    deleteToken,
    deleteTree,
    deleteManyWhitelistEntries,
    deleteUser,
  ]);
}

export async function clearDB() {
  const deletePublishedTrees = prisma.publishedTree.deleteMany();
  const deleteToken = prisma.token.deleteMany();
  const deleteTree = prisma.decisionTree.deleteMany();
  const deleteManyWhitelistEntries = prisma.whitelistEntry.deleteMany();
  const deleteUser = prisma.user.deleteMany();

  await prisma.$transaction([
    deletePublishedTrees,
    deleteToken,
    deleteTree,
    deleteManyWhitelistEntries,
    deleteUser,
  ]);
  // const tablenames = await prisma.$queryRaw<
  //   Array<{ tablename: string }>
  // >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

  // for (const { tablename } of tablenames) {
  //   if (tablename !== "_prisma_migrations") {
  //     try {
  //       await prisma.$executeRawUnsafe(
  //         `TRUNCATE TABLE "public"."${tablename}" CASCADE;`
  //       );
  //     } catch (error) {
  //       console.log({ error });
  //     }
  //   }
  // }
}
