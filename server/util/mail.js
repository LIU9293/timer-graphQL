import nodemailer from 'nodemailer';
const key = 'fszltqeejpgfbjci';

export function sendEmail(targetAddress, subject, html){
  const smtpTransport = nodemailer.createTransport({
    host: 'smtp.qq.com',
    port: 465,
    secure: true,
    auth: {
      user: "liukai9293@qq.com", // 账号
      pass: key // 密码
    }
  });

  const mailOptions = {
    from: "Liu Kai <liukai9293@qq.com>", // 发件地址
    to: targetAddress, // 收件列表
    subject, // 标题
    html, // html 内容
  }

  return new Promise((resolve, reject) => {
    smtpTransport.sendMail(mailOptions, (error, response) => {
      if(error){
        console.log(error);
        reject(error);
      }else{
        console.log(response);
        resolve(response);
      }
      smtpTransport.close(); // 如果没用，关闭连接池
    });
  });
}

export function sendActivateEmail(email, token) {
  const activateLink = `http://localhost:3000/rest/activate?token=${token}`;
  return sendEmail(email, 'Activite your email', `
    <p>欢迎注册</p>
    <div>
      <button>
        <a target="_blank" href="${activateLink}">激活</a>
      </button>
    </div>
  `);
}
