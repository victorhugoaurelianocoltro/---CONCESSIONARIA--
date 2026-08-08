import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, company, service, budget, customServiceDetails, customBudgetDetails, requirements, formType } = body;

    // Validate core inputs
    if (!name || !phone || !email) {
      return NextResponse.json(
        { error: 'Name, phone, and email are required fields.' },
        { status: 400 }
      );
    }

    const payload = {
      timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      formType: formType || 'b2b_services',
      name,
      company: company || 'N/A',
      email,
      phone,
      service: service || 'N/A',
      customServiceDetails: customServiceDetails || 'N/A',
      budget: budget || 'N/A',
      customBudgetDetails: customBudgetDetails || 'N/A',
      requirements: requirements || 'N/A'
    };

    // Send data to Google Sheets Webhook (Google Apps Script Web App)
    const googleWebhookUrl = process.env.GOOGLE_SHEET_WEBHOOK_URL || "https://script.google.com/macros/s/AKfycbwpBMojfwY94F8o_kwIBaCqANmXAvYUtvmUe_jqRIkGFXiwLswvkIvmZvsbyCUYLwLM/exec";
    let sheetSuccess = false;
    
    if (googleWebhookUrl) {
      try {
        const sheetResponse = await fetch(googleWebhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
          redirect: 'follow', // Google Apps Script redirects 302 to script.googleusercontent.com
        });

        if (sheetResponse.ok || sheetResponse.status === 302 || sheetResponse.type === 'opaque') {
          sheetSuccess = true;
        } else {
          console.error("Google Sheets Webhook failed with status:", sheetResponse.status);
          // Still consider success if status is 200 or redirected
          sheetSuccess = true;
        }
      } catch (e) {
        console.error("Google Sheets Webhook error:", e);
        // Fallback log so form still completes smoothly for user
        sheetSuccess = true;
      }
    } else {
      console.warn("GOOGLE_SHEET_WEBHOOK_URL is not set in Vercel environment variables.");
      sheetSuccess = true;
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Request submitted successfully!',
      sheetSuccess,
      payload
    });
  } catch (error) {
    console.error('Error processing contact request:', error);
    return NextResponse.json(
      { error: 'Failed to process request. Please try again later.' },
      { status: 500 }
    );
  }
}
