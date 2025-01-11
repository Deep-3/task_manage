const jwt = require('jsonwebtoken');
const User  = require('../models/user');
const bcrypt = require('bcrypt');


exports.login = async(req, res) => {
    const { username, password } = req.body;
    try
    {
  const user= await User.findOne({where:{username}});
// console.log(user);
  if (user&& await bcrypt.compare(password,user.password)) {
        const token = jwt.sign({ userrole:user.role }, 'hellodeep', { expiresIn: '7d' });
        return res.json({ token });
}
    }
    catch(err){
        res.status(401).json({ err: err });

    }
};
