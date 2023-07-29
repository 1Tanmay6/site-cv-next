import nodemailer from "nodemailer";

async function handler(req, res) {
  // get the form data from the request body
  try {
    const { name, email, subject, message, id } = req.body;

    // create a transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp-mail.outlook.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: "tanmaywork16@outlook.com",
        pass: "tanmayp162004",
      },
    });

    let isfromservice = "not from services";

    if (id !== -1) {
      isfromservice = "from services " + id.toUpperCase();
    }

    // create the email data
    let mailOptions = {
      from: "tanmaywork16@outlook.com",
      to: "tanmaywork16@outlook.com",
      subject,
      text: `Name: ${name}\nEmail: ${email}\n Subject: ${subject}\n Message: ${message} \n Service: ${isfromservice}`,
    };

    // send the email using nodemailer
    await transporter.sendMail(mailOptions);

    // send a success response
    res.status(200).send();
  } catch (error) {
    res.status(500).send();
  }
  // send an error response
}

export default handler;
