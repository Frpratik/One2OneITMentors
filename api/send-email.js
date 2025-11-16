// api/send-email.js
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',  // Allow GitHub Pages (change to specific domain later for security)
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default async function handler(req, res) {
  // Handle preflight OPTIONS
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

  try {
    // 1. Email to YOU (use a simple from address for now)
    await resend.emails.send({
      from: 'onetooneitmentors@gmail.com',  // Use your verified Gmail (change back later)
      to: process.env.ADMIN_EMAIL,
      subject: `New Inquiry: ${name}`,
      html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong><br>${message.replace(/\n/g, '<br>')}</p>`
    });

    // 2. Auto-reply to USER
    await resend.emails.send({
      from: 'onetooneitmentors@gmail.com',
      to: email,
      subject: 'We Got Your Message!',
      html: `<p>Hi <strong>${name}</strong>,</p><p>Thanks for reaching out! I'll get back to you within 24 hours.</p><p>Best,<br><strong>Pratik Ghuge</strong></p>`
    });

    res.writeHead(200, { ...corsHeaders, 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true }));
  } catch (error) {
    console.error('Email error:', error);  // Logs to Vercel for debugging
    res.writeHead(500, { ...corsHeaders, 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: error.message }));
  }
}