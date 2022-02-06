const { loadEnvConfig } = require("@next/env");
loadEnvConfig(process.cwd());

module.exports = {
  overwrite: true,
  schema: {
    "https://api.open-decision.org/v1/graphql": {
      headers: {
        Authorization: `Bearer ${process.env.OD_API_KEY}`,
      },
    },
  },
  documents: "./src/**/*.{graphql,js,ts,jsx,tsx}",
  generates: {
    "./src/features/Data/generated/graphql.tsx": {
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-query",
      ],
      config: {
        fetcher: {
          func: "../useFetchData#useFetchData",
          isReactHook: true,
          skipTypename: true,
        },
      },
    },
    "./src/features/Data/generated/graphql.schema.json": {
      plugins: ["introspection"],
    },
  },
};