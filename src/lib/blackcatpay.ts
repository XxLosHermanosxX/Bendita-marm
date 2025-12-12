// src/lib/blackcatpay.ts
import { Order, PaymentMethod } from "@/types";

const BLACKCATPAY_API_URL = "https://api.blackcatpagamentos.com/v1";
const SECRET_KEY = "sk_jatFTlsz-CMluRfzHixO_ax-b5l9gTH2ulxu8-pujt5piFu8";

// Helper function to convert amount to cents
const toCents = (amount: number): number => {
  return Math.round(amount * 100);
};

// Helper function to convert cents to amount
const toAmount = (cents: number): number => {
  return cents / 100;
};

// Get Base64 encoded auth header
const getAuthHeader = (): string => {
  return `Basic ${btoa(SECRET_KEY + ':')}`;
};

// Convert order data to BlackCatPay transaction format
const formatOrderData = (order: Order): any => {
  // Calculate total amount in cents
  const totalAmount = toCents(order.total);

  return {
    amount: totalAmount,
    currency: "BRL",
    payment_method: "pix",
    pix: {
      expires_in: 600 // 10 minutes in seconds
    },
    customer: {
      name: order.customer.name,
      email: order.customer.email,
      phone: order.customer.phone.replace(/\D/g, ''),
      document: order.customer.cpf?.replace(/\D/g, '') || undefined
    },
    shipping: {
      address: order.address.street,
      number: order.address.number,
      complement: order.address.complement,
      neighborhood: order.address.neighborhood,
      city: order.address.city,
      state: order.address.state,
      zip_code: order.address.cep.replace(/\D/g, '')
    },
    external_reference: `PEDIDO-${order.id}`,
    metadata: {
      orderId: order.id,
      userId: "user_" + Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toISOString()
    }
  };
};

export const createPixTransaction = async (order: Order) => {
  try {
    const payload = formatOrderData(order);

    const response = await fetch(`${BLACKCATPAY_API_URL}/transactions`, {
      method: 'POST',
      headers: {
        'Authorization': getAuthHeader(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('BlackCatPay API Error:', errorData);
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return {
      success: true,
      transactionId: data.id,
      qrCode: data.pix.qr_code,
      qrCodeUrl: data.pix.qr_code_url,
      pixKey: data.pix.pix_key,
      expiresAt: data.pix.expires_at,
      amount: order.total
    };
  } catch (error) {
    console.error('Error creating PIX transaction:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

export const checkPaymentStatus = async (transactionId: string) => {
  try {
    const response = await fetch(`${BLACKCATPAY_API_URL}/transactions/${transactionId}`, {
      method: 'GET',
      headers: {
        'Authorization': getAuthHeader(),
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return {
      success: true,
      status: data.status,
      amount: toAmount(data.amount),
      paidAt: data.paid_at,
      transactionId: data.id
    };
  } catch (error) {
    console.error('Error checking payment status:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Polling function to check payment status
export const pollPaymentStatus = (
  transactionId: string,
  onSuccess: (data: any) => void,
  onError: (error: string) => void,
  onExpired: () => void,
  maxAttempts: number = 120 // 10 minutes (120 * 5 seconds)
) => {
  let attempts = 0;

  const interval = setInterval(async () => {
    attempts++;

    const result = await checkPaymentStatus(transactionId);

    if (result.success) {
      console.log('Payment status:', result.status);

      if (result.status === 'approved') {
        console.log('✓ Payment confirmed!');
        clearInterval(interval);
        onSuccess(result);
      } else if (result.status === 'declined') {
        console.log('✗ Payment declined');
        clearInterval(interval);
        onError('Payment was declined');
      } else if (result.status === 'expired') {
        console.log('⏰ QR Code expired');
        clearInterval(interval);
        onExpired();
      }
    } else {
      console.error('Error checking status:', result.error);
      if (attempts >= maxAttempts) {
        clearInterval(interval);
        onError('Timeout: Could not verify payment status');
      }
    }
  }, 5000); // Check every 5 seconds

  return () => clearInterval(interval);
};

// Function to format time remaining
export const formatTimeRemaining = (expiresAt: string): string => {
  const expiresDate = new Date(expiresAt);
  const now = new Date();
  const diff = expiresDate.getTime() - now.getTime();

  if (diff <= 0) return "00:00";

  const minutes = Math.floor(diff / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};