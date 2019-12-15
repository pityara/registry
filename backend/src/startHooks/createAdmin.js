const { ADMIN } = require('../constants/userRoles');

module.exports = async function createAdmin({ UserModel }) {
  const exists = await UserModel.findOne({ where: { role: ADMIN } });

  if (exists) {
    return;
  }

  await UserModel.create({
    role: ADMIN,
    email: 'admin@admin.com',
    firstName: 'Admin',
    lastName: 'Admin',
    password: 'qwerty'
  });
}
