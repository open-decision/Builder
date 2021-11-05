import { v4 as uuidV4 } from "uuid";
import { z } from "zod";
import { BaseRelation } from "./shared";

export const Type = BaseRelation.extend({
  answer: z.string().optional(),
  target: z.string().optional(),
});

export const create = (relation?: Omit<TRelation, "id">): TRelation => {
  const id = uuidV4();

  return {
    id,
    ...relation,
  };
};

export type TRelation = z.infer<typeof Type>;