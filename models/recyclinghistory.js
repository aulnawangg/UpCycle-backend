class RecyclingHistory {
  constructor(db) {
    this.db = db;
    this.init();
  }

  init() {
    this.RecyclingHistory = this.db.define('RecyclingHistory', {
      wasteImage: {
        type: 'VARCHAR(255)',
        allowNull: false,
      },
      recycledProduct: {
        type: 'VARCHAR(255)',
        allowNull: false,
      },
      userId: {
        type: 'INT',
        allowNull: false,
      },
    });
  }

  async findAll() {
    return this.RecyclingHistory.findAll();
  }

  async findByPk(id) {
    return this.RecyclingHistory.findByPk(id);
  }

  async create(data) {
    return this.RecyclingHistory.create(data);
  }

  async destroy(options) {
    return this.RecyclingHistory.destroy(options);
  }
}

module.exports = RecyclingHistory;