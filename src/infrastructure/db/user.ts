import { User, UserId } from "@domain/user";
import { dnull } from "src/utils/dnull";
import { db } from "./db.server";

export const getUser = async (userId: UserId): Promise<User | null> => {
  const user = await db.user.findUnique({
    where: { id: userId },
  });
  return user ? dnull(user) : null;
};

export const getUsers = async (): Promise<User[]> => {
  const users = await db.user.findMany({
    orderBy: { name: "asc" },
  });
  return users.map(dnull);
};
export const GetUserBypassowrd = async (name1: string,password : string): Promise<any | null> => {
  const user = await db.user.findFirst({
    where : {
      name : name1
    }
  })
  if(user) {
    if(password == user.password) {
      const usr : User = {
        id : user.id,
        name : user.name,
      }
      return {
        status : true,
        user : usr
      }
    } else return null
  }
  return null;
};