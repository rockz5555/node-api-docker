import bcrypt from 'bcryptjs';

import { Auth } from '../models/authModel.js';

export const signup = async (req, res) => {
  const { username, password } = req.body;

  try {
    const userExist = await Auth.findOne({ username });

    if (userExist) {
      return res.status(409).json({
        status: false,
        message: 'Username has already taken',
      });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const hashedUser = {
      username,
      password: hashedPassword,
    };
    const user = await Auth.create(hashedUser);

    res.status(201).json({
      status: true,
      data: user,
    });
  } catch (e) {
    res.status(400).json({
      status: false,
      error: e.message,
    });
  }
};

export const signin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await Auth.findOne({ username });
    let passwordMatched = false;

    if (user) {
      passwordMatched = await bcrypt.compare(password, user.password);
    }

    if (!user || !passwordMatched) {
      return res.status(400).json({
        status: false,
        message: 'Your username/password is incorrect',
      });
    }
    req.session.user = user;

    res.status(200).json({
      status: true,
      message: 'You have successfully signed in',
    });
  } catch (e) {
    res.status(400).json({
      status: false,
    });
  }
};
