import graphQlRequest from '@/services/graphQlRequest';

export default (agentId) => {
  const request = `
    mutation {
      CollectPlusUpdateAgent(agent_id: "${agentId}")
    }`;
  return graphQlRequest(request);
};
