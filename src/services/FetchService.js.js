
// const schoolsUrl = 'https://schooldb.skillline.ru/api/schools';
// const regionsUrl = 'https://schooldb.skillline.ru/api/regions';
// const federalUrl = 'https://schooldb.skillline.ru/api/regions';

// let queue = [];
// let inProgress = 0;
// const maxConcurrency = 3;

// async function fetchRegions() {
//   try {
//     const response = await fetch(regionsUrl);
//     if (!response.ok) throw new Error(`HTTP failed response ${response.status}`);
//     const data = await response.json();
//     return data.data;
//   } catch (error) {
//     console.error(error);
//   }
// }


// async function prepareSchoolsUrls() {
//   const regions = await fetchRegions();
//   return regions.map((region) => `${schoolsUrl}?count=50&region_id=${region.id}`);
// }

// async function fetchUrl(url) {
//   try {
//     const response = await fetch(url);
//     if (!response.ok) throw new Error(`HTTP error status: ${response.status}`);
//     return await response.json();
//   } catch (error) {
//     console.error(error);
//   }
// }

// async function fetchSchoolsByRegions(id,count) {
//   try {
    
//     const schoolsByRegionsUrls = await prepareSchoolsUrls();
//     for (const url of schoolsByRegionsUrls) {
//       queue.push(url);
//     } 

//     while (queue.length > 0) {
//       if (inProgress < maxConcurrency) {
//         const url = queue.shift();
//         inProgress++;
//         fetchUrl(url)
//         .then((data) => {
//             console.log('Fetched:', url, data);
//             inProgress--;
//           })
//         .catch((error) => {
//             console.error('Error fetching:', url, error);
//             inProgress--;
//           });
//       } else {
//         await new Promise((resolve) => setTimeout(resolve, 1000));
//       }
//     }
//   } catch (error) {
//     console.error('Error fetching schools by regions:', error);
//   }
// }

// async function fetchSchoolsByRegionsId(id) {
//   try {
//     let url = `${schoolsUrl}?count=${count}&region_id=${id}`;
//     fetchUrl(url).then((data) => {
//       console.log('Fetched:', url, data);
//     });
//   } catch (error) {
//     console.error('Error fetching schools by regions:', error);
//   }
// }