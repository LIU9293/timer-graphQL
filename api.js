import express from 'express';
import { activiteUser } from './server/objects';

const router = express();

router.get('/activate', (req, res) => {
  const { token } = req.query;
  if (!token) {
    res.json({
      success: false,
      error: 'No token provided'
    });
  }
  activiteUser(token, (response) => {
    res.json(response);
  });
});

export default router;
