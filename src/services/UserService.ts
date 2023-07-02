export class UserService {
  getAllUsers() {}

  getUserById(id: string | undefined) {}

  addUser(username: string, age: number, hobbies: string[]) {}

  editUser(sername: string, age: number, hobbies: string[]) {}

  deleteUser(id :string): boolean {
    return true;
  }
}
F