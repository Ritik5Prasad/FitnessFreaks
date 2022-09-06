import RNSmtpMailer from "react-native-smtp-mailer";

export default async function SendMail(obj) {

RNSmtpMailer.sendMail({
  mailhost: "smtp.gmail.com",
  port: "465",
  ssl: true, // optional. if false, then TLS is enabled. Its true by default in android. In iOS TLS/SSL is determined automatically, and this field doesn't affect anything
  username: "trainingessence123@gmail.com",
  password: "intern_pass123",
  fromName: "ritik", // optional
  recipients: obj.sendTo,
  subject: obj.subject,
  htmlBody: obj.body,
})
  .then(success => console.log(success))
  .catch(err => console.log(err));
}
