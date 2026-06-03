"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Sparkles, LogIn, Crown } from "lucide-react";
import Link from "next/link";

interface RateLimitModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tier: "guest" | "free";
  remaining: number;
  limit: number;
}

export function RateLimitModal({
  open,
  onOpenChange,
  tier,
  remaining,
  limit,
}: RateLimitModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-amber-600" />
          </div>
          <DialogTitle className="text-center">
            You&apos;ve hit your daily limit
          </DialogTitle>
          <DialogDescription className="text-center">
            {tier === "guest" ? (
              <>
                Guest users get {limit} AI generations per day.
                Sign in for {10} free generations daily!
              </>
            ) : (
              <>
                Free accounts get {limit} AI generations per day.
                Upgrade to Pro for unlimited planning!
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-4">
          {tier === "guest" ? (
            <Link href="/auth/login" className="w-full">
              <Button variant="default" className="w-full" size="lg">
                <LogIn className="w-4 h-4 mr-2" />
                Sign in for more
              </Button>
            </Link>
          ) : (
            <Link href="/pricing" className="w-full">
              <Button variant="amber" className="w-full" size="lg">
                <Crown className="w-4 h-4 mr-2" />
                Upgrade to Pro
              </Button>
            </Link>
          )}
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="text-slate-500 dark:text-slate-400"
          >
            Maybe later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
