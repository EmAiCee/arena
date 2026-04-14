interface PaystackResponse {
  status: boolean;
  message: string;
  data?: {
    reference: string;
    amount: number;
    status: string;
    transaction_date: string;
  };
}

export async function initializePayment(
  email: string,
  amount: number,
  metadata: any
): Promise<{ reference: string; authorizationUrl: string }> {
  try {
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: amount * 100, // Paystack uses kobo/cents
        currency: 'NGN',
        metadata,
        callback_url: `${process.env.NEXTAUTH_URL}/payment/callback`,
      }),
    });

    const data = await response.json();
    
    if (data.status) {
      return {
        reference: data.data.reference,
        authorizationUrl: data.data.authorization_url,
      };
    }
    
    throw new Error(data.message);
  } catch (error) {
    console.error('Paystack initialization error:', error);
    throw error;
  }
}

export async function verifyPayment(reference: string): Promise<PaystackResponse> {
  try {
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Paystack verification error:', error);
    throw error;
  }
}