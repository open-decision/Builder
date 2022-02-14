// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  eventsCausingActions: {
    clearPatches: "patchesReceived";
    addNode: "addNode";
    sendSyncEvent:
      | "addNode"
      | "updateNode"
      | "updateNodeName"
      | "updateNodePosition"
      | "updateNodeContent"
      | "updateNodeRelations"
      | "deleteNode"
      | "addRelation"
      | "updateRelation"
      | "updateRelationAnswer"
      | "updateRelationTarget"
      | "deleteRelation"
      | "updateTree"
      | "undo"
      | "redo"
      | "connect";
    updateNode: "updateNode";
    updateNodeName: "updateNodeName";
    mergePatch: "updateNodeName" | "updateRelationAnswer";
    updateNodePosition: "updateNodePosition";
    updateNodeContent: "updateNodeContent";
    updateNodeRelations: "updateNodeRelations";
    deleteNode: "deleteNode";
    addRelation: "addRelation";
    updateRelation: "updateRelation";
    updateRelationAnswer: "updateRelationAnswer";
    updateRelationTarget: "updateRelationTarget";
    deleteRelation: "deleteRelation";
    updateTree: "updateTree";
    selectNode: "selectNode";
    selectRelation: "selectRelation";
    startConnecting: "startConnecting";
    undo: "undo";
    redo: "redo";
    connect: "connect";
    cleanUpConnect: "connect" | "abortConnect";
    spawnSyncMachine: "xstate.init";
  };
  internalEvents: {
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {};
  missingImplementations: {
    actions: never;
    services: never;
    guards: never;
    delays: never;
  };
  eventsCausingServices: {};
  eventsCausingGuards: {};
  eventsCausingDelays: {};
  matchesStates: "idle" | "connecting";
  tags: never;
}
