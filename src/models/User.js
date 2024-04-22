/**
 * User model
 */
class User {
  constructor(data = {}) {
    this.userId = null;
    this.password = null;
    this.username = null;
    this.token = null;
    this.status = null;
    Object.assign(this, data);
  }
}

export default User;
