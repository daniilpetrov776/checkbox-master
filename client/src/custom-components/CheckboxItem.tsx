import { memo } from "react";
import ShadcnCheckbox from "@/components/ui/checkbox";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface CheckboxProps {
  id: number;
  checked: boolean;
  onStateChange: (data: { id: number; checked: boolean }) => void;
}

function CheckboxComponent({ id, checked, onStateChange }: CheckboxProps) {
  const { toast } = useToast();
  
  const mutation = useMutation({
    mutationFn: async ({ id, checked }: { id: number; checked: boolean }) => {
      await apiRequest("POST", `/api/checkboxes/${id}`, { checked });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update checkbox state",
      });
    },
  });

  return (
    <div className="flex items-center justify-center p-2 border rounded hover:bg-accent transition-colors">
      <ShadcnCheckbox
        checked={checked}
        onCheckedChange={(checked) => {
          mutation.mutate({ id, checked: checked as boolean });
          onStateChange({ id, checked: checked as boolean });
        }}
        className="transition-transform hover:scale-110"
      />
    </div>
  );
}

export const MemoizedCheckbox = memo(CheckboxComponent);