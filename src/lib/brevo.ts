/**
 * Brevo Email Service
 * Handles sending emails and managing subscriber lists via Brevo API
 */

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_SENDER_EMAIL = process.env.BREVO_SENDER_EMAIL || 'noreply@rizzosai.com';
const BREVO_SENDER_NAME = process.env.BREVO_SENDER_NAME || 'RizzoSAI';
const BREVO_API_URL = 'https://api.brevo.com/v3';

interface BrevoContact {
  email: string;
  firstName?: string;
  lastName?: string;
  attributes?: Record<string, any>;
}

interface BrevoEmailPayload {
  sender: {
    name: string;
    email: string;
  };
  to: Array<{
    email: string;
    name?: string;
  }>;
  subject: string;
  htmlContent: string;
  textContent?: string;
}

/**
 * Send an email via Brevo
 */
export async function sendEmail(
  recipientEmail: string,
  recipientName: string = '',
  subject: string,
  htmlContent: string,
  textContent?: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  if (!BREVO_API_KEY) {
    console.error('BREVO_API_KEY is not configured');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const payload: BrevoEmailPayload = {
      sender: {
        name: BREVO_SENDER_NAME,
        email: BREVO_SENDER_EMAIL,
      },
      to: [
        {
          email: recipientEmail,
          name: recipientName,
        },
      ],
      subject,
      htmlContent,
      textContent: textContent || subject,
    };

    const response = await fetch(`${BREVO_API_URL}/smtp/email`, {
      method: 'POST',
      headers: {
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Brevo API error:', error);
      return { success: false, error: error.message || 'Failed to send email' };
    }

    const result = await response.json();
    return {
      success: true,
      messageId: result.messageId,
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Subscribe a contact to a Brevo list
 */
export async function subscribeToList(
  email: string,
  listId: number | string,
  firstName: string = '',
  lastName: string = '',
  attributes?: Record<string, any>
): Promise<{ success: boolean; error?: string }> {
  if (!BREVO_API_KEY) {
    console.error('BREVO_API_KEY is not configured');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const payload = {
      emails: [email],
      attributes: {
        FIRSTNAME: firstName,
        LASTNAME: lastName,
        ...attributes,
      },
    };

    const response = await fetch(`${BREVO_API_URL}/contacts/lists/${listId}/contacts/add`, {
      method: 'POST',
      headers: {
        'api-key': BREVO_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Brevo API error:', error);
      return { success: false, error: error.message || 'Failed to subscribe' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error subscribing to list:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send a welcome email and subscribe user to list
 */
export async function sendWelcomeEmail(
  userEmail: string,
  userName: string = 'there',
  listId: number | string = process.env.BREVO_LIST_ID || 6
): Promise<{ success: boolean; error?: string }> {
  // Extract first name if available
  const firstName = userName.split(' ')[0] || '';
  const lastName = userName.split(' ').slice(1).join(' ') || '';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0;">Welcome to RizzoSAI! 🚀</h1>
        </div>
        
        <div style="padding: 40px 20px; background: #f9f9f9;">
          <p>Hi ${firstName},</p>
          
          <p>Thanks for joining RizzoSAI! We're excited to have you on board.</p>
          
          <p>Here's what you can do now:</p>
          <ul style="line-height: 1.8;">
            <li><strong>Generate Websites:</strong> Create stunning websites with AI in seconds</li>
            <li><strong>Connect Custom Domains:</strong> Use your own domain for generated sites</li>
            <li><strong>Create Content:</strong> Generate blog posts, social media ads, and videos</li>
            <li><strong>Track Analytics:</strong> Monitor your website performance</li>
          </ul>
          
          <p style="margin-top: 30px;">
            <a href="https://rizzosai.com/dashboard" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Go to Dashboard</a>
          </p>
          
          <p style="margin-top: 30px; font-size: 14px; color: #666;">
            Questions? Reply to this email or check out our documentation.
          </p>
          
          <p style="margin-top: 20px; font-size: 12px; color: #999;">
            © 2026 RizzoSAI. All rights reserved.
          </p>
        </div>
      </body>
    </html>
  `;

  const textContent = `
Welcome to RizzoSAI!

Hi ${firstName},

Thanks for joining RizzoSAI! We're excited to have you on board.

Here's what you can do now:
- Generate Websites: Create stunning websites with AI in seconds
- Connect Custom Domains: Use your own domain for generated sites
- Create Content: Generate blog posts, social media ads, and videos
- Track Analytics: Monitor your website performance

Visit your dashboard: https://rizzosai.com/dashboard

Questions? Reply to this email or check out our documentation.

© 2026 RizzoSAI. All rights reserved.
  `;

  try {
    // Send email
    const emailResult = await sendEmail(
      userEmail,
      userName,
      'Welcome to RizzoSAI! 🚀',
      htmlContent,
      textContent
    );

    if (!emailResult.success) {
      console.error('Failed to send welcome email:', emailResult.error);
    }

    // Subscribe to list
    const subscribeResult = await subscribeToList(
      userEmail,
      listId,
      firstName,
      lastName,
      {
        SIGNUP_DATE: new Date().toISOString().split('T')[0],
      }
    );

    if (!subscribeResult.success) {
      console.error('Failed to subscribe to list:', subscribeResult.error);
    }

    return {
      success: emailResult.success && subscribeResult.success,
      error: !emailResult.success ? emailResult.error : subscribeResult.error,
    };
  } catch (error) {
    console.error('Error in sendWelcomeEmail:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
