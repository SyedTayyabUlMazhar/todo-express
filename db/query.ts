import Collections from "./collections.js";
import { User } from "./types.js";

const getUser = async (userProperties: Partial<User>) => {
  try {
    const user = await Collections.users.findOne(userProperties);
    return user;
  } catch (e) {
    console.error("Error while fetching user: ", e);
    return null;
  }
};

const doesUserExists = async (userProperties: Partial<User>) => {
  return Boolean(await getUser(userProperties));
};

const Query = {
  getUser,
  doesUserExists,
};

export default Query;
