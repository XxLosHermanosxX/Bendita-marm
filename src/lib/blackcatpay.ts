import { Order } from "@/types";

const SECRET_KEY = 'sk_jatFTlsz-CMluRfzHixO_ax-b5l9gTH2ulxu8-pujt5piFu8';
const API_BASE_URL = 'https://api.blackcatpagamentos.com/v1';

// Helper function to convert amount to cents with proper rounding
function amountToCents(amount: number): number {
  return Math.round(amount * 100);
}

// Helper function to clean phone number
function cleanPhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

// Helper function to clean CEP
function cleanCEP(cep: string): string {
  return cep.replace(/\D/g, '');
}

// Helper function to validate required fields
function validateOrderData(order: Order): { valid: boolean; error?: string } {
  if (!order || !order.total || order.total <= 0) {
    return { valid: false, error: "Valor do pedido inválido" };
  }

  if (!order.customer || !order.customer.name) {
    return { valid: false, error: "Nome do cliente é obrigatório" };
  }

  if (!order.customer.email) {
    return { valid: false, error: "Email do cliente é obrigatório" };
  }

  if (!order.customer.phone) {
    return { valid: false, error: "Telefone do cliente é obrigatório" };
  }

  if (!order.address) {
    return { valid: false, error: "Endereço é obrigatório" };
  }

  if (!order.address.street || !order.address.cep || !order.address.city || !order.address.state) {
    return { valid: false, error: "Endereço completo é obrigatório" };
  }

  if (!order.items || order.items.length === 0) {
    return { valid: false, error: "Itens do pedido são obrigatórios" };
  }

  return { valid: true };
}

// Helper function to build the payload for BlackCatPay API
function buildPayload(order: Order) {
  const validation = validateOrderData(order);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // Calculate total amount by summing up all items (price × quantity)
  const totalAmount = order.items.reduce((sum, item) => {
    const itemPrice = item.details?.selectedVariation?.option.price || item.price;
    return sum + (itemPrice * item.quantity);
  }, 0);

  // Convert total to cents with proper rounding
  const amountInCents = Math.round(totalAmount * 100);

  console.log(`Calculated total amount: R$${totalAmount.toFixed(2)} = ${amountInCents} cents`);

  return {
    amount: amountInCents, // Total amount in cents
    currency: "BRL",
    paymentMethod: "pix",
    pix: {
      expiresIn: 600 // 10 minutes
    },
    items: order.items.map(item => {
      const itemPrice = item.details?.selectedVariation?.option.price || item.price;
      const itemPriceInCents = Math.round(itemPrice * 100);
      console.log(`Item ${item.name}: R$${itemPrice.toFixed(2)} = ${itemPriceInCents} cents, quantity: ${item.quantity}`);

      return {
        title: item.name, // Corrected field name
        quantity: item.quantity,
        unitPrice: itemPriceInCents, // Corrected field name and converted to cents
        tangible: true // Required boolean field
      };
    }),
    customer: {
      name: order.customer.name,
      email: order.customer.email,
      phone: cleanPhone(order.customer.phone),
      document: order.customer.cpf?.replace(/\D/g, '') || undefined
    },
    shipping: {
      fee: 0, // Required field, assuming 0 if not provided
      address: { // Corrected structure - now an object
        street: order.address.street,
        streetNumber: order.address.number || "SN", // Added streetNumber field
        complement: order.address.complement || undefined,
        neighborhood: order.address.neighborhood || "Centro",
        city: order.address.city,
        state: order.address.state,
        zipCode: cleanCEP(order.address.cep),
        country: "BR" // Added country field with fixed value
      }
    },
    externalRef: `PEDIDO-${Date.now()}`,
    metadata: JSON.stringify({ // Corrected - now a stringified JSON object
      orderId: `ORDER-${Date.now()}`,
      userId: order.customer.email,
      timestamp: new Date().toISOString()
    })
  };
}

export async function createPixTransaction(order: Order) {
  try {
    console.log("Creating PIX transaction with order:", order);

    // Validate and build payload
    const payload = buildPayload(order);
    console.log("Final payload to send:", JSON.stringify(payload, null, 2));

    const auth = btoa(SECRET_KEY + ':');

    const response = await fetch(`${API_BASE_URL}/transactions`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    console.log("API Response status:", response.status);
    const responseText = await response.text();
    console.log("API Response text:", responseText);

    if (!response.ok) {
      try {
        const errorData = JSON.parse(responseText);
        console.error('BlackCatPay API Error:', errorData);

        let errorMessage = "Erro ao criar transação PIX";
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        }

        // Try to extract field-specific errors
        if (errorData.errors) {
          const fieldErrors = Object.entries(errorData.errors)
            .map(([field, errors]) => `${field}: ${(errors as string[]).join(', ')}`)
            .join('; ');
          errorMessage += ` (${fieldErrors})`;
        }

        return {
          success: false,
          error: errorMessage,
          status: response.status,
          response: errorData
        };
      } catch (e) {
        return {
          success: false,
          error: `HTTP error! status: ${response.status}, response: ${responseText}`,
          status: response.status
        };
      }
    }

    const data = JSON.parse(responseText);
    console.log("Transaction created successfully:", data);

    return {
      success: true,
      transactionId: data.id,
      qrCode: data.pix.qrCode,
      qrCodeUrl: data.pix.qrCodeUrl,
      pixKey: data.pix.pixKey,
      expiresAt: data.pix.expiresAt,
      amount: order.total,
      transactionData: data
    };
  } catch (error) {
    console.error('Error in createPixTransaction:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
}

export async function checkPaymentStatus(transactionId: string) {
  try {
    const auth = btoa(SECRET_KEY + ':');

    const response = await fetch(`${API_BASE_URL}/transactions/${transactionId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Error checking payment status:', errorData);
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      status: data.status,
      amount: data.amount / 100,
      paidAt: data.paidAt
    };
  } catch (error) {
    console.error('Error in checkPaymentStatus:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
}

export function pollPaymentStatus(
  transactionId: string,
  onSuccess: (data: any) => void,
  onError: (error: string) => void,
  onExpired: () => void
) {
  let pollingInterval: NodeJS.Timeout;
  let attempts = 0;
  const maxAttempts = 120; // 10 minutes at 5 second intervals

  const checkStatus = async () => {
    attempts++;
    const result = await checkPaymentStatus(transactionId);

    if (result.success) {
      console.log(`Payment status check ${attempts}:`, result.status);

      if (result.status === 'approved') {
        console.log('✓ Pagamento confirmado!');
        clearInterval(pollingInterval);
        onSuccess(result);
      } else if (result.status === 'declined') {
        console.log('✗ Pagamento recusado');
        clearInterval(pollingInterval);
        onError('Pagamento recusado');
      } else if (result.status === 'expired') {
        console.log('⏰ QR Code expirou');
        clearInterval(pollingInterval);
        onExpired();
      }
    } else {
      console.error('Error checking payment status:', result.error);
      if (attempts >= maxAttempts) {
        console.log('Timeout: Parou de verificar');
        clearInterval(pollingInterval);
        onError('Timeout ao verificar pagamento');
      }
    }
  };

  // Start polling every 5 seconds
  pollingInterval = setInterval(checkStatus, 5000);

  // Return function to stop polling
  return () => {
    clearInterval(pollingInterval);
  };
}

export function formatTimeRemaining(expiresAt: string): string {
  const expiresDate = new Date(expiresAt);
  const now = new Date();
  const diff = expiresDate.getTime() - now.getTime();

  if (diff <= 0) {
    return "00:00";
  }

  const minutes = Math.floor(diff / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}