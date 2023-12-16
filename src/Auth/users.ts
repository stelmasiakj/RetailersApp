import axios from 'axios';

class Users {
  static async all() {
    const resp = await axios.get('/users.json');
    return resp.data;
  }
}

export default Users;
