import { randomUUID } from 'crypto';
import users from '../data/users.json' assert { type: 'json' };
import { ServerError } from '../errors/ServerError.js';
import { writeToFile } from '../utils/util.js';

export interface User {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}

export class UserService {
  getAllUsers() {
    return users;
  }

  getUserById(id: string) {
    this.checkId(id);
    const user = users.find((user: User) => user.id === id);
    if (!user) throw new ServerError(404, `User with id - ${id} not found`);
    return user;
  }

  async addUser(username: string, age: number, hobbies: string[]) {
    const id = randomUUID();
    const user = { id, username, age, hobbies };
    (users as User[]).push(user);
    await writeToFile(users);
    return user;
  }

  async editUser(id: string, username: string, age: number, hobbies: string[]) {
    this.checkId(id);
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
