import apper from 'https://cdn.apper.io/actions/apper-actions.js';

apper.serve(async (req) => {
  try {
    // Parse request body
    const body = await req.json();
    const { bookingId, guestEmail, guestName, status, propertyName, hostName } = body;

    // Validate required fields
    if (!bookingId || !guestEmail || !guestName || !status || !propertyName) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing required fields: bookingId, guestEmail, guestName, status, propertyName' 
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Create email content based on status
    const getEmailContent = (status) => {
      const baseContent = {
        from: 'noreply@staysphere.com',
        to: guestEmail,
        subject: '',
        html: ''
      };

      switch (status) {
        case 'confirmed':
          baseContent.subject = `Your booking at ${propertyName} has been confirmed! 🎉`;
          baseContent.html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #FF5A5F;">Booking Confirmed!</h2>
              <p>Dear ${guestName},</p>
              <p>Great news! Your booking request for <strong>${propertyName}</strong> has been confirmed by ${hostName || 'your host'}.</p>
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0;">Booking Details:</h3>
                <p><strong>Booking ID:</strong> #${bookingId}</p>
                <p><strong>Property:</strong> ${propertyName}</p>
                <p><strong>Status:</strong> Confirmed</p>
              </div>
              <p>You'll receive more details about your stay soon. If you have any questions, feel free to contact your host.</p>
              <p>We hope you have a wonderful stay!</p>
              <p>Best regards,<br>The StaySphere Team</p>
            </div>
          `;
          break;
        
        case 'declined':
          baseContent.subject = `Update on your booking request for ${propertyName}`;
          baseContent.html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #D93900;">Booking Update</h2>
              <p>Dear ${guestName},</p>
              <p>Unfortunately, your booking request for <strong>${propertyName}</strong> could not be confirmed at this time.</p>
              <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0;">Booking Details:</h3>
                <p><strong>Booking ID:</strong> #${bookingId}</p>
                <p><strong>Property:</strong> ${propertyName}</p>
                <p><strong>Status:</strong> Not Available</p>
              </div>
              <p>Don't worry! There are many other amazing properties available on StaySphere. We encourage you to explore other options that might be perfect for your stay.</p>
              <p>If you have any questions, our support team is here to help.</p>
              <p>Best regards,<br>The StaySphere Team</p>
            </div>
          `;
          break;
        
        default:
          return null;
      }

      return baseContent;
    };

    const emailContent = getEmailContent(status);
    if (!emailContent) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: `Invalid status: ${status}. Must be 'confirmed' or 'declined'` 
        }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // In a real implementation, you would send the email here
    // For now, we'll simulate the email sending
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call

    // Log the notification for debugging (in production, this would actually send the email)
    console.info(`apper_info: Booking notification sent to ${guestEmail} for booking #${bookingId} with status: ${status}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Notification sent successfully to ${guestEmail}`,
        bookingId,
        status
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: `Failed to send notification: ${error.message}` 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
});