"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Phone } from "lucide-react";

export function ChangePhoneDialog({ currentPhone }: { currentPhone: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<"new-number" | "code">("new-number");
  const [newPhone, setNewPhone] = useState("");
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function reset() {
    setStep("new-number");
    setNewPhone("");
    setCode("");
    setSubmitting(false);
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) reset();
  }

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault();
    if (!newPhone.trim()) {
      toast.error("Entrez votre nouveau numéro de téléphone.");
      return;
    }
    if (newPhone.trim() === currentPhone) {
      toast.error("Ce numéro est déjà associé à votre compte.");
      return;
    }
    setSubmitting(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ phone: newPhone.trim() });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setStep("code");
    toast.success(`Code envoyé au ${newPhone}.`);
  }

  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault();
    if (code.trim().length !== 6) {
      toast.error("Entrez le code à 6 chiffres reçu par SMS.");
      return;
    }
    setSubmitting(true);
    const supabase = createClient();
    const { error } = await supabase.auth.verifyOtp({
      phone: newPhone.trim(),
      token: code.trim(),
      type: "phone_change",
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Numéro de téléphone mis à jour.");
    setOpen(false);
    reset();
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>Changer</DialogTrigger>
      <DialogContent>
        {step === "new-number" ? (
          <>
            <DialogHeader>
              <DialogTitle>Changer de numéro</DialogTitle>
              <DialogDescription>
                Vous recevrez un code de vérification par SMS au nouveau numéro avant que le
                changement soit confirmé.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSendCode} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="new-phone">Nouveau numéro</Label>
                <Input
                  id="new-phone"
                  type="tel"
                  placeholder="+1 234 567 8900"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                />
              </div>
              <DialogFooter className="-mx-0 -mb-0 border-none bg-transparent p-0">
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? "Envoi du code…" : "Recevoir le code par SMS"}
                </Button>
              </DialogFooter>
            </form>
          </>
        ) : (
          <>
            <DialogHeader>
              <button
                type="button"
                onClick={() => setStep("new-number")}
                className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="size-4" />
                Modifier le numéro
              </button>
              <DialogTitle>Entrez le code</DialogTitle>
              <DialogDescription>
                Code à 6 chiffres envoyé par SMS au {newPhone}.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleVerifyCode} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="new-phone-code">Code de vérification</Label>
                <Input
                  id="new-phone-code"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="123456"
                  className="text-center text-lg tracking-[0.5em]"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                />
              </div>
              <DialogFooter className="-mx-0 -mb-0 border-none bg-transparent p-0">
                <Button type="submit" className="w-full" disabled={submitting}>
                  <Phone className="size-4" />
                  {submitting ? "Vérification…" : "Confirmer le nouveau numéro"}
                </Button>
              </DialogFooter>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
