export const errorHanlder = async (error, req, res, next) => {
  res.status(500).json({ error: error.message });
  next()
}

export default errorHanlder;
