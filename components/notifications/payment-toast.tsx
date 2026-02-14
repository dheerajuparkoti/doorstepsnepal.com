
"use client";

import { toast } from "sonner";
import { CheckCircle, Wallet, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PaymentToastProps {
  orderId: number;
  amount: number;
  professionalId?: number;
}

export const showPaymentSuccessToast = ({
  orderId,
  amount,
  professionalId
}: PaymentToastProps) => {
  toast.custom((t) => (
    <div className="bg-white rounded-lg shadow-lg border-l-4 border-emerald-500 p-4 w-full max-w-md">
      <div className="flex items-start gap-3">
        <div className="bg-emerald-100 rounded-full p-2">
          <CheckCircle className="h-5 w-5 text-emerald-600" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">Payment Successful!</h4>
          <p className="text-sm text-gray-600 mt-1">
            Amount: <span className="font-medium">रू {amount.toLocaleString()}</span>
          </p>
          <p className="text-xs text-gray-500">
            Order #{orderId}
          </p>
          {professionalId && (
            <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
              <Wallet className="h-3 w-3" />
              Amount added to wallet
            </p>
          )}
          <div className="flex gap-2 mt-3">
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => {
                // Navigate to order details
                window.location.href = `/professional/orders/${orderId}`;
                toast.dismiss(t);
              }}
            >
              View Order
            </Button>
            <Button 
              size="sm"
              className="bg-emerald-500 hover:bg-emerald-600"
              onClick={() => toast.dismiss(t)}
            >
              Dismiss
            </Button>
          </div>
        </div>
      </div>
    </div>
  ), {
    duration: 8000,
    position: "top-right",
  });
};

export const showWalletUpdateToast = ({
  amount,
  type,
  orderId
}: {
  amount: number;
  type: 'commission' | 'withdrawal' | 'credit';
  orderId?: number;
}) => {
  const config = {
    commission: { icon: Wallet, color: "text-amber-600", bg: "bg-amber-100", title: "Commission Credited" },
    withdrawal: { icon: CreditCard, color: "text-blue-600", bg: "bg-blue-100", title: "Withdrawal Processed" },
    credit: { icon: Wallet, color: "text-green-600", bg: "bg-green-100", title: "Wallet Updated" }
  }[type];

  toast.custom((t) => (
    <div className="bg-white rounded-lg shadow-lg border-l-4 border-amber-500 p-4 w-full max-w-md">
      <div className="flex items-start gap-3">
        <div className={cn("rounded-full p-2", config.bg)}>
          <config.icon className={cn("h-5 w-5", config.color)} />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">{config.title}</h4>
          <p className="text-sm text-gray-600 mt-1">
            Amount: <span className="font-medium">रू {amount.toLocaleString()}</span>
          </p>
          {orderId && (
            <p className="text-xs text-gray-500">
              Order #{orderId}
            </p>
          )}
        </div>
      </div>
    </div>
  ), {
    duration: 5000,
    position: "top-right",
  });
};