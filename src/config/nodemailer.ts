import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_ACCOUNT,
        pass: process.env.EMAIL_PASSWORD
    }
});

export const sendMail = async (to: string, subject: string, text: string, html: string)=>{
    await transporter.sendMail({
        from: `Kitchen Recipes Team <${process.env.EMAIL_ACCOUNT}>`,
        to: to,
        subject: subject,
        text: text,
        html: html
    })
}