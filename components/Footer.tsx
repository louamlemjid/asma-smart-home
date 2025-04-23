import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-background border-t py-6 md:py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="flex items-center space-x-1">
            <p className="text-sm text-muted-foreground">
              Made with
            </p>
            <Heart className="h-4 w-4 text-red-500" />
            <p className="text-sm text-muted-foreground">
              by Asma Smart Home
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Asma Smart Home. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}