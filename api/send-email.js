import nodemailer from 'nodemailer';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.writeHead(200, corsHeaders);
    return res.end();
  }

  if (req.method !== 'POST') {
    res.writeHead(405, { ...corsHeaders, 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'Method not allowed' }));
  }

  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    res.writeHead(400, { ...corsHeaders, 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ error: 'Missing fields' }));
  }

  // Create transporter with Gmail SMTP (FIXED: createTransport, not createTransporter)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,     // onetooneitmentors@gmail.com
      pass: process.env.EMAIL_PASS,     // Your 16-char app password
    },
  });

  try {
    // 1. Email to YOU (admin)
    await transporter.sendMail({
      from: `"One2One IT Mentors" <${process.env.EMAIL_USER}>`,  // Your Gmail
      to: process.env.ADMIN_EMAIL,
      subject: `New Inquiry: ${name}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong><br>${message.replace(/\n/g, '<br>')}</p>`,
    });

    // 2. Auto-reply to USER
    await transporter.sendMail({
      from: `"One2One IT Mentors" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'We Got Your Message!',
      html: `<p>Hi <strong>${name}</strong>,</p><p>Thanks for reaching out! I'll get back to you within 24 hours.</p><p>Best,<br><strong>Pratik Ghuge</strong></p>`,
    });

    res.writeHead(200, { ...corsHeaders, 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true }));
  } catch (error) {
    console.error('Email error:', error);
    res.writeHead(500, { ...corsHeaders, 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: error.message }));
  }
}