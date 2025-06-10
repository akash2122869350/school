function generateToken(user) {
  // Create a base64 string encoding the user phone and role
  const payload = {
    phone: user.phone,
    role: user.role
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

function decodeToken(token) {
  try {
    // Decode and parse the base64 string to get user details
    const json = Buffer.from(token, 'base64').toString();
    return JSON.parse(json);
  } catch (err) {
    return {};
  }
}

module.exports = { generateToken, decodeToken };
