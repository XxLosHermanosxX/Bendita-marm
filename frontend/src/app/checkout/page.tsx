"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useStore } from "@/store";
import { formatBRL, formatPYG, formatPhone } from "@/lib/utils";
import { useTranslation } from "@/lib/i18n";
import { ASSETS } from "@/data/assets";
import { 
  ChevronLeft, 
  MapPin, 
  User, 
  CreditCard, 
  CheckCircle,
  Truck,
  ShieldCheck,
  Loader2,
  Edit2,
  QrCode,
  Banknote
} from "lucide-react";

type CheckoutStep = "address" | "personal" | "confirm" | "payment";
type PaymentCurrency = "BRL" | "PYG" | null;
type PaymentMethod = "pix" | "credit_card" | "qr_transfer" | null;

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
  
  const { t } = useTranslation();

  const [step, setStep] = useState<CheckoutStep>("address");
  const [isProcessing, setIsProcessing] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Payment
  const [paymentCurrency, setPaymentCurrency] = useState<PaymentCurrency>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  
  // Form states
  const [street, setStreet] = useState(deliveryAddress?.street || "");
  const [number, setNumber] = useState(deliveryAddress?.number || "");
  const [complement, setComplement] = useState(deliveryAddress?.complement || "");
  const [neighborhood, setNeighborhood] = useState(deliveryAddress?.neighborhood || "");
  const [name, setName] = useState(customer?.name || "");
  const [phone, setPhone] = useState(customer?.phone || "");

  useEffect(() => {
    setMounted(true);
    if (deliveryAddress) {
      setStreet(deliveryAddress.street || "");
      setNeighborhood(deliveryAddress.neighborhood || "");
    }
  }, [deliveryAddress]);

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
      street,
      number,
      complement,
      neighborhood,
    });
    setStep("personal");
  };

  const handlePersonalSubmit = () => {
    if (!name || !phone || phone.replace(/\D/g, "").length < 9) return;
    
    setCustomer({ name, phone });
    setStep("confirm");
  };

  const handleConfirmAddress = () => {
    setStep("payment");
  };

  const handleEditAddress = () => {
    setStep("address");
  };

  const handlePaymentSubmit = async () => {
    if (!paymentCurrency || !paymentMethod) return;
    
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    clearCart();
    router.push("/checkout/success");
  };

  const steps = [
    { key: "address", label: t("confirmAddress").split(" ")[0], icon: MapPin },
    { key: "personal", label: t("yourData").split(" ")[0], icon: User },
    { key: "confirm", label: "Confirmar", icon: CheckCircle },
    { key: "payment", label: t("paymentMethod").split(" ")[0], icon: CreditCard },
  ];

  const currentStepIndex = steps.findIndex(s => s.key === step);

  const goBack = () => {
    if (step === "address") {
      router.back();
    } else if (step === "personal") {
      setStep("address");
    } else if (step === "confirm") {
      setStep("personal");
    } else if (step === "payment") {
      setStep("confirm");
    }
  };

  if (!mounted || items.length === 0) return null;

  return (
    <div className="min-h-[100svh] bg-[#F5F5F5] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#003366] text-white safe-area-top">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={goBack}
              className="flex items-center gap-1 text-sm font-medium active:opacity-70 transition-opacity"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            <div className="relative h-8 w-24">
              <Image src={ASSETS.logo} alt="Plantão do Smash" fill className="object-contain" />
            </div>
            
            <div className="w-8" />
          </div>
        </div>
        
        {/* Progress Steps */}
        <div className="bg-[#002244] py-3 px-4">
          <div className="flex justify-center items-center gap-1">
            {steps.map((s, index) => {
              const isActive = index <= currentStepIndex;
              const isCurrent = s.key === step;
              
              return (
                <div key={s.key} className="flex items-center gap-1">
                  <div className={`h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                    isCurrent 
                      ? "bg-[#FF8C00] text-white" 
                      : isActive 
                        ? "bg-[#7CFC00] text-[#003366]" 
                        : "bg-white/20 text-white/50"
                  }`}>
                    {isActive && !isCurrent ? (
                      <CheckCircle className="h-3.5 w-3.5" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-6 h-0.5 ${isActive ? "bg-[#7CFC00]" : "bg-white/20"}`} />
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
              <h1 className="text-xl font-black text-[#003366]">{t("confirmAddress")}</h1>
              <p className="text-gray-500 text-sm mt-1">{t("whereDeliver")}</p>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">
                  {t("street")}
                </label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="Nome da rua"
                  className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 focus:border-[#FF8C00] focus:outline-none transition-colors text-base"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">
                    {t("number")} *
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                    placeholder="123"
                    className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 focus:border-[#FF8C00] focus:outline-none transition-colors text-base"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">
                    {t("neighborhood")}
                  </label>
                  <input
                    type="text"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    placeholder="Bairro"
                    className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 focus:border-[#FF8C00] focus:outline-none transition-colors text-base"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">
                  {t("reference")}
                </label>
                <input
                  type="text"
                  value={complement}
                  onChange={(e) => setComplement(e.target.value)}
                  placeholder="Casa branca, portão preto..."
                  className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 focus:border-[#FF8C00] focus:outline-none transition-colors text-base"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-[#7CFC00]/10 rounded-xl">
              <Truck className="h-5 w-5 text-[#003366]" />
              <div>
                <p className="font-bold text-[#003366] text-sm">{t("deliveryTime")}</p>
                <p className="text-xs text-gray-500">
                  {t("deliveryCost")}: {deliveryFee === 0 ? t("free") : formatBRL(deliveryFee)}
                </p>
              </div>
            </div>

            <button
              onClick={handleAddressSubmit}
              disabled={!number}
              className="w-full h-14 rounded-2xl bg-[#FF8C00] text-white font-bold text-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {t("continue")}
            </button>
          </div>
        )}

        {/* Step 2: Personal */}
        {step === "personal" && (
          <div className="space-y-4 animate-in fade-in">
            <div className="text-center mb-6">
              <h1 className="text-xl font-black text-[#003366]">{t("yourData")}</h1>
              <p className="text-gray-500 text-sm mt-1">{t("contactInfo")}</p>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">
                  {t("fullName")} *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome completo"
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
              {t("continue")}
            </button>
          </div>
        )}

        {/* Step 3: Confirm Address */}
        {step === "confirm" && (
          <div className="space-y-4 animate-in fade-in">
            <div className="text-center mb-6">
              <h1 className="text-xl font-black text-[#003366]">{t("addressConfirmation")}</h1>
              <p className="text-gray-500 text-sm mt-1">{t("isAddressCorrect")}</p>
            </div>

            {/* Address Card */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border">
              <div className="flex items-start gap-3 mb-4">
                <div className="h-10 w-10 rounded-full bg-[#003366] flex items-center justify-center shrink-0">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-[#003366]">
                    {street || "Rua"}{number ? `, ${number}` : ""}
                  </p>
                  {complement && <p className="text-sm text-gray-500">{complement}</p>}
                  <p className="text-sm text-gray-500">
                    {neighborhood}{neighborhood ? ", " : ""}Ciudad del Este
                  </p>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-[#FF8C00] flex items-center justify-center shrink-0">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-[#003366]">{name}</p>
                    <p className="text-sm text-gray-500">{phone}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary Mini */}
            <div className="bg-gray-100 rounded-xl p-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">{t("subtotal")}</span>
                <span className="font-medium">{formatBRL(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-500">{t("delivery")}</span>
                <span className={`font-medium ${deliveryFee === 0 ? "text-[#7CFC00]" : ""}`}>
                  {deliveryFee === 0 ? t("free") : formatBRL(deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between font-bold text-[#003366] pt-2 border-t border-gray-200">
                <span>{t("total")}</span>
                <div className="text-right">
                  <span>{formatBRL(total)}</span>
                  <p className="text-xs text-gray-400 font-normal">{formatPYG(total)}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleEditAddress}
                className="h-14 rounded-2xl bg-gray-200 text-gray-700 font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
              >
                <Edit2 className="h-4 w-4" />
                {t("editAddress")}
              </button>
              <button
                onClick={handleConfirmAddress}
                className="h-14 rounded-2xl bg-[#FF8C00] text-white font-bold active:scale-[0.98] transition-all"
              >
                {t("continue")}
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Payment */}
        {step === "payment" && (
          <div className="space-y-4 animate-in fade-in">
            <div className="text-center mb-6">
              <h1 className="text-xl font-black text-[#003366]">{t("paymentMethod")}</h1>
              <p className="text-gray-500 text-sm mt-1">{t("chooseCurrency")}</p>
            </div>

            {/* Currency Selection */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => { setPaymentCurrency("BRL"); setPaymentMethod(null); }}
                className={`p-4 rounded-2xl border-2 transition-all active:scale-95 ${
                  paymentCurrency === "BRL" 
                    ? "border-[#FF8C00] bg-[#FF8C00]/5" 
                    : "border-gray-200 bg-white"
                }`}
              >
                <div className="text-2xl mb-2">🇧🇷</div>
                <p className="font-bold text-sm">Real (R$)</p>
                <p className="text-lg font-black text-[#FF8C00]">{formatBRL(total)}</p>
              </button>
              
              <button
                onClick={() => { setPaymentCurrency("PYG"); setPaymentMethod(null); }}
                className={`p-4 rounded-2xl border-2 transition-all active:scale-95 ${
                  paymentCurrency === "PYG" 
                    ? "border-[#FF8C00] bg-[#FF8C00]/5" 
                    : "border-gray-200 bg-white"
                }`}
              >
                <div className="text-2xl mb-2">🇵🇾</div>
                <p className="font-bold text-sm">Guarani (Gs.)</p>
                <p className="text-lg font-black text-[#FF8C00]">{formatPYG(total)}</p>
              </button>
            </div>

            {/* Payment Methods for BRL */}
            {paymentCurrency === "BRL" && (
              <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                <p className="text-sm font-bold text-gray-500 uppercase">{t("howPay")}</p>
                
                <button
                  onClick={() => setPaymentMethod("pix")}
                  className={`w-full p-4 rounded-2xl border-2 flex items-center gap-4 transition-all active:scale-[0.98] ${
                    paymentMethod === "pix" 
                      ? "border-[#FF8C00] bg-[#FF8C00]/5" 
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                    paymentMethod === "pix" ? "bg-[#FF8C00]" : "bg-gray-100"
                  }`}>
                    <QrCode className={`h-6 w-6 ${paymentMethod === "pix" ? "text-white" : "text-gray-500"}`} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold">{t("pix")}</p>
                    <p className="text-xs text-gray-500">{t("pixDesc")}</p>
                  </div>
                </button>
                
                <button
                  onClick={() => setPaymentMethod("credit_card")}
                  className={`w-full p-4 rounded-2xl border-2 flex items-center gap-4 transition-all active:scale-[0.98] ${
                    paymentMethod === "credit_card" 
                      ? "border-[#FF8C00] bg-[#FF8C00]/5" 
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                    paymentMethod === "credit_card" ? "bg-[#FF8C00]" : "bg-gray-100"
                  }`}>
                    <CreditCard className={`h-6 w-6 ${paymentMethod === "credit_card" ? "text-white" : "text-gray-500"}`} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold">{t("creditCard")}</p>
                    <p className="text-xs text-gray-500">{t("creditCardDesc")}</p>
                  </div>
                </button>
              </div>
            )}

            {/* Payment Methods for PYG */}
            {paymentCurrency === "PYG" && (
              <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                <p className="text-sm font-bold text-gray-500 uppercase">{t("howPay")}</p>
                
                <button
                  onClick={() => setPaymentMethod("credit_card")}
                  className={`w-full p-4 rounded-2xl border-2 flex items-center gap-4 transition-all active:scale-[0.98] ${
                    paymentMethod === "credit_card" 
                      ? "border-[#FF8C00] bg-[#FF8C00]/5" 
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                    paymentMethod === "credit_card" ? "bg-[#FF8C00]" : "bg-gray-100"
                  }`}>
                    <CreditCard className={`h-6 w-6 ${paymentMethod === "credit_card" ? "text-white" : "text-gray-500"}`} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold">{t("creditCard")}</p>
                    <p className="text-xs text-gray-500">{t("creditCardDesc")}</p>
                  </div>
                </button>
                
                <button
                  onClick={() => setPaymentMethod("qr_transfer")}
                  className={`w-full p-4 rounded-2xl border-2 flex items-center gap-4 transition-all active:scale-[0.98] ${
                    paymentMethod === "qr_transfer" 
                      ? "border-[#FF8C00] bg-[#FF8C00]/5" 
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                    paymentMethod === "qr_transfer" ? "bg-[#FF8C00]" : "bg-gray-100"
                  }`}>
                    <QrCode className={`h-6 w-6 ${paymentMethod === "qr_transfer" ? "text-white" : "text-gray-500"}`} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold">{t("qrTransfer")}</p>
                    <p className="text-xs text-gray-500">{t("qrTransferDesc")}</p>
                  </div>
                </button>
              </div>
            )}

            {/* Security Badge */}
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
              <ShieldCheck className="h-4 w-4 text-[#7CFC00]" />
              <span>{t("securePayment")}</span>
            </div>

            <button
              onClick={handlePaymentSubmit}
              disabled={isProcessing || !paymentCurrency || !paymentMethod}
              className="w-full h-14 rounded-2xl bg-[#FF8C00] text-white font-bold text-lg active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  {t("confirm")} • {paymentCurrency === "PYG" ? formatPYG(total) : formatBRL(total)}
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
