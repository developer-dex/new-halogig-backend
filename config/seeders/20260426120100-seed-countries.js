module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert('countries', [
      { id: 1, name: 'India', countries_isd_code: '91', sort_name: 'in', created_at: '2023-11-15 14:27:44', updated_at: '2023-11-15 14:27:44' },
      { id: 8, name: 'Pakistan', countries_isd_code: '92', sort_name: 'pk', created_at: '2023-11-19 14:50:21', updated_at: '2023-11-19 14:50:21' },
      { id: 9, name: 'Afghanistan', countries_isd_code: '93', sort_name: 'af', created_at: '2023-11-20 04:35:41', updated_at: '2023-11-20 04:35:41' },
      { id: 10, name: 'Zimbambwe', countries_isd_code: '94', sort_name: 'zm', created_at: '2023-11-20 04:39:25', updated_at: '2023-11-20 04:39:25' },
      { id: 11, name: 'Zimbambwe', countries_isd_code: '93', sort_name: 'zm', created_at: '2023-11-29 06:33:45', updated_at: '2023-11-29 06:33:45' },
    ], {});
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('countries', null, {});
  },
};
