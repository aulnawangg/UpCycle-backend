class User {
  constructor(db) {
    this.db = db;
    this.init();
  }

  init() {
    this.User = this.db.define('User', {
      username: {
        type: 'VARCHAR(255)',
        allowNull: false,
        unique: true,
      },
      email: {
        type: 'VARCHAR(255)',
        allowNull: false,
        unique: true,
      },
      password: {
        type: 'VARCHAR(255)',
        allowNull: false,
      },
    });
  }

  async findByPk(id) {
    return this.User.findByPk(id);
  }

  async findAll() {
    return this.User.findAll();
  }

  async update(data, options) {
    return this.User.update(data, options);
  }

  async updateImage(userId, newImage) {
    return this.User.update({ image: newImage }, { where: { id: userId } });
  }

  async create(data) {
    return this.User.create(data);
  }

  async findOne(options) {
    return this.User.findOne(options);
  }
}

module.exports = User;