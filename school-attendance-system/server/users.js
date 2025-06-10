const users = [
  {
    name: 'Admin',
    phone: 'jit22',
    password: '15511904',
    role: 'admin'
  }
];

function findUserByPhone(phone) {
  return users.find(u => u.phone === phone);
}

function addUser(user) {
  users.push(user);
}

module.exports = { users, findUserByPhone, addUser };
 