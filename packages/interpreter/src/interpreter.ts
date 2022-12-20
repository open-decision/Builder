import { Tree } from "@open-decision/tree-type";
import { assign, createMachine, Interpreter, Sender } from "xstate";
import {
  InvalidTreeError,
  MissingEdgeForThruthyConditionError,
  NoTruthyConditionError,
} from "./errors";
import { canGoBack, canGoForward } from "./methods";
import { z } from "zod";

export type Resolver = (
  context: InterpreterContext,
  event: EVALUATE_NODE_CONDITIONS
) => (callback: Sender<ResolverEvents>) => void;

export type EVALUATE_NODE_CONDITIONS = {
  type: "EVALUATE_NODE_CONDITIONS";
};

type ResolverEvents =
  | { type: "VALID_INTERPRETATION"; target: string }
  | { type: "INVALID_INTERPRETATION"; error: InterpreterErrors }
  | { type: "FINAL_INTERPRETATION" };

export type InterpreterErrors =
  | MissingEdgeForThruthyConditionError
  | NoTruthyConditionError;

export type TAnswer = { [id: string]: { [x: string]: unknown } };

export type InterpreterContext = {
  history: { nodes: string[]; position: number };
  answers: TAnswer;
};

export type InterpreterEvents =
  | { type: "ADD_USER_ANSWER"; answer: TAnswer }
  | { type: "RESET" }
  | { type: "DONE" }
  | { type: "GO_BACK" }
  | { type: "GO_FORWARD" }
  | { type: "RECOVER" }
  | { type: "RESTART" }
  | ResolverEvents
  | EVALUATE_NODE_CONDITIONS;

export type InterpreterService = Interpreter<
  InterpreterContext,
  any,
  InterpreterEvents,
  any,
  any
>;

export type InterpreterOptions = {
  onError?: (error: InterpreterErrors) => void;
  onSelectedNodeChange?: (nextNodeIs: string) => void;
  initialNode?: string;
  onDone?: (context: InterpreterContext) => void;
  environment: "preview" | "prototype" | "public";
};

export const createInterpreterMachine = (
  json: Tree.TTree,
  TreeType: z.ZodType<Tree.TTree>,
  resolver: Resolver,
  { onError, onSelectedNodeChange, initialNode, onDone }: InterpreterOptions = {
    environment: "preview",
  }
) => {
  const decodedJSON = TreeType.safeParse(json);

  if (!decodedJSON.success) {
    console.error(decodedJSON.error);
    return new InvalidTreeError(decodedJSON.error);
  }

  const startNode = initialNode ?? decodedJSON.data.startNode;

  return createMachine(
    {
      predictableActionArguments: true,
      tsTypes: {} as import("./interpreter.typegen").Typegen0,
      schema: {
        context: {} as InterpreterContext,
        events: {} as InterpreterEvents,
      },
      context: {
        history: {
          nodes: [startNode],
          position: 0,
        },
        answers: {} as TAnswer,
      },
      id: "interpreter",
      initial: "idle",
      on: {
        RESET: {
          target: "#interpreter.idle",
          actions: "resetToInitialContext",
        },
        DONE: {
          target: "#interpreter.done",
        },
      },
      states: {
        idle: {
          on: {
            ADD_USER_ANSWER: {
              actions: "assignAnswerToContext",
            },
            EVALUATE_NODE_CONDITIONS: {
              target: "interpreting",
            },
            GO_BACK: {
              cond: "canGoBack",
              actions: "goBack",
            },
            GO_FORWARD: {
              cond: "canGoForward",
              actions: "goForward",
            },
          },
        },
        interpreting: {
          invoke: {
            id: "interpret_select_answer",
            src: "resolveConditions",
          },
          on: {
            VALID_INTERPRETATION: {
              target: "idle",
              actions: "assignNewTarget",
            },
            INVALID_INTERPRETATION: {
              target: "idle",
              actions: "callOnError",
            },
            FINAL_INTERPRETATION: {
              target: "done",
            },
          },
        },
        done: {
          entry: onDone,
          on: {
            RESTART: {
              target: "idle",
              actions: "resetToInitialContext",
            },
          },
        },
      },
    },
    {
      actions: {
        assignAnswerToContext: assign({
          answers: (context, event) => {
            return {
              ...context.answers,
              ...event.answer,
            };
          },
        }),
        resetToInitialContext: assign((_context, _event) => ({
          history: { nodes: [startNode], position: 0 },
          answers: {} as TAnswer,
          Error: undefined,
        })),
        goBack: assign((context) => {
          // When there is no history we should not go back.
          if (context.history.nodes.length === 0) return context;
          // When we have reached the end of the history array we should not go back further.
          if (context.history.position === context.history.nodes.length - 1)
            return context;

          onSelectedNodeChange?.(
            context.history.nodes[context.history.position + 1]
          );

          return {
            history: {
              position: context.history.position + 1,
              nodes: context.history.nodes,
            },
          };
        }),
        goForward: assign((context) => {
          if (context.history.position === 0) return context;
          onSelectedNodeChange?.(
            context.history.nodes[context.history.position - 1]
          );

          return {
            history: {
              position: context.history.position - 1,
              nodes: context.history.nodes,
            },
          };
        }),
        callOnError: (_context, event) => onError?.(event.error),
        assignNewTarget: assign((context, event) => {
          onSelectedNodeChange?.(event.target);

          if (context.history.position !== 0) {
            return {
              history: {
                position: 0,
                nodes: [
                  event.target,
                  ...context.history.nodes.slice(
                    context.history.position,
                    context.history.nodes.length
                  ),
                ],
              },
            };
          }

          return {
            history: {
              position: context.history.position,
              nodes: [event.target, ...context.history.nodes],
            },
          };
        }),
      },
      services: {
        resolveConditions: resolver,
      },
      guards: {
        canGoBack,
        canGoForward,
      },
    }
  );
};
