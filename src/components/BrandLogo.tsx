import vidaleveLogo from "@/assets/vida-leve-logo.png"

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function BrandLogo({ size = 'md', className = '' }: BrandLogoProps) {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12', 
    lg: 'h-16 w-16',
    xl: 'h-20 w-20'
  };

  return (
    <img 
      src={vidaleveLogo} 
      alt="Vida Leve"
      className={`${sizeClasses[size]} object-contain ${className}`}
      onError={(e) => {
        // Fallback if image fails to load
        console.error('Logo failed to load:', e)
        e.currentTarget.src = '/placeholder.svg'
      }}
    />
  );
}