import jwt from 'jsonwebtoken';
import chalk from 'chalk';

function verifyToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, 'SESSION_SECRET', (err, decode) => {
      if(err) {
        reject('undefined token!');
      }
      resolve(decode);
    })
  });
}

export {
  verifyToken
}
