/**
 * Game model
 */
class Game {
  constructor(data = {}) {
    this.game_id = null;
    this.users = null;
    this.game_parameter = null;
    this.game_status = null;
    this.session_token = null;
    Object.assign(this, data);
  }
}

export default Game;
