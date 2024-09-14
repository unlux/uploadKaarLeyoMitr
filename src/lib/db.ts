import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface saveToDBparams {
  username: string;
  url: string;
}
type usernameType = Pick<saveToDBparams, "username">;

// model User {
//   id    Int     @id @default(autoincrement())
//   username String @unique
//   files File[]
// }

// model File {
//   id     Int    @id @default(autoincrement())
//   url    String
//   username Int
//   user   User   @relation(fields: [username], references: [id])
// }

async function saveToDB({ username, url }: saveToDBparams) {
  // create new if already not present
  const user = await prisma.user.upsert({
    where: { username },
    update: {},
    create: { username },
  });

  // reate new file associated w the user
  const res = await prisma.file.create({
    data: {
      username: user.username,
      url,
    },
  });
  console.log("----------------------------added to DB" + res);
  return true;
}

async function bringFromDB({ username }: usernameType) {
  const res = await prisma.file.findMany({
    where: {
      username: {
        equals: username,
      },
    },
  });
  console.log("----------------------------bringFROMDB wala res", res);
  console.log(res);
  return res;
}

export { saveToDB, bringFromDB };
