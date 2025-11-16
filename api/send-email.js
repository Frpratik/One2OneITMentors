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

  // Create transporter with Gmail SMTP
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,     // onetooneitmentors@gmail.com
      pass: process.env.EMAIL_PASS,     // Your 16-char app password
    },
  });

  // Fancy HTML Templates (Inline styles for email client compatibility)
  const adminHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Inquiry from ${name}</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap" rel="stylesheet">
      <style>
        body { font-family: 'Inter', sans-serif; background: #f8fafc; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 60px rgba(6, 182, 212, 0.2); }
        .header { background: linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%); padding: 40px 30px; text-align: center; color: white; }
        .header h1 { margin: 0; font-size: 32px; font-weight: 900; }
        .content { padding: 40px 30px; color: #1e293b; line-height: 1.6; }
        .inquiry-card { background: #f8fafc; border-radius: 15px; padding: 25px; margin: 20px 0; border-left: 4px solid #06b6d4; }
        .inquiry-card strong { color: #06b6d4; }
        .message { white-space: pre-wrap; background: white; padding: 20px; border-radius: 10px; border: 1px solid #e2e8f0; font-family: monospace; }
        .footer { background: #f1f5f9; padding: 20px; text-align: center; color: #64748b; font-size: 14px; }
        @media (max-width: 600px) { .container { margin: 10px; border-radius: 10px; } .header, .content { padding: 20px; } .header h1 { font-size: 24px; } }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Inquiry 🚀</h1>
        </div>
        <div class="content">
          <div class="inquiry-card">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
          </div>
          <div class="inquiry-card">
            <p><strong>Message:</strong></p>
            <div class="message">${message}</div>
          </div>
        </div>
        <div class="footer">
          <p>One2One IT Mentors | Empowering IT Careers</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const userHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Thanks for Reaching Out!</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap" rel="stylesheet">
      <style>
        body { font-family: 'Inter', sans-serif; background: #f8fafc; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 20px; overflow: hidden; box-shadow: 0 20px 60px rgba(6, 182, 212, 0.2); }
        .header { background: linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%); padding: 40px 30px; text-align: center; color: white; }
        .header h1 { margin: 0; font-size: 32px; font-weight: 900; }
        .content { padding: 40px 30px; color: #1e293b; line-height: 1.8; text-align: center; }
        .icon { font-size: 64px; margin-bottom: 20px; opacity: 0.8; }
        .cta { display: inline-block; padding: 15px 30px; background: linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%); color: white; text-decoration: none; border-radius: 50px; font-weight: 700; margin: 20px 0; transition: transform 0.3s; }
        .cta:hover { transform: translateY(-2px); }
        .footer { background: #f1f5f9; padding: 20px; text-align: center; color: #64748b; font-size: 14px; }
        @media (max-width: 600px) { .container { margin: 10px; border-radius: 10px; } .header, .content { padding: 20px; } .header h1 { font-size: 24px; } .icon { font-size: 48px; } }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Message Received! ✨</h1>
        </div>
        <div class="content">
          <div class="icon">📧</div>
          <p>Hi <strong>${name}</strong>,</p>
          <p>Thanks for reaching out to One2One IT Mentors! Your inquiry has been received, and I'll personally review it to provide tailored guidance for your IT career acceleration.</p>
          <p>Expect a response within 24-48 hours – let's get you on the path to your dream role! 🚀</p>
          <a href="https://your-github-pages-url.com" class="cta">Visit Our Site</a>
          <p style="font-size: 14px; color: #64748b; margin-top: 30px;">In the meantime, check out our free resources to kickstart your journey.</p>
        </div>
        <div class="footer">
          <p>Best regards,<br><strong>Pratik Ghuge</strong><br>Founder & Lead Mentor | One2One IT Mentors</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    // 1. Email to YOU (admin)
    await transporter.sendMail({
      from: `"One2One IT Mentors" <${process.env.EMAIL_USER}>`,  // Your Gmail
      to: process.env.ADMIN_EMAIL,
      subject: `New Inquiry: ${name} 🚀`,
      html: adminHtml,
    });

    // 2. Auto-reply to USER
    await transporter.sendMail({
      from: `"One2One IT Mentors" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `We Got Your Message, ${name}! ✨`,
      html: userHtml,
    });

    res.writeHead(200, { ...corsHeaders, 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true }));
  } catch (error) {
    console.error('Email error:', error);
    res.writeHead(500, { ...corsHeaders, 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: error.message }));
  }
}