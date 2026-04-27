module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('categories', [
      { id: 1, name: 'Development & IT', created_at: '2023-11-29 20:12:32', updated_at: '2023-11-29 20:12:32' },
      { id: 2, name: 'AI Services', created_at: '2023-11-29 20:12:32', updated_at: '2023-11-29 20:12:32' },
      { id: 3, name: 'UI & Design', created_at: '2023-11-29 20:12:32', updated_at: '2023-11-29 20:12:32' },
      { id: 4, name: 'Marketing', created_at: '2023-11-29 20:12:32', updated_at: '2023-11-29 20:12:32' },
      { id: 5, name: 'Content', created_at: '2023-11-29 20:12:32', updated_at: '2023-11-29 20:12:32' },
      { id: 6, name: 'Engineering', created_at: '2023-11-29 20:12:32', updated_at: '2023-11-29 20:12:32' },
      { id: 7, name: 'Video & Animation', created_at: '2023-11-29 20:12:32', updated_at: '2023-11-29 20:12:32' },
      { id: 8, name: 'Infrastructure & Security', created_at: '2026-02-04 22:23:52', updated_at: '2026-02-04 22:23:52' },
    ], {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('categories', null, {});
  },
};
