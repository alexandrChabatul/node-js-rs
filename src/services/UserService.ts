import { randomUUID } from 'crypto';
import { ServerError } from '../errors/ServerError.js';
import { readUsersFile, writeToFile } from '../utils/util.js';

export interface User {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}

export class UserService {
  async getAllUsers() {
    return await readUsersFile();
  }

  async getUserById(id: string) {
    this.checkId(id);
    const users = await readUsersFile();
    const user = users.find((user: User) => user.id === id);
    if (!user) throw new ServerError(404, `User with id - ${id} not found`);
    return user;
  }

  async addUser(username: string, age: number, hobbies: string[]) {
    const id = randomUUID();
    const user = { id, username, age, hobbies };
    const users = await readUsersFile();
    (users as User[]).push(user);
    await writeToFile(users);
    return user;
  }

  async editUser(id: string, username: string, age: number, hobbies: string[]) {
    this.checkId(id);
    const users = await readUsersFile();
    const userIndex = users.findIndex((user: User) => user.id === id);
    if (userIndex === -1) throw new ServerError(404, `User with id - ${id} not found`);
    const user =  {
      id, username, age, hobbies
    };
    users[userIndex] = user
    await writeToFile(users);
    return user;
  }

  async deleteUser(id: string): Promise<boolean> {
    this.checkId(id);
    const users = await readUsersFile();
    const userIndex = users.findIndex((user: User) => user.id === id);
    if (userIndex === -1) throw new ServerError(404, `User with id - ${id} not found`);
    users.splice(userIndex, 1);
    await writeToFile(users);
    return true;
  }

  private checkId(id: string) {
    const regexV4 = new RegExp(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i);
    if (!regexV4.test(id)) throw new ServerError(400, 'UUID is not valid');
  }
}
