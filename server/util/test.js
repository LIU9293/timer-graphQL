const nodemailer = require('nodemailer');
const key = 'fszltqeejpgfbjci';

console.log('------ node mail server start ------');

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
  to: "496356079@qq.com", // 收件列表
  subject: "test email", // 标题
  html: '<p>hello world</p>', // html 内容
}

smtpTransport.sendMail(mailOptions, (error, response) => {
  if(error){
    console.log(error);
  }else{
    console.log(response);
  }
  smtpTransport.close(); // 如果没用，关闭连接池
});
