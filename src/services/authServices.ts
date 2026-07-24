import { users } from "../database/data.js";

export function login(username: string, password: string) {
  return users.find((u) => u.username === username && u.password === password);
}
