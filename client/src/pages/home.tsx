// import { useQuery, useMutation } from "@tanstack/react-query";
// import { useCallback, useEffect } from "react";
// import  Checkbox  from "@/components/ui/checkbox";
// import { useToast } from "@/hooks/use-toast";
// import { useWebSocket } from "@/lib/useWebSocket";
// import { apiRequest } from "@/lib/queryClient";
// import { type CheckboxStates } from "@shared/schema";
// import { queryClient } from "@/lib/queryClient";
// import { MemoizedCheckbox } from "../custom-components/CheckboxItem";

// export default function Home() {
//   const { toast } = useToast();

//   const { data: checkboxStates, isLoading } = useQuery<CheckboxStates>({
//     queryKey: ["/api/checkboxes"],
//   });

//   const mutation = useMutation({
//     mutationFn: async ({ id, checked }: { id: number; checked: boolean }) => {
//       await apiRequest("POST", `/api/checkboxes/${id}`, { checked });
//     },
//     onError: () => {
//       toast({
//         variant: "destructive",
//         title: "Error",
//         description: "Failed to update checkbox state",
//       });
//     },
//   });

//   const handleWebSocketMessage = useCallback((data: { id: number; checked: boolean }) => {
//     queryClient.setQueryData<CheckboxStates>(["/api/checkboxes"], (old) => ({
//       ...old,
//       [data.id]: data.checked,
//     }));
//   }, []);

//   useWebSocket(handleWebSocketMessage);

//   // Refresh state every 5 seconds
//   useEffect(() => {
//     const interval = setInterval(() => {
//       queryClient.invalidateQueries({ queryKey: ["/api/checkboxes"] });
//     }, 5000);

//     return () => clearInterval(interval);
//   }, []);

//   const handleCheckChange = useCallback((checked: boolean, id: number) => {
//     mutation.mutate({ id, checked });
//   }, [mutation]);

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-pulse text-2xl">Loading checkboxes...</div>
//       </div>
//     );
//   }

//   const checkedCount = Object.values(checkboxStates || {}).filter(Boolean).length;

//   return (
//     <div className="container mx-auto p-8">
//       <div className="mb-8 flex items-center justify-between">
//         <h1 className="text-3xl font-bold">Checkbox Grid</h1>
//         <div className="text-lg">
//           Checked boxes: <span className="font-bold">{checkedCount}</span>
//         </div>
//       </div>

//       <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 lg:grid-cols-20 gap-4">
//         {Array.from({ length: 1000 }).map((_, i) => (
//           <div
//             key={i}
//             className="flex items-center justify-center p-2 border rounded hover:bg-accent transition-colors"
//           >
//             <Checkbox
//               checked={checkboxStates?.[i] || false}
//               onCheckedChange={(checked) => handleCheckChange(checked as boolean, i)}
//               className="transition-transform hover:scale-110"
//             />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useWebSocket } from "@/lib/useWebSocket";
import { type CheckboxStates } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";
import { MemoizedCheckbox } from "../custom-components/CheckboxItem";

export default function Home() {
  const { toast } = useToast();

  const { data: checkboxStates, isLoading } = useQuery<CheckboxStates>({
    queryKey: ["/api/checkboxes"],
  });

  const handleWebSocketMessage = useCallback((data: { id: number; checked: boolean }) => {
    queryClient.setQueryData<CheckboxStates>(["/api/checkboxes"], (old) => ({
      ...old,
      [data.id]: data.checked,
    }));
  }, []);

  const handleStateChange = useCallback((data: { id: number; checked: boolean }) => {
    queryClient.setQueryData<CheckboxStates>(["/api/checkboxes"], (old) => ({
      ...old,
      [data.id]: data.checked,
    }));
  }, []);

  useWebSocket(handleWebSocketMessage);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-2xl">Loading checkboxes...</div>
      </div>
    );
  }

  const checkedCount = Object.values(checkboxStates || {}).filter(Boolean).length;

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Checkbox Grid</h1>
        <div className="text-lg">
          Checked boxes: <span className="font-bold">{checkedCount}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-10 lg:grid-cols-20 gap-4">
        {Array.from({ length: 1000 }).map((_, i) => (
          <MemoizedCheckbox
            key={i}
            id={i}
            checked={checkboxStates?.[i] || false}
            onStateChange={handleStateChange}
          />
        ))}
      </div>
    </div>
  );
}