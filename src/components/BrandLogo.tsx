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
      src="/lovable-uploads/a83c6b3a-7b08-47b8-b632-a71a96bd19c9.png" 
      alt="Vida Leve"
      className={`${sizeClasses[size]} object-contain ${className}`}
    />
  );
}