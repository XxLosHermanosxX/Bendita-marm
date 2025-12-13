import { Fish } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SushiakiLogoProps {
  className?: string;
}

export const SushiakiLogo = ({ className }: SushiakiLogoProps) => {
  return (
    <Fish className={cn("text-primary", className)} />
  );
};