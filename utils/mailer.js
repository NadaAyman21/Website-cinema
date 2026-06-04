
const nodemailer = require('nodemailer');

async function sendBookingConfirmation({ to, name, movie, date, showtime, hall, seats, totalPrice, orderNumber }) {

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  console.log('Sending booking email to:', to);
  console.log('Using account:', process.env.EMAIL_USER);

  const seatsFormatted = seats.join(' , ');

  const html = `
    <div style="background:#0a0a0f; color:#fff; font-family:'Segoe UI',sans-serif; padding:40px; max-width:600px; margin:auto; border-radius:12px;">
      
      <div style="text-align:center; margin-bottom:30px;">
        <h1 style="color:#c9a84c; font-size:28px; letter-spacing:0.2em; margin:0;">CINEX</h1>
        <p style="color:rgba(255,255,255,0.4); font-size:12px; letter-spacing:0.2em;">CAIRO FESTIVAL CITY · PREMIUM CINEMA</p>
      </div>

      <div style="background:#1a1a2e; border-radius:10px; padding:28px; margin-bottom:20px; border:1px solid rgba(201,168,76,0.2);">
        <h2 style="color:#c9a84c; margin:0 0 6px; font-size:20px;">Booking Confirmation</h2>
        <p style="color:rgba(255,255,255,0.4); font-size:12px; letter-spacing:0.15em; margin:0 0 20px;">${orderNumber}</p>
        
        <p style="color:rgba(255,255,255,0.7); font-size:14px; line-height:1.7; margin:0 0 24px;">
          Thank you <strong style="color:#fff;">${name}</strong>! Your reservation is confirmed. 
          Get ready for an exciting cinematic experience. Enjoy the show! 🎬🍿
        </p>

        <table style="width:100%; border-collapse:collapse;">
          <tr>
            <td style="padding:10px 0; border-bottom:1px solid rgba(255,255,255,0.07); color:rgba(255,255,255,0.4); font-size:12px; letter-spacing:0.1em;">MOVIE</td>
            <td style="padding:10px 0; border-bottom:1px solid rgba(255,255,255,0.07); color:#fff; font-size:14px; font-weight:600; text-align:right;">${movie}</td>
          </tr>
          <tr>
            <td style="padding:10px 0; border-bottom:1px solid rgba(255,255,255,0.07); color:rgba(255,255,255,0.4); font-size:12px; letter-spacing:0.1em;">HALL</td>
            <td style="padding:10px 0; border-bottom:1px solid rgba(255,255,255,0.07); color:#fff; font-size:14px; text-align:right;">${hall} Hall</td>
          </tr>
          <tr>
            <td style="padding:10px 0; border-bottom:1px solid rgba(255,255,255,0.07); color:rgba(255,255,255,0.4); font-size:12px; letter-spacing:0.1em;">DATE</td>
            <td style="padding:10px 0; border-bottom:1px solid rgba(255,255,255,0.07); color:#fff; font-size:14px; text-align:right;">${date}</td>
          </tr>
          <tr>
            <td style="padding:10px 0; border-bottom:1px solid rgba(255,255,255,0.07); color:rgba(255,255,255,0.4); font-size:12px; letter-spacing:0.1em;">SHOWTIME</td>
            <td style="padding:10px 0; border-bottom:1px solid rgba(255,255,255,0.07); color:#fff; font-size:14px; text-align:right;">${showtime}</td>
          </tr>
          <tr>
            <td style="padding:10px 0; border-bottom:1px solid rgba(255,255,255,0.07); color:rgba(255,255,255,0.4); font-size:12px; letter-spacing:0.1em;">SEATS</td>
            <td style="padding:10px 0; border-bottom:1px solid rgba(255,255,255,0.07); color:#c9a84c; font-size:14px; font-weight:600; text-align:right;">${seatsFormatted}</td>
          </tr>
          <tr>
            <td style="padding:14px 0 0; color:rgba(255,255,255,0.4); font-size:12px; letter-spacing:0.1em;">TOTAL PAID</td>
            <td style="padding:14px 0 0; color:#c9a84c; font-size:22px; font-weight:700; text-align:right;">${totalPrice} EGP</td>
          </tr>
        </table>
      </div>

      <div style="text-align:center; padding:20px; background:#1a1a2e; border-radius:10px; border:1px solid rgba(255,255,255,0.07);">
        <p style="color:rgba(255,255,255,0.4); font-size:11px; letter-spacing:0.15em; margin:0 0 8px;">ORDER NUMBER</p>
        <p style="color:#c9a84c; font-size:14px; font-weight:600; letter-spacing:0.1em; margin:0;">${orderNumber}</p>
      </div>

      <p style="text-align:center; color:rgba(255,255,255,0.25); font-size:11px; margin-top:24px;">
        Please present this email or your ticket QR code at the cinema entrance.<br>
        Tickets are non-refundable once purchased.
      </p>

    </div>
  `;

  await transporter.sendMail({
    from:    `"CineX Cinema" <${process.env.EMAIL_USER}>`,
    to,
    subject: `🎬 Booking Confirmed — ${movie} · ${orderNumber}`,
    html
  });
}

