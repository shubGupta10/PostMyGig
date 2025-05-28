const LIVE_URL = process.env.NEXT_PUBLIC_LIVE_URL || "http://localhost:3000";

export const postMyGigVerificationTemplate = (name: string, code: string) => {
  return `
    <div style="font-family: Inter, sans-serif; background-color: #f8fafc; padding: 32px;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 24px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        <h1 style="font-size: 24px; font-weight: 600; color: #0f172a;">
          👋 Welcome to <span style="color: #2563eb;">PostMyGig</span>, ${name}!
        </h1>
        <p style="margin-top: 16px; font-size: 16px; color: #334155; line-height: 1.6;">
          Thanks for signing up! To verify your email and complete account creation, please use the code below:
        </p>
        <div style="margin-top: 24px; padding: 16px; background-color: #f1f5f9; border-radius: 8px; text-align: center;">
          <span style="font-size: 28px; font-weight: bold; color: #0f172a; letter-spacing: 4px;">
            ${code}
          </span>
        </div>
        <p style="margin-top: 24px; font-size: 16px; color: #475569;">
          Enter this code in the signup form to verify your email address. This code will expire in 10 minutes.
        </p>
        <p style="margin-top: 32px; font-size: 14px; color: #94a3b8;">
          Didn’t request this code? You can safely ignore this email or contact us at <a href="mailto:support@postmygig.com" style="color: #2563eb;">support@postmygig.com</a>.
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
          <a href="${LIVE_URL}/applications/view-applications?gigId=${gigId}"
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


export const postMyGigResetPasswordTemplate = (name: string, resetUrl: string) => {
  return `
    <div style="font-family: Inter, sans-serif; background-color: #f8fafc; padding: 32px;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 24px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        <h1 style="font-size: 24px; font-weight: 600; color: #0f172a;">
          🔒 Password Reset Request - <span style="color: #2563eb;">PostMyGig</span>
        </h1>
        <p style="margin-top: 16px; font-size: 16px; color: #334155; line-height: 1.6;">
          Hi ${name}, we received a request to reset your password for your PostMyGig account.
        </p>
        <p style="margin-top: 16px; font-size: 16px; color: #334155; line-height: 1.6;">
          Click the button below to create a new password. This link will expire in 15 minutes for security reasons.
        </p>
        <div style="margin-top: 24px; text-align: center;">
          <a href="${resetUrl}" 
             style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 16px;">
            Reset Your Password
          </a>
        </div>
        <p style="margin-top: 24px; font-size: 14px; color: #475569; line-height: 1.6;">
          If the button doesn't work, you can also copy and paste this link into your browser:
        </p>
        <div style="margin-top: 8px; padding: 12px; background-color: #f1f5f9; border-radius: 6px; word-break: break-all;">
          <span style="font-size: 14px; color: #334155;">
            ${resetUrl}
          </span>
        </div>
        <div style="margin-top: 24px; padding: 16px; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 6px;">
          <p style="font-size: 14px; color: #92400e; margin: 0; font-weight: 500;">
            ⚠️ Security Notice: If you didn't request this password reset, please ignore this email or contact us immediately.
          </p>
        </div>
        <p style="margin-top: 32px; font-size: 14px; color: #94a3b8;">
          Need help? Contact us at <a href="mailto:support@postmygig.com" style="color: #2563eb;">support@postmygig.com</a>.<br />
          This is an automated email from PostMyGig. Please do not reply to this email.
        </p>
      </div>
    </div>
  `;
};

export const postMyGigPingRejectionTemplate = (userName: string, gigTitle: string) => {
  return `
    <div style="font-family: Inter, sans-serif; background-color: #f8fafc; padding: 32px;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 24px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        <h1 style="font-size: 24px; font-weight: 600; color: #0f172a;">
          📩 Update on Your Ping - <span style="color: #2563eb;">PostMyGig</span>
        </h1>
        <p style="margin-top: 16px; font-size: 16px; color: #334155; line-height: 1.6;">
          Hi ${userName}, we have an update regarding your ping for the gig: <strong>"${gigTitle}"</strong>.
        </p>
        <div style="margin-top: 24px; padding: 16px; background-color: #fef2f2; border-left: 4px solid #ef4444; border-radius: 6px;">
          <p style="font-size: 16px; color: #991b1b; line-height: 1.6; margin: 0; font-weight: 500;">
            Unfortunately, the gig poster has decided to move forward with other candidates for this opportunity.
          </p>
        </div>
        <p style="margin-top: 24px; font-size: 16px; color: #334155; line-height: 1.6;">
          We know this isn't the news you were hoping for, but don't let it discourage you! There are many other exciting opportunities waiting for you on PostMyGig.
        </p>
        <div style="margin-top: 24px;">
          <a href="${LIVE_URL}/view-gigs"
             style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: 500; font-size: 16px;">
            Explore More Gigs
          </a>
        </div>
        <div style="margin-top: 24px; padding: 16px; background-color: #f0f9ff; border-left: 4px solid #0ea5e9; border-radius: 6px;">
          <p style="font-size: 14px; color: #0c4a6e; margin: 0; line-height: 1.5;">
            💡 <strong>Pro Tip:</strong> Keep refining your profile and ping messages. The right opportunity is just around the corner!
          </p>
        </div>
        <p style="margin-top: 24px; font-size: 14px; color: #475569; line-height: 1.6;">
          As part of our beta community, your feedback helps us improve PostMyGig for India's freelancers. Follow us on X at <a href="https://x.com/i_m_shubham45" style="color: #2563eb;">@i_m_shubham45</a> for updates and tips!
        </p>
        <p style="margin-top: 32px; font-size: 14px; color: #94a3b8;">
          Questions or need support? We're here to help at <a href="mailto:support@postmygig.com" style="color: #2563eb;">support@postmygig.com</a>.<br />
          This is an automated notification from PostMyGig.
        </p>
      </div>
    </div>
  `;
};