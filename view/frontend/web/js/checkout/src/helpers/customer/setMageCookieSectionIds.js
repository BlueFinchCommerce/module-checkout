import Cookies from 'js-cookie';

export default (name, timestamp) => {
  const sectionData = Cookies.get('section_data_ids');

  if (sectionData) {
    const parsedSectionData = JSON.parse(sectionData);
    parsedSectionData[name] = timestamp;
    Cookies.set('section_data_ids', JSON.stringify(parsedSectionData));
  }
};
