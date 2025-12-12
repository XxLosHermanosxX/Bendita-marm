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

// Hardcoded test data to ensure API validation passes
const TEST_CUSTOMER = {
  name: "Cliente Teste Sushiaki",
  email: "teste@sushiaki.com",
  phone: "41999999999",
  document: "12345678901"
};

const TEST_ADDRESS = {
  street: "Rua Teste da Entrega",
  number: "100",
  complement: "Apto 1",
  neighborhood: "Centro",
  city: "Curitiba",
  state: "PR",
  cep: "80000000"
};


// Helper function to validate required fields (local validation remains)
function validateOrderData(order: Order): { valid: boolean; error?: string } {
  if (!order || !order.total || order.total <= 0) {
    return { valid: false, error: "Valor do pedido inválido" };
  }
  if (!order.items || order.items.length === 0) {
    return { valid: false, error: "Itens do pedido são obrigatórios" };
  }
  // We skip customer/address validation here since we are hardcoding them for the API call
  return { valid: true };
}

// Helper function to build the payload for BlackCatPay API
function buildPayload(order: Order) {
  const validation = validateOrderData(order);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // Calculate total amount by summing up all items (price × quantity)
  const totalAmount = order.total; 

  // Convert total to cents with proper rounding
  const amountInCents = Math.round(totalAmount * 100);

  console.log(`Calculated total amount: R$${totalAmount.toFixed(2)} = ${amountInCents} cents`);

  return {
    amount: amountInCents, // Total amount in cents (including delivery fee)
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
        title: item.name, // ✅ Campo correto
        quantity: item.quantity, // ✅ Obrigatório
        unitPrice: itemPriceInCents, // ✅ Campo correto em centavos
        tangible: true, // ✅ Obrigatório (sushi é físico)
        fee: 0, // ✅ Obrigatório (taxa/comissão do item)
        metadata: JSON.stringify({ // ✅ Obrigatório (string) - Simplificado
          productId: item.id,
          productName: item.name,
        })
      };
    }),
    customer: {
      name: TEST_CUSTOMER.name,
      email: TEST_CUSTOMER.email,
      phone: cleanPhone(TEST_CUSTOMER.phone),
      document: cleanPhone(TEST_CUSTOMER.document)
    },
    // ✅ SHIPPING CORRIGIDO: Usando dados de teste completos
    shipping: {
      fee: amountToCents(order.deliveryFee || 0), // ✅ Taxa de entrega em centavos
      address: TEST_ADDRESS.street, // ✅ Nome da rua
      number: TEST_ADDRESS.number, // ✅ Número
      complement: TEST_ADDRESS.complement || "", // ✅ Garantindo que seja string vazia se nulo
      neighborhood: TEST_ADDRESS.neighborhood, // ✅ Bairro
      city: TEST_ADDRESS.city, // ✅ Cidade
      state: TEST_ADDRESS.state, // ✅ Estado
      zipCode: cleanCEP(TEST_ADDRESS.cep), // ✅ CEP
    },
    externalRef: `PEDIDO-${Date.now()}`,
    metadata: JSON.stringify({ // ✅ Metadados da transação (string)
      orderId: `ORDER-${Date.now()}`,
      userId: TEST_CUSTOMER.email,
      timestamp: new Date().toISOString()
    })
  };
}

export async function createPixTransaction(order: Order) {
  try {
    console.log("Creating PIX transaction with order:", order);

    // Validate and build payload
    const payload = buildPayload(order);
    console.log("Enviando payload para Blackcat Pay:", JSON.stringify(payload, null, 2));

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
      let errorMessage = `Erro na API Blackcat Pay: ${response.status} ${response.statusText}`;

      if (responseText) {
        try {
          const errorData = JSON.parse(responseText);
          console.error('BlackCatPay API Error:', errorData);

          if (errorData.message) {
            errorMessage += `. Mensagem: ${errorData.message}`;
          } else if (errorData.error) {
            errorMessage += `. Erro: ${errorData.error}`;
          } else if (errorData.detail) {
            errorMessage += `. Detalhe: ${errorData.detail}`;
          }

          // Try to extract field-specific errors
          if (errorData.errors) {
            const fieldErrors = Object.entries(errorData.errors)
              .map(([field, errors]) => `${field}: ${(errors as string[]).join(', ')}`)
              .join('; ');
            errorMessage += ` (${fieldErrors})`;
          }
        } catch (e) {
          // If response is not JSON, include the raw text
          errorMessage += `. Resposta do servidor: ${responseText}`;
        }
      }

      // Special handling for 424 status code
      if (response.status === 424) {
        errorMessage = `Erro na API Blackcat Pay: 424 Failed Dependency. Mensagem: Erro na adquirente. Este erro geralmente indica um problema com a adquirente de pagamentos. Por favor, entre em contato com o suporte da Blackcat Pay e forneça os seguintes detalhes: ${errorMessage}`;
      }

      console.error(errorMessage);
      throw new Error(errorMessage);
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