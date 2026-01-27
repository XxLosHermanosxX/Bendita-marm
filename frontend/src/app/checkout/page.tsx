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
  Loader2,
  Edit2
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
  const [mounted, setMounted] = useState(false);
  
  // Form states
  const [number, setNumber] = useState(deliveryAddress?.number || "");
  const [complement, setComplement] = useState(deliveryAddress?.complement || "");
  const [name, setName] = useState(customer?.name || "");
  const [phone, setPhone] = useState(customer?.phone || "");

  useEffect(() => {
    setMounted(true);
  }, []);

  const subtotal = mounted ? getSubtotal() : 0;
  const deliveryFee = mounted ? getDeliveryFee() : 0;
  const total = mounted ? getTotal() : 0;

  // Redirect if no items or no delivery
  useEffect(() => {
    if (mounted && (items.length === 0 || !isDeliveryAvailable)) {
      router.push("/");
    }
  }, [mounted, items, isDeliveryAvailable, router]);

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
    if (!name || !phone || phone.replace(/\D/g, "").length < 9) return;
    
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
    { key: "address", label: "Dirección", icon: MapPin },
    { key: "personal", label: "Datos", icon: User },
    { key: "payment", label: "Pago", icon: CreditCard },
  ];

  const currentStepIndex = steps.findIndex(s => s.key === step);

  if (!mounted || items.length === 0) return null;

  return (
    <div className="min-h-[100svh] bg-[#F5F5F5] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#003366] text-white safe-area-top">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => step === "address" ? router.back() : setStep(steps[currentStepIndex - 1].key as CheckoutStep)}
              className="flex items-center gap-1 text-sm font-medium active:opacity-70 transition-opacity"
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="hidden sm:inline">Volver</span>
            </button>
            
            <div className="relative h-8 w-24">
              <Image src={ASSETS.logo} alt="Plantão do Smash" fill className="object-contain" />
            </div>
            
            <div className="w-16" />
          </div>
        </div>
        
        {/* Progress Steps - Minimal on mobile */}
        <div className="bg-[#002244] py-3 px-4">
          <div className="flex justify-center items-center gap-2">
            {steps.map((s, index) => {
              const isActive = index <= currentStepIndex;
              const isCurrent = s.key === step;
              
              return (
                <div key={s.key} className="flex items-center gap-2">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isCurrent 
                      ? "bg-[#FF8C00] text-white" 
                      : isActive 
                        ? "bg-[#7CFC00] text-[#003366]" 
                        : "bg-white/20 text-white/50"
                  }`}>
                    {isActive && !isCurrent ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-0.5 ${isActive ? "bg-[#7CFC00]" : "bg-white/20"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </header>

      <div className="flex-1 container mx-auto px-4 py-6 max-w-lg">
        {/* Step 1: Address */}
        {step === "address" && (
          <div className="space-y-4 animate-in fade-in">
            <div className="text-center mb-6">
              <h1 className="text-xl font-black text-[#003366]">Confirma tu dirección</h1>
              <p className="text-gray-500 text-sm mt-1">¿Dónde te llevamos tu pedido?</p>
            </div>

            {/* Address from Location */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border">
              <div className="flex items-start gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-[#7CFC00]/20 flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5 text-[#003366]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#003366] text-sm truncate">
                    {deliveryAddress?.street || "Tu ubicación"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {deliveryAddress?.neighborhood}, {deliveryAddress?.city}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">
                    Número *
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    placeholder="Ej: 123"
                    className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 focus:border-[#FF8C00] focus:outline-none transition-colors text-base"
                  />
                </div>
                
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">
                    Referencia (opcional)
                  </label>
                  <input
                    type="text"
                    value={complement}
                    onChange={(e) => setComplement(e.target.value)}
                    placeholder="Ej: Casa blanca, portón negro"
                    className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 focus:border-[#FF8C00] focus:outline-none transition-colors text-base"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="flex items-center gap-3 p-3 bg-[#7CFC00]/10 rounded-xl">
              <Truck className="h-5 w-5 text-[#003366]" />
              <div>
                <p className="font-bold text-[#003366] text-sm">Delivery en 25-40 min</p>
                <p className="text-xs text-gray-500">
                  Costo: {deliveryFee === 0 ? "GRATIS" : formatCurrency(deliveryFee)}
                </p>
              </div>
            </div>

            <button
              onClick={handleAddressSubmit}
              disabled={!number}
              className="w-full h-14 rounded-2xl bg-[#FF8C00] text-white font-bold text-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Continuar
            </button>
          </div>
        )}

        {/* Step 2: Personal */}
        {step === "personal" && (
          <div className="space-y-4 animate-in fade-in">
            <div className="text-center mb-6">
              <h1 className="text-xl font-black text-[#003366]">Tus datos</h1>
              <p className="text-gray-500 text-sm mt-1">Para contactarte sobre tu pedido</p>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre"
                  className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 focus:border-[#FF8C00] focus:outline-none transition-colors text-base"
                />
              </div>
              
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">
                  WhatsApp *
                </label>
                <input
                  type="tel"
                  inputMode="tel"
                  value={phone}
                  onChange={(e) => setPhone(formatPhone(e.target.value))}
                  placeholder="0981 123 456"
                  maxLength={12}
                  className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 focus:border-[#FF8C00] focus:outline-none transition-colors text-base"
                />
              </div>
            </div>

            <button
              onClick={handlePersonalSubmit}
              disabled={!name || phone.replace(/\D/g, "").length < 9}
              className="w-full h-14 rounded-2xl bg-[#FF8C00] text-white font-bold text-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Continuar
            </button>
          </div>
        )}

        {/* Step 3: Payment */}
        {step === "payment" && (
          <div className="space-y-4 animate-in fade-in">
            <div className="text-center mb-6">
              <h1 className="text-xl font-black text-[#003366]">Método de Pago</h1>
              <p className="text-gray-500 text-sm mt-1">¿Cómo vas a pagar?</p>
            </div>

            {/* Payment Methods */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setPaymentMethod("pix")}
                className={`p-4 rounded-2xl border-2 transition-all active:scale-95 ${
                  paymentMethod === "pix" 
                    ? "border-[#FF8C00] bg-[#FF8C00]/5" 
                    : "border-gray-200 bg-white"
                }`}
              >
                <QrCode className={`h-8 w-8 mx-auto mb-2 ${paymentMethod === "pix" ? "text-[#FF8C00]" : "text-gray-400"}`} />
                <p className="font-bold text-sm">Transferencia</p>
                <p className="text-[10px] text-gray-500">Pago instantáneo</p>
              </button>
              
              <button
                onClick={() => setPaymentMethod("card")}
                className={`p-4 rounded-2xl border-2 transition-all active:scale-95 ${
                  paymentMethod === "card" 
                    ? "border-[#FF8C00] bg-[#FF8C00]/5" 
                    : "border-gray-200 bg-white"
                }`}
              >
                <CreditCard className={`h-8 w-8 mx-auto mb-2 ${paymentMethod === "card" ? "text-[#FF8C00]" : "text-gray-400"}`} />
                <p className="font-bold text-sm">Efectivo/Tarjeta</p>
                <p className="text-[10px] text-gray-500">En la entrega</p>
              </button>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border">
              <h3 className="font-bold text-[#003366] mb-3 text-sm">Resumen del Pedido</h3>
              
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-xs">
                    <span className="text-gray-600 truncate flex-1 mr-2">
                      {item.quantity}x {item.product.name}
                    </span>
                    <span className="font-medium shrink-0">
                      {formatCurrency(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              
              <div className="border-t mt-3 pt-3 space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Delivery</span>
                  <span className={deliveryFee === 0 ? "text-[#7CFC00] font-bold" : ""}>
                    {deliveryFee === 0 ? "GRATIS" : formatCurrency(deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-black text-[#003366] pt-2 border-t">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            </div>

            {/* Security Badge */}
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
              <ShieldCheck className="h-4 w-4 text-[#7CFC00]" />
              <span>Pago 100% seguro</span>
            </div>

            <button
              onClick={handlePaymentSubmit}
              disabled={isProcessing}
              className="w-full h-14 rounded-2xl bg-[#FF8C00] text-white font-bold text-lg active:scale-[0.98] disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Procesando...
                </>
              ) : (
                `Confirmar • ${formatCurrency(total)}`
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
