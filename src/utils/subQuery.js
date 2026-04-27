import { Sequelize } from 'sequelize';

export default {
  bidType() {
    return [
      [
        Sequelize.literal(
          "IFNULL((SELECT COUNT(id) FROM project_bids WHERE status = 'hold' ), 0 )",
        ),
        'onhold_count',
      ],
      [
        Sequelize.literal(
          "IFNULL((SELECT COUNT(id) FROM project_bids WHERE status = 'reject' ), 0 )",
        ),
        'reject_count',
      ],
      [
        Sequelize.literal(
          "IFNULL((SELECT COUNT(id) FROM project_bids WHERE status = 'accept' ), 0 )",
        ),
        'accept_count',
      ],
    ];
  },
};
