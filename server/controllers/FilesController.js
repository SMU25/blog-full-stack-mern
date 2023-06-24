export const uploadImage = (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
};
