export const fetchDatabase = async (query, dataAccessor, token = "") => {
  const response = await fetch("https://builder.open-decision.org/graphql", {
    method: `Post`,
    headers: {
      "Content-Type": `application/json`,
      Authorization: `JWT ${token}`,
    },
    body: JSON.stringify({ query: query }),
  });

  return dataAccessor(await response.json());
};
