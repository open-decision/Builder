import { v4 as uuidV4 } from "uuid";
import { z } from "zod";

export const EdgeData = z.object({
  answer: z.string().optional(),
});

export const Type = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
  data: EdgeData,
});

export function create({
  data,
  ...edge
}: Omit<TEdge, "id" | "data"> & { data?: { answer?: string } }): TEdge {
  return {
    id: uuidV4(),
    data: {
      answer: "",
      ...data,
    },
    ...edge,
  };
}

export const Array = z.array(Type);

export type TEdge = z.infer<typeof Type>;
export type TEdgeArray = z.infer<typeof Array>;
export type TEdgeData = z.infer<typeof EdgeData>;
