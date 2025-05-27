
export const postMyGigWelcomeTemplate = (name: string) => {
  return `
    <div style="font-family: Inter, sans-serif; background-color: #f8fafc; padding: 32px;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 24px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        <h1 style="font-size: 24px; font-weight: 600; color: #0f172a;">
          👋 Welcome to <span style="color: #2563eb;">PostMyGig</span>, ${name}!
        </h1>
        <p style="margin-top: 16px; font-size: 16px; color: #334155; line-height: 1.6;">
          You’re one of the first to join PostMyGig, a new freelance platform built for India’s creators! 🌟<br/>
          We’re in beta, and your feedback will shape our mission to connect freelancers and clients seamlessly. 
          Post gigs, discover projects, or send secure pings—all for free.
        </p>
        <div style="margin-top: 24px;">
          <a href="https://postmygig.vercel.app/dashboard"
             style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 500; font-size: 16px;">
            Explore Your Dashboard
          </a>
        </div>
        <p style="margin-top: 32px; font-size: 14px; color: #94a3b8;">
          Questions? Reach out at <a href="mailto:support@postmygig.com" style="color: #2563eb;">support@postmygig.com</a>.<br/>
          If you didn’t sign up, please ignore this email or contact us to opt out.
        </p>
      </div>
    </div>
  `;
};


export const postMyGigPingTemplate = ({
  receiverName,
  senderName,
  senderEmail,
  gigTitle,
  gigId,
  message,
}: {
  receiverName: string;
  senderName: string;
  senderEmail: string;
  gigTitle: string;
  gigId: string;
  message: string;
}) => {
  // Sanitize message to prevent XSS (basic example, use a library like sanitize-html in production)
  const sanitizedMessage = message
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  return `
    <div style="font-family: Arial, sans-serif; background-color: #f8fafc; padding: 32px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 24px; border-radius: 12px; box-shadow: 0 4px 4px rgba(0,0,0,0.1);">
        <h2 style="font-size: 24px; font-weight: 600; color: #0f172a;">
          🌟 Hey ${receiverName}, you’ve got a new ping!
        </h2>
        <p style="margin-top: 16px; font-size: 16px; color: #334155; line-height: 1.6;">
          <strong>${senderName}</strong> (<a href="mailto:${senderEmail}" style="color: #2563eb;">${senderEmail}</a>) is interested in your gig: <strong>“${gigTitle}”</strong>.
        </p>
        <div style="margin-top: 12px; padding: 16px; background-color: #f1f5f9; border-left: 4px solid #2563eb; border-radius: 6px;">
          <p style="font-size: 16px; color: #334155; line-height: 1.6; margin: 0;">
            <strong>Message from ${senderName}:</strong><br />
            "${sanitizedMessage}"
          </p>
        </div>
        <p style="margin-top: 16px; font-size: 16px; color: #334155; line-height: 1.6;">
          As an early beta tester, you’re shaping PostMyGig for India’s freelancers! Reply directly via email or view details in your dashboard to connect.
        </p>
        <div style="margin-top: 24px;">
          <a href="https://postmygig.vercel.app/applications/view-applications?gigId=${gigId}"
             style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 500; font-size: 16px;">
            View Ping Details
          </a>
        </div>
        <p style="margin-top: 16px; font-size: 14px; color: #475569;">
          Contacts are shared with consent, keeping privacy first. Join our beta community on X at <a href="https://x.com/i_m_shubham45" style="color: #2563eb;">@i_m_shubham45</a> for updates!
        </p>
        <p style="margin-top: 32px; font-size: 14px; color: #94a3b8;">
          Questions? Reach out at <a href="mailto:support@postmygig.com" style="color: #2563eb;">support@postmygig.com</a>.<br />
          If you didn’t expect this email, please ignore it or contact us to opt out.
        </p>
      </div>
    </div>
  `;
};

