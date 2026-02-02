import nodemailer from "nodemailer";

if (!process.env.APP_USER || !process.env.APP_PASS) {
	throw new Error("SMTP credentials are missing");
}

export const transporter = nodemailer.createTransport({
	host: "smtp.gmail.com",
	port: 587,
	secure: false,
	auth: {
		user: process.env.APP_USER,
		pass: process.env.APP_PASS,
	},
});
