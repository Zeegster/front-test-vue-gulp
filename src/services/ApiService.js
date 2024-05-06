import { ref } from 'vue';
import abbreviateInstitutionName from '../components/utilities/FormatName';
import formatEducationLevel from '../components/utilities/FormatEduLevels';
import formatAddress from '../components/utilities/FormatAdress';

const API = 'https://schooldb.skillline.ru/api/schools';
export async function fetchSchools(page, count) {
  const loading = ref(true);

  try {
    const response = await fetch(`${API}?page=${page}&count=${count}`);
    if (!response.ok) throw new Error(`HTTP error status: ${response.status}`);
    const data = await response.json();
    
    return data;
  } catch (err) {
    console.error('Failed to fetch schools:', err);
  } finally {
    loading.value = false;
  }
}

export const getDataFromAPI = (dataFromApi) => {
  const data = dataFromApi.data
  const itemsSchools = ref([]);
  const currentPage = ref(1);
  const totalPages = ref(10);
  const statuses = ref([]);
  let fetchedData = [];

  itemsSchools.value = data.list.map((school) => ({
    region: school.edu_org.region.name,
    name: abbreviateInstitutionName(school.edu_org.full_name),
    address: formatAddress(school.edu_org.contact_info.post_address),
    status: school.supplements[0].status.name,
    educationLevel: Array.from(
      new Set(
        school.supplements
         .flatMap((supplement) =>
            supplement.educational_programs.map((program) =>
              program.edu_level.name!== null &&
              program.edu_level.name!== 'Не определен'
               ? formatEducationLevel(program.edu_level.name)
                : null
            )
          )
         .filter((level) => level!== null)
      )
    ),
  }));
  totalPages.value = Math.ceil(data.pages_count);
  statuses.value = getStatus(data);
  fetchedData = {
    items: itemsSchools.value,
    currentPage: currentPage.value,
    totalPages: totalPages.value,
    statuses: statuses.value,
  }
  return { fetchedData };
}


function getStatus(data) {
  const statuses = new Set();
  if (Array.isArray(data.list)) {
    data.list.forEach((item) => {
      if (item && Array.isArray(item.supplements)) {
        item.supplements.forEach((supplement) => {
          if (supplement.status && supplement.status.name !== null) {
            statuses.add(supplement.status.name);
          }
        });
      }
    });
  }
  return Array.from(statuses);
}
