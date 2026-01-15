import { Order } from "@/types";

// Chaves fornecidas pelo usuário
const SECRET_KEY = 'sk_live_94650bee9996e1d54b0007ebc6c58cb51a7074b9f2ec8e3497a12440a984f9cd';
// Endpoint correto conforme documentação crawlada
const API_BASE_URL = 'https://api.blackcatpagamentos.online/api';

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

// Hardcoded test data (Garantindo CPF/Documento completo)
const TEST_CUSTOMER = {
  name: "Cliente Teste Sushiaki",
  email: "teste@sushiaki.com",
  phone: "41999999999",
  document: "12345678901" // CPF de teste válido (apenas números)
};

// Helper function to validate required fields
function validateOrderData(order: Order): { valid: boolean; error?: string } {
  if (!order || !order.total || order.total <= 0) {
    return { valid: false, error: "Valor do pedido inválido" };
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
  
  const totalAmount = order.total;
  const amountInCents = Math.round(totalAmount * 100);
  console.log(`Calculated total amount: R$${totalAmount.toFixed(2)} = ${amountInCents} cents`);
  
  // Construct Shipping Object (Required for tangible products)
  // Mapeando dados do endereço do pedido
  const shipping = {
    name: order.customer?.name || TEST_CUSTOMER.name,
    street: order.address.street,
    number: order.address.number,
    complement: order.address.complement || "",
    neighborhood: order.address.neighborhood,
    city: order.address.city,
    state: order.address.state, // UF (2 chars)
    zipCode: cleanCEP(order.address.cep)
  };

  return {
    amount: amountInCents, 
    currency: "BRL",
    paymentMethod: "pix",
    items: order.items.map(item => {
      const itemPrice = item.details?.selectedVariation?.option.price || item.price;
      const itemPriceInCents = Math.round(itemPrice * 100);
      return {
        title: item.name,
        quantity: item.quantity,
        unitPrice: itemPriceInCents,
        tangible: true, // Food is tangible
      };
    }),
    customer: {
      name: order.customer?.name || TEST_CUSTOMER.name,
      email: order.customer?.email || TEST_CUSTOMER.email,
      phone: cleanPhone(order.customer?.phone || TEST_CUSTOMER.phone),
      document: {
        type: "cpf",
        number: cleanPhone(order.customer?.cpf || TEST_CUSTOMER.document)
      }
    },
    shipping: shipping, // Adicionado objeto shipping obrigatório
    pix: {
      expiresInDays: 1 // Default from docs example
    },
    externalRef: order.id || `PEDIDO-${Date.now()}`,
    metadata: JSON.stringify({
      orderId: order.id,
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
    
    // CORREÇÃO CRÍTICA:
    // 1. Endpoint: /sales/create-sale
    // 2. Header: X-API-Key
    
    const response = await fetch(`${API_BASE_URL}/sales/create-sale`, {
      method: 'POST',
      headers: {
        'X-API-Key': SECRET_KEY, // Header correto conforme documentação
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    console.log("API Response status:", response.status);
    const responseText = await response.text();
    console.log("API Response text:", responseText);
    
    if (!response.ok) {
      let errorMessage = `Erro na API Blackcat Pay: ${response.status} ${response.statusText}`;
      try {
        const errorData = JSON.parse(responseText);
        if (errorData.message) errorMessage += `. Mensagem: ${errorData.message}`;
        if (errorData.error) errorMessage += `. Erro: ${errorData.error}`;
      } catch (e) {
        errorMessage += `. Resposta: ${responseText}`;
      }
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
    
    const data = JSON.parse(responseText);
    
    // Validação da resposta de sucesso
    if (!data.success || !data.data) {
       throw new Error("Resposta da API inválida: sucesso=false ou dados ausentes");
    }

    const transactionData = data.data;

    console.log("Transaction created successfully:", transactionData);
    
    // Mapeamento correto dos campos de resposta
    return {
      success: true,
      transactionId: transactionData.transactionId,
      qrCode: transactionData.paymentData.qrCodeBase64, // A imagem base64 para exibir
      qrCodeUrl: null, 
      pixKey: transactionData.paymentData.copyPaste, // O código copia e cola
      expiresAt: transactionData.paymentData.expiresAt, // Data de expiração
      amount: order.total,
      transactionData: transactionData
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
    // Endpoint: /sales/{id}/status
    // Header: X-API-Key
    
    const response = await fetch(`${API_BASE_URL}/sales/${transactionId}/status`, {
      method: 'GET',
      headers: {
        'X-API-Key': SECRET_KEY,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Error checking payment status:', errorData);
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Docs response structure: { success: true, data: { status: 'PAID', ... } }
    const statusData = data.data;

    return {
      success: true,
      status: statusData.status.toLowerCase(), // Convert to lowercase to match frontend expectations (approved/paid)
      amount: statusData.amount / 100,
      paidAt: statusData.paidAt
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
  const maxAttempts = 120; 
  
  const checkStatus = async () => {
    attempts++;
    const result = await checkPaymentStatus(transactionId);
    
    if (result.success) {
      console.log(`Payment status check ${attempts}:`, result.status);
      
      // Map API status to frontend logic
      // Docs say: PENDING, PAID, CANCELLED, REFUNDED
      const status = result.status; // already lowercased above

      if (status === 'paid' || status === 'approved') {
        console.log('✓ Pagamento confirmado!');
        clearInterval(pollingInterval);
        onSuccess(result);
      } else if (status === 'cancelled' || status === 'declined') {
        console.log('✗ Pagamento cancelado/recusado');
        clearInterval(pollingInterval);
        onError('Pagamento cancelado');
      } 
      // Keep polling if PENDING
    } else {
      console.error('Error checking payment status:', result.error);
      if (attempts >= maxAttempts) {
        clearInterval(pollingInterval);
        onError('Timeout ao verificar pagamento');
      }
    }
  };
  
  pollingInterval = setInterval(checkStatus, 5000);
  
  return () => {
    clearInterval(pollingInterval);
  };
}

export function formatTimeRemaining(expiresAt: string): string {
  if (!expiresAt) return "10:00"; // Fallback
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