async function sendPasswordReset({ to, name, token }) {

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  console.log('Sending password reset email to:', to);

  const resetLink = `http://localhost:5000/reset-password?token=${token}`;

  const html = `
    <div style="background:#0a0a0f; color:#fff; font-family:'Segoe UI',sans-serif; padding:40px; max-width:600px; margin:auto; border-radius:12px;">
      
      <div style="text-align:center; margin-bottom:30px;">
        <h1 style="color:#c9a84c; font-size:28px; letter-spacing:0.2em; margin:0;">CINEX</h1>
        <p style="color:rgba(255,255,255,0.4); font-size:12px; letter-spacing:0.2em;">CAIRO FESTIVAL CITY · PREMIUM CINEMA</p>
      </div>

      <div style="background:#1a1a2e; border-radius:10px; padding:28px; border:1px solid rgba(201,168,76,0.2);">
        <h2 style="color:#c9a84c; margin:0 0 16px; font-size:20px;">Reset Your Password</h2>
        
        <p style="color:rgba(255,255,255,0.7); font-size:14px; line-height:1.7; margin:0 0 24px;">
          Hi <strong style="color:#fff;">${name}</strong>, we received a request to reset your CineX password.
          Click the button below to set a new password. This link expires in <strong style="color:#c9a84c;">1 hour</strong>.
        </p>

        <div style="text-align:center; margin:28px 0;">
          <a href="${resetLink}" 
             style="background:linear-gradient(135deg,#c9a84c,#e8c870); color:#0a1628; font-weight:700; font-size:14px; padding:14px 32px; border-radius:8px; text-decoration:none; letter-spacing:0.1em; display:inline-block;">
            RESET PASSWORD
          </a>
        </div>

        <p style="color:rgba(255,255,255,0.4); font-size:12px; margin:0 0 8px;">Or copy this link into your browser:</p>
        <p style="color:#c9a84c; font-size:12px; word-break:break-all; margin:0;">${resetLink}</p>

        <hr style="border:none; border-top:1px solid rgba(255,255,255,0.07); margin:24px 0;">

        <p style="color:rgba(255,255,255,0.3); font-size:12px; text-align:center; margin:0;">
          If you didn't request a password reset, you can safely ignore this email.<br>
          Your password will not be changed.
        </p>
      </div>

      <p style="text-align:center; color:rgba(255,255,255,0.2); font-size:11px; margin-top:24px;">
        © CineX Cinema · Cairo Festival City
      </p>

    </div>
  `;

  await transporter.sendMail({
    from:    `"CineX Cinema" <${process.env.EMAIL_USER}>`,
    to,
    subject: '🔐 Reset Your CineX Password',
    html
  });
}

module.exports = { sendBookingConfirmation, sendPasswordReset };