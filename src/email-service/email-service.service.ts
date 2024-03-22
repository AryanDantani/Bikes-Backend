import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  async sendEmail(userData: { email: string; subject: string; html: string }) {
    try {
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.OWNER_EMAIL,
          pass: process.env.OWNER_PASSWORD,
        },
      });
      // console.log(userData.email);
      const data = await transporter.sendMail({
        from: process.env.OWNER_EMAIL,
        to: userData.email,
        subject: userData.subject,
        html: userData.html,
      });
      console.log(data);
      return true; // Email sent successfully
    } catch (error) {
      console.error('Error sending email:', error);
      return false; // Failed to send email
    }
  }
}
