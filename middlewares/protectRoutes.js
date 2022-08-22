export const protectRoutes = (req, res, next) => {
  const { user } = req.session;

  if (!user) {
    return res
      .status(401)
      .json({ status: false, message: 'You are not authorized' });
  }
  req.user = user;

  next();
};
