import graphQlRequest from '@/services/graphQlRequest';

export default () => {
  const request = `{
    countries {
      id
      two_letter_abbreviation
      three_letter_abbreviation
      full_name_locale
      available_regions {
        id
        code
        name
      }
    }
  }`;
  return graphQlRequest(request).then((response) => {
    response.data.countries.sort((a, b) => a.full_name_locale.toUpperCase()
      .localeCompare(b.full_name_locale.toUpperCase()));
    return response;
  });
};
