"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useStore } from "@/store";
import { formatCurrency, formatPhone } from "@/lib/utils";
import { ASSETS } from "@/data/assets";
import { 
  ChevronLeft, 
  MapPin, 
  User, 
  CreditCard, 
  QrCode,
  CheckCircle,
  Truck,
  ShieldCheck,
  Loader2
} from "lucide-react";
import { CheckoutStep } from "@/types";

export default function CheckoutPage() {
  const router = useRouter();
  const { 
    items, 
    deliveryAddress, 
    setDeliveryAddress,
    customer,
    setCustomer,
    getSubtotal, 
    getDeliveryFee, 
    getTotal,
    isDeliveryAvailable,
    clearCart
  } = useStore();

  const [step, setStep] = useState<CheckoutStep>("address");
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "card">("pix");
  
  // Form states
  const [number, setNumber] = useState(deliveryAddress?.number || "");
  const [complement, setComplement] = useState(deliveryAddress?.complement || "");
  const [name, setName] = useState(customer?.name || "");
  const [phone, setPhone] = useState(customer?.phone || "");

  const subtotal = getSubtotal();
  const deliveryFee = getDeliveryFee();
  const total = getTotal();

  // Redirect if no items or no delivery
  useEffect(() => {
    if (items.length === 0 || !isDeliveryAvailable) {
      router.push("/");
    }
  }, [items, isDeliveryAvailable, router]);

  const handleAddressSubmit = () => {
    if (!number) return;
    
    setDeliveryAddress({
      ...deliveryAddress!,
      number,
      complement,
    });
    setStep("personal");
  };

  const handlePersonalSubmit = () => {
    if (!name || !phone || phone.replace(/\D/g, "").length < 10) return;
    
    setCustomer({ name, phone });
    setStep("payment");
  };

  const handlePaymentSubmit = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    clearCart();
    router.push("/checkout/success");
  };

  const steps = [
    { key: "address", label: "Endereço", icon: MapPin },
    { key: "personal", label: "Dados", icon: User },
    { key: "payment", label: "Pagamento", icon: CreditCard },
  ];

  const currentStepIndex = steps.findIndex(s => s.key === step);

  if (items.length === 0) return null;

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#003366] text-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => step === "address" ? router.back() : setStep(steps[currentStepIndex - 1].key as CheckoutStep)}
              className="flex items-center gap-2 text-sm font-medium hover:text-[#FF8C00] transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
              Voltar
            </button>
            
            <div className="relative h-8 w-24">
              <Image src={ASSETS.logo} alt="Plantão do Smash" fill className="object-contain" />
            </div>
            
            <div className="w-16" />
          </div>
        </div>
        
        {/* Progress Steps */}
        <div className="bg-[#002244] py-4">
          <div className="container mx-auto px-4">
            <div className="flex justify-center gap-4">
              {steps.map((s, index) => {
                const Icon = s.icon;
                const isActive = index <= currentStepIndex;
                const isCurrent = s.key === step;
                
                return (
                  <div key={s.key} className="flex items-center gap-3">
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                      isCurrent 
                        ? "bg-[#FF8C00] text-white" 
                        : isActive 
                          ? "bg-[#7CFC00] text-[#003366]" 
                          : "bg-white/10 text-white/50"
                    }`}>
                      {isActive && !isCurrent ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <Icon className="h-4 w-4" />
                      )}
                      <span className="text-sm font-bold hidden sm:inline">{s.label}</span>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`w-8 h-0.5 ${isActive ? "bg-[#7CFC00]" : "bg-white/20"}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-lg">
        {/* Step 1: Address */}
        {step === "address" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-black text-[#003366]">Confirme seu endereço</h1>
              <p className="text-gray-500 mt-1">Para onde devemos entregar?</p>
            </div>

            {/* Address from CEP */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <div className="flex items-start gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-[#7CFC00]/20 flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5 text-[#003366]" />
                </div>
                <div>
                  <p className="font-bold text-[#003366]">{deliveryAddress?.street || "Rua"}</p>
                  <p className="text-sm text-gray-500">
                    {deliveryAddress?.neighborhood}, {deliveryAddress?.city} - {deliveryAddress?.state}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">CEP: {deliveryAddress?.cep}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">
                    Número *
                  </label>
                  <input
                    type="text"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    placeholder="Ex: 123"
                    className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 focus:border-[#FF8C00] focus:outline-none transition-colors"
                  />
                </div>
                
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">
                    Complemento (opcional)
                  </label>
                  <input
                    type="text"
                    value={complement}
                    onChange={(e) => setComplement(e.target.value)}
                    placeholder="Ex: Apto 101, Bloco B"
                    className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 focus:border-[#FF8C00] focus:outline-none transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="flex items-center gap-3 p-4 bg-[#7CFC00]/10 rounded-xl">
              <Truck className="h-5 w-5 text-[#003366]" />
              <div>
                <p className="font-bold text-[#003366] text-sm">Entrega em 25-40 min</p>
                <p className="text-xs text-gray-500">
                  Taxa: {deliveryFee === 0 ? "GRÁTIS" : formatCurrency(deliveryFee)}
                </p>
              </div>
            </div>

            <button
              onClick={handleAddressSubmit}
              disabled={!number}
              className="w-full h-14 rounded-xl bg-[#FF8C00] text-white font-bold text-lg hover:bg-[#FF8C00]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Continuar
            </button>
          </div>
        )}

        {/* Step 2: Personal */}
        {step === "personal" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-black text-[#003366]">Seus dados</h1>
              <p className="text-gray-500 mt-1">Para entrarmos em contato</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">
                  Nome completo *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 focus:border-[#FF8C00] focus:outline-none transition-colors"
                />
              </div>
              
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">
                  WhatsApp *
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(formatPhone(e.target.value))}
                  placeholder="(45) 99999-9999"
                  maxLength={15}
                  className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 focus:border-[#FF8C00] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              onClick={handlePersonalSubmit}
              disabled={!name || phone.replace(/\D/g, "").length < 10}
              className="w-full h-14 rounded-xl bg-[#FF8C00] text-white font-bold text-lg hover:bg-[#FF8C00]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Continuar
            </button>
          </div>
        )}

        {/* Step 3: Payment */}
        {step === "payment" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-black text-[#003366]">Pagamento</h1>
              <p className="text-gray-500 mt-1">Escolha a forma de pagamento</p>
            </div>

            {/* Payment Methods */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setPaymentMethod("pix")}
                className={`p-4 rounded-xl border-2 transition-all ${
                  paymentMethod === "pix" 
                    ? "border-[#FF8C00] bg-[#FF8C00]/5" 
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <QrCode className={`h-8 w-8 mx-auto mb-2 ${paymentMethod === "pix" ? "text-[#FF8C00]" : "text-gray-400"}`} />
                <p className="font-bold text-sm">PIX</p>
                <p className="text-xs text-gray-500">Pagamento instantâneo</p>
              </button>
              
              <button
                onClick={() => setPaymentMethod("card")}
                className={`p-4 rounded-xl border-2 transition-all ${
                  paymentMethod === "card" 
                    ? "border-[#FF8C00] bg-[#FF8C00]/5" 
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <CreditCard className={`h-8 w-8 mx-auto mb-2 ${paymentMethod === "card" ? "text-[#FF8C00]" : "text-gray-400"}`} />
                <p className="font-bold text-sm">Cartão</p>
                <p className="text-xs text-gray-500">Na entrega</p>
              </button>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <h3 className="font-bold text-[#003366] mb-4">Resumo do Pedido</h3>
              
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.quantity}x {item.product.name}
                    </span>
                    <span className="font-medium">
                      {formatCurrency(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="border-t mt-4 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Entrega</span>
                  <span className={deliveryFee === 0 ? "text-[#7CFC00] font-bold" : ""}>
                    {deliveryFee === 0 ? "GRÁTIS" : formatCurrency(deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-black text-[#003366] pt-2 border-t">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>

            {/* Security Badge */}
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <ShieldCheck className="h-4 w-4 text-[#7CFC00]" />
              <span>Pagamento 100% seguro</span>
            </div>

            <button
              onClick={handlePaymentSubmit}
              disabled={isProcessing}
              className="w-full h-14 rounded-xl bg-[#FF8C00] text-white font-bold text-lg hover:bg-[#FF8C00]/90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Processando...
                </>
              ) : (
                `Finalizar Pedido • ${formatCurrency(total)}`
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
