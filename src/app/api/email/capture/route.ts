import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/email/capture
 * Adds an email to Brevo mailing list
 */
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    const brewvoApiKey = process.env.BREVO_API_KEY;
    const brevoListId = process.env.BREVO_LIST_ID;

    if (!brewvoApiKey || !brevoListId) {
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }

    try {
      // Add contact to Brevo
      const response = await fetch(
        'https://api.brevo.com/v3/contacts',
        {
          method: 'POST',
          headers: {
            'api-key': brewvoApiKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            listIds: [parseInt(brevoListId)],
            updateEnabled: true,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.text();
        console.error('Brevo API error:', error);
        
        // Don't fail if contact already exists
        if (response.status === 400 && error.includes('already exists')) {
          return NextResponse.json(
            { success: true, message: 'Already subscribed' },
            { status: 200 }
          );
        }
        
        throw new Error(`Brevo API error: ${response.statusText}`);
      }

      return NextResponse.json(
        { success: true, message: 'Email added successfully' },
        { status: 200 }
      );
    } catch (error: any) {
      console.error('Brevo integration error:', error);
      return NextResponse.json(
        { error: 'Failed to add email' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error capturing email:', error);
    return NextResponse.json(
      { error: 'Failed to process email' },
      { status: 500 }
    );
  }
}
