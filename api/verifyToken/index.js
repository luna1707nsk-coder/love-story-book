let usersDB = global.usersDB || {};
global.usersDB = usersDB;

export default function handler(req, res) {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ valid: false });
  }

  const user = Object.values(usersDB).find(u => u.token === token);

  if (!user) {
    return res.status(200).json({ valid: false });
  }

  return res.status(200).json({ valid: true });
}