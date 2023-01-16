export const CommonErrors = ["GENERIC_ERROR", "UNEXPECTED_ERROR"] as const;

export const ProgrammerErrors = [
  "MISSING_CONTEXT_PROVIDER",
  "TRIED_VERIFY_UNAUTHENTICATED_USER_LOGIN",
  "MISSING_ENV_VARIABLE",
  "UNAUTHENTICATED_API_CALL",
  "MISSING_URL_PARTS",
  "UNKNOWN_CONDITION_TYPE_IN_RESOLVER",
  "INTERPRETER_WITHOUT_CURRENT_NODE",
  "ENTITY_NOT_FOUND",
  "TRIED_ADDING_INVALID_EDGE",
  "INVALID_ENTITY_CREATION",
  "INVALID_EDGES",
  "UNKNOWN_INPUT_TYPE",
  "UNKNOWN_NODE_TYPE",
  "MISSING_ANSWER_ON_INTERPRETER_CONTEXT",
  "INVALID_REQUESTED_PLUGIN_ENTITY_TYPE",
  "NO_PLUGIN_ENTITIES_AVAILABLE",
  "REQUESTED_PLUGIN_ENTITY_GROUP_NOT_FOUND",
  "REQUESTED_ANSWER_OF_WRONG_TYPE",
  "ENTITY_FOUND_ON_DIFFERENT_ENTITY_KEY",
  "REQUESTED_ANSWER_DOES_NOT_EXIST_ON_INPUT",
  "REQUESTED_NON_EXISTENT_ANSWER",
  "INVALID_ANSWER_TYPE",
  "INVALID_INPUT_TYPE",
  "MISSING_INPUT_ON_DECISION_NODE",
  "INVALID_TOKEN_PAYLOAD",
  "FETCH_BLOB_FUNCTION_NOT_PROVIDED",
  "MISSING_NAME",
  "NODE_WITHOUT_INPUT",
] as const;

export const InterpreterErrors = [
  "INVALID_TREE",
  "MISSING_STARTNODE",
  "NO_CURRENT_NODE",
  "NO_EDGE_FOR_THRUTHY_CONDITION",
  "NO_TRUTHY_CONDITION",
  "MISSING_TEMPLATE_UUID",
  "MISSING_TREE_IN_MODULE",
] as const;

export const BuilderErrors = [
  "AUTH_VALIDATION_FAILED",
  "WEBSOCKET_CONNECTION_FAILED",
  "IMPORT_INVALID_FILE",
  "DUPLICATE_EDGE",
  "CIRCULAR_CONNECTION",
  "CONNECTED_TO_SELF",
] as const;

export enum APIErrors {
  NOT_FOUND = 404,
  NO_TREE_DATA = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  INTERNAL_SERVER_ERROR = 500,
  EMAIL_ALREADY_USED = 400,
  INCORRECT_EMAIL_OR_PASSWORD = 401,
  UNAUTHENTICATED = 401,
  PASSWORD_RESET_FAILED = 401,
  EMAIL_VERIFICATION_FAILED = 401,
  USER_NOT_FOUND = 404,
  EMAIL_NOT_WHITELISTED = 403,
  INVALID_DATA = 400,
  WHITELIST_ENTRY_COULD_NOT_BE_CREATED = 400,
  WHITELIST_ENTRY_COULD_NOT_BE_DELETED = 400,
  VALIDATION_ERROR = 400,
  EXPIRED_TOKEN = 401,
  UNEXPECTED_ERROR = 500,
  PASSWORD_TO_WEAK = 400,
  INVALID_EMAIL = 400,
  INVALID_FILETYPE = 400,
  OFFLINE = 500,
  EMAIL_NOT_SEND = 500,
  PREVIEW_NOT_ENABLED = 403,
  NO_ACCESSIBLE_OBJECT_FOUND = 404,
  DOC_GENERATION_NOT_CONFIGURED = 500,
  DOC_GENERATION_FAILED = 500,
  TEMPLATE_UPLOAD_FAILED = 500,
  PUBLISHING_OF_TEMPLATES_FAILED = 500,
  INVALID_DOCUMENT_TEMPLATE = 400,
  FILE_UPDATED_UPDATE_DB_ENTRY_FAILED = 500,
  TOKEN_NOT_FOUND = 404,
}

export type TCommonErrors = typeof CommonErrors[number];
export type TInterpreterErrors = typeof InterpreterErrors[number];
export type TBuilderErrors = typeof BuilderErrors[number];
export type TAPIErrors = keyof typeof APIErrors;
export type TProgrammerErrors = typeof ProgrammerErrors[number];

export const ErrorCodes = [
  ...CommonErrors,
  ...InterpreterErrors,
  ...BuilderErrors,
] as const;

export type ErrorCodes = typeof ErrorCodes[number] | TAPIErrors;

export type Origins = "API" | "INTERPRETER" | "BUILDER";
