import axios from 'axios';

export default (search) => {
  const url = 'https://api.collectplus.yodel.co.uk/api/v1/agentlocator/skatehut/AgentLocator.json';
  const query = `?searchCriteria=${search}&maxRecords=20`;

  return axios.get(`${url}${query}`)
    .then((response) => response.data);
};
