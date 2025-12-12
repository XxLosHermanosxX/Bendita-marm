"use client";

import React from 'react';
import { Button } from './ui/button';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton = () => {
  const handleWhatsAppClick = () => {
    // Replace with your actual WhatsApp number and message
    const phoneNumber = '5511999999999'; // Example Brazilian number
    const message = 'Olá, gostaria de mais informações!';
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <Button
      onClick={handleWhatsAppClick}
      className="fixed bottom-6 right-6 z-50 rounded-full h-14 w-14 shadow-lg bg-green-500 hover:bg-green-600"
      aria-label="Fale conosco pelo WhatsApp"
    >
      <MessageCircle className="h-6 w-6 text-white" />
    </Button>
  );
};

export default WhatsAppButton;