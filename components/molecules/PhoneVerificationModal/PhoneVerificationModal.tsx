"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
import { Button } from "@/components/atoms/Button/Button";
import { Icon } from "@/components/atoms/Icon/Icon";
import {
  useSendPhoneVerification,
  useVerifyPhone,
  useResendPhoneVerification,
} from "@/lib/api/hooks";

export interface PhoneVerificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  phoneNumber: string;
  onVerified?: () => void;
}

export function PhoneVerificationModal({
  open,
  onOpenChange,
  phoneNumber,
  onVerified,
}: PhoneVerificationModalProps) {
  const [code, setCode] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [verificationSent, setVerificationSent] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const sendVerificationMutation = useSendPhoneVerification();
  const verifyPhoneMutation = useVerifyPhone();
  const resendVerificationMutation = useResendPhoneVerification();

  // Auto-decrement countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Send verification code when modal opens
  useEffect(() => {
    if (open && phoneNumber && !verificationSent) {
      handleSendVerification();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, phoneNumber]);

  // Reset state when modal closes
  useEffect(() => {
    if (!open) {
      setCode("");
      setError(undefined);
      setVerificationSent(false);
    }
  }, [open]);

  const handleSendVerification = () => {
    setError(undefined);
    sendVerificationMutation.mutate(
      { phone: phoneNumber },
      {
        onSuccess: () => {
          setVerificationSent(true);
          setCountdown(60);
        },
        onError: (err) => {
          setError(
            err.message || "Greška pri slanju SMS-a. Pokušajte ponovo."
          );
        },
      }
    );
  };

  const handleResend = () => {
    setError(undefined);
    resendVerificationMutation.mutate(undefined, {
      onSuccess: () => {
        setCountdown(60);
        setCode("");
      },
      onError: (err) => {
        setError(err.message || "Greška pri slanju SMS-a. Pokušajte ponovo.");
      },
    });
  };

  const handleVerify = () => {
    if (code.length !== 6) {
      setError("Unesite kompletan 6-cifreni kod.");
      return;
    }

    setError(undefined);
    verifyPhoneMutation.mutate(
      { code },
      {
        onSuccess: () => {
          onVerified?.();
          onOpenChange(false);
        },
        onError: (err) => {
          setError(err.message || "Neispravan ili istekao kod. Pokušajte ponovo.");
        },
      }
    );
  };

  // Auto-submit when 6 digits are entered
  useEffect(() => {
    if (code.length === 6 && !verifyPhoneMutation.isPending) {
      handleVerify();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  const isLoading =
    sendVerificationMutation.isPending ||
    verifyPhoneMutation.isPending ||
    resendVerificationMutation.isPending;

  // Success state
  if (verifyPhoneMutation.isSuccess) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <div className="bg-semantic-success/10 rounded-full p-4">
              <Icon
                name="CheckCircle"
                size={48}
                className="text-semantic-success"
              />
            </div>
            <DialogHeader className="text-center">
              <DialogTitle className="text-xl">
                Telefon verifikovan!
              </DialogTitle>
              <DialogDescription>
                Vaš broj telefona je uspešno verifikovan.
              </DialogDescription>
            </DialogHeader>
            <Button
              variant="primary"
              onClick={() => onOpenChange(false)}
              className="mt-4"
            >
              Zatvori
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-primary/10 rounded-full p-4">
              <Icon name="Smartphone" size={32} className="text-primary" />
            </div>
          </div>
          <DialogTitle className="text-xl">Verifikuj broj telefona</DialogTitle>
          <DialogDescription>
            Poslali smo SMS sa verifikacionim kodom na
            <span className="block font-semibold text-primary mt-1">
              {phoneNumber}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-6 py-4">
          {error && (
            <div className="w-full bg-semantic-error/10 border border-semantic-error/20 text-semantic-error px-4 py-3 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <p className="text-sm text-secondary text-center">
              Unesite 6-cifreni kod
            </p>
            <InputOTP
              maxLength={6}
              value={code}
              onChange={(value) => setCode(value)}
              disabled={isLoading}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          <Button
            variant="primary"
            fullWidth
            onClick={handleVerify}
            loading={verifyPhoneMutation.isPending}
            disabled={code.length !== 6 || isLoading}
          >
            Verifikuj
          </Button>

          <div className="text-center space-y-2">
            <p className="text-sm text-secondary">Niste dobili kod?</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResend}
              disabled={countdown > 0 || isLoading}
              loading={resendVerificationMutation.isPending}
            >
              {countdown > 0
                ? `Pošalji ponovo (${countdown}s)`
                : "Pošalji ponovo"}
            </Button>
          </div>

          <p className="text-xs text-tertiary text-center">
            Kod ističe za 10 minuta. Ograničeno na 5 zahteva po satu.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
