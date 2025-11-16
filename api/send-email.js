import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    // 1. Email to YOU
    await resend.emails.send({
      from: 'One2One <no-reply@yourdomain.com>',
      to: process.env.ADMIN_EMAIL,
      subject: `New Inquiry: ${name}`,
      html: `<p><strong>Name:</strong> ${name}</p>
             <p><strong>Email:</strong> ${email}</p>
             <p><strong>Message:</strong><br>${message.replace(/\n/g, '<br>')}</p>`
    });

    // 2. Auto-reply to USER
    await resend.emails.send({
      from: 'One2One <no-reply@yourdomain.com>',
      to: email,
      subject: 'We Got Your Message!',
      html: `<p>Hi <strong>${name}</strong>,</p>
             <p>Thanks for reaching out! I'll get back to you within 24 hours.</p>
             <p>Best,<br><strong>Pratik Ghuge</strong></p>`
    });

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}