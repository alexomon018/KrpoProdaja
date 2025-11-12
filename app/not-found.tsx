"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/atoms/Button/Button";
import { Container } from "@/components/atoms/Container/Container";
import { Icon } from "@/components/atoms/Icon/Icon";

/**
 * 404 Not Found Page
 *
 * A fun and modern 404 error page with helpful navigation options
 */
export default function NotFound() {
  const router = useRouter();
  const [shakeShirt, setShakeShirt] = React.useState(false);

  const handleShirtClick = () => {
    setShakeShirt(true);
    setTimeout(() => setShakeShirt(false), 500);
  };

  return (
    <Container className="min-h-[80vh] flex items-center justify-center py-12">
      <div className="max-w-2xl mx-auto text-center space-y-8">
        {/* Animated 404 with Shirt Icon */}
        <div className="relative">
          <div className="flex items-center justify-center gap-4">
            <span className="text-9xl font-bold text-primary">4</span>
            <button
              onClick={handleShirtClick}
              className={`text-9xl transition-transform hover:scale-110 active:scale-95 focus:outline-none ${
                shakeShirt ? "animate-shake" : ""
              }`}
              aria-label="Majica (klikni me!)"
            >
              👕
            </button>
            <span className="text-9xl font-bold text-primary">4</span>
          </div>
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-xs text-text-tertiary opacity-0 hover:opacity-100 transition-opacity">
            (klikni na majicu!)
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-text-primary">
            Opa! Stranica nije pronađena
          </h1>
          <p className="text-lg text-text-secondary max-w-lg mx-auto">
            Izgleda da je ova stranica otišla na kupovinu... ili možda je već prodata! 🛍️
          </p>
          <p className="text-sm text-text-tertiary">
            Možda je link pogrešan, ili smo malo preuredio sajt. Ne brini, imaš još mnogo toga da istražiš!
          </p>
        </div>

        {/* Fun Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-6">
          <div className="bg-surface border border-border rounded-lg p-4">
            <div className="text-3xl font-bold text-primary">404</div>
            <div className="text-sm text-text-secondary">Izgubljenih majica</div>
          </div>
          <div className="bg-surface border border-border rounded-lg p-4">
            <div className="text-3xl font-bold text-primary">∞</div>
            <div className="text-sm text-text-secondary">Novih proizvoda</div>
          </div>
          <div className="bg-surface border border-border rounded-lg p-4">
            <div className="text-3xl font-bold text-primary">100%</div>
            <div className="text-sm text-text-secondary">Šanse za povratak</div>
          </div>
        </div>

        {/* Navigation Options */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/">
              <Button variant="primary" size="lg" className="gap-2">
                <Icon name="Home" size={20} />
                Nazad na početnu
              </Button>
            </Link>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => router.back()}
              className="gap-2"
            >
              <Icon name="ArrowLeft" size={20} />
              Nazad
            </Button>
          </div>

          {/* Quick Links */}
          <div className="pt-4">
            <p className="text-sm text-text-secondary mb-3">Možda tražiš nešto od ovoga?</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Link href="/products" className="text-sm text-primary hover:underline">
                Prodavnica
              </Link>
              <span className="text-text-tertiary">•</span>
              <Link href="/sell" className="text-sm text-primary hover:underline">
                Prodaj
              </Link>
              <span className="text-text-tertiary">•</span>
              <Link href="/profile" className="text-sm text-primary hover:underline">
                Profil
              </Link>
              <span className="text-text-tertiary">•</span>
              <Link href="/login" className="text-sm text-primary hover:underline">
                Prijava
              </Link>
            </div>
          </div>
        </div>

        {/* Fun Message */}
        <div className="pt-8">
          <div className="bg-primary/5 border-2 border-primary/20 rounded-lg p-6 max-w-md mx-auto">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">💡</span>
              <span className="font-semibold text-text-primary">Pro tip!</span>
            </div>
            <p className="text-sm text-text-secondary">
              Dok si ovde, možda ti treba nova majica? Baš kao ona na 404! 👕
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-10deg); }
          75% { transform: rotate(10deg); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </Container>
  );
}
