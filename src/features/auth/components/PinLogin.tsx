import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import {
  loginWithPinSchema,
  type LoginWithPinFormValues,
} from "../schemas/auth.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

type PinLoginProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};
const PinLogin = ({ open, onOpenChange }: PinLoginProps) => {
  const { loginWithPin } = useAuth();

  const form = useForm<LoginWithPinFormValues>({
    resolver: zodResolver(loginWithPinSchema),
    defaultValues: {
      pin: "",
    },
  });

  const onSubmit = (values: LoginWithPinFormValues) => {
    loginWithPin.mutate(values, {
      onSuccess: () => {
        form.reset();
        onOpenChange(false);
      },
    });
  };

  // Auto-submit when PIN is complete
  const handlePinChange = (value: string) => {
    if (value.length === 6) {
      form.handleSubmit(onSubmit)();
    }
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ingreso con PIN</DialogTitle>
          <DialogDescription>
            Ingresa tu PIN de 6 dígitos para acceder al sistema
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="pin"
              render={({ field }) => (
                <FormItem className="flex flex-col items-center gap-4">
                  <FormControl>
                    <InputOTP
                      maxLength={6}
                      disabled={loginWithPin.isPending}
                      {...field}
                      onChange={(value) => {
                        field.onChange(value);
                        handlePinChange(value);
                      }}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  form.reset();
                  onOpenChange(false);
                }}
                disabled={loginWithPin.isPending}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={
                  loginWithPin.isPending || form.watch("pin").length !== 6
                }
              >
                {loginWithPin.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  "Ingresar"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
export default PinLogin;
