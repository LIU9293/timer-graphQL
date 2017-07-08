import nodemailer from 'nodemailer';
const key = 'fszltqeejpgfbjci';

export function sendEmail(targetAddress, subject, html){
  const smtpTransport = nodemailer.createTransport("SMTP",{
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
  const activateLink = `localhost:3000/api/activate?token=${token}`;
  return sendEmail(email, 'Activite your email', `
    <p>hello world!</p>
    <div>
      <Button>
        <a target="_blank" href="${activateLink}">activate</a>
      </Button>
    </div>
  `);
}
