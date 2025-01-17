const abbreviationMapping = {
  'Автономное учреждение': 'АУ',
  'Автономное учреждение культуры': 'АУК',
  'Бюджетное учреждение': 'БУ',
  'Бюджетное учреждение культуры': 'БУК',
  'Бюджетное муниципальное общеобразовательное учреждение': 'МБОУ',
  'Государственное автономное образовательное учреждение высшего образования':
    'ГАОУ ВО',
  'Государственное автономное образовательное учреждение дополнительного профессионального образования':
    'ГАОУ ДПО',
  'Государственное автономное профессиональное образовательное учреждение':
    'ГАПОУ',
  'Государственное автономное учреждение культуры': 'ГАУК',
  'Государственное бюджетное образовательное учреждение': 'ГБОУ',
  'государственное бюджетное общеобразовательное учреждение': 'ГБОУ',
  'Государственное бюджетное профессиональное образовательное учреждение':
    'ГБПОУ',
  'Государственное бюджетное учреждение': 'ГБУ',
  'Государственное бюджетное учреждение культуры': 'ГБУК',
  'Государственное краевое бюджетное учреждение': 'ГКБУ',
  'Государственное краевое бюджетное учреждение культуры': 'ГКБУК',
  'Государственное казённое учреждение': 'ГКУ',
  'Государственное казённое учреждение культуры': 'ГКУК',
  'Государственное образовательное бюджетное учреждение культуры': 'ГОБУК',
  'Государственное бюджетное общеобразовательное учреждение Средняя общеобразовательная школа': 'ГБОУ СОШ',
  'Государственное образовательное учреждение высшего образования': 'ГОУ ВО',
  'Государственное образовательное учреждение высшего профессионального образования':
    'ГОУ ВПО',
  'Государственное профессиональное образовательное учреждение': 'ГПОУ',
  'Государственное учреждение': 'ГУ',
  'Государственное учреждение культуры': 'ГУК',
  'Краевое государственное автономное учреждение культуры': 'КГАУК',
  'Краевое государственное бюджетное научное учреждение культуры': 'КГБНУК',
  'Краевое государственное бюджетное учреждение': 'КГБУ',
  'Краевое государственное казённое учреждение': 'КГКУ',
  'краевое государственное автономное профессиональное образовательное учреждение': 'КГА ПОУ',
  'Краевое государственное учреждение': 'КГУ',
  'Муниципальное автономное общеобразовательное учреждение': 'МАОУ',
  'Муниципальное автономное учреждение': 'МАУ',
  'Муниципальное автономное учреждение культуры': 'МАУК',
  'Муниципальное бюджетное общеобразовательное учреждение': 'МБОУ',
  'муниципальное бюджетное общеобразовательное учреждение': 'МБОУ',
  'МУНИЦИПАЛЬНОЕ БЮДЖЕТНОЕ ОБЩЕОБРАЗОВАТЕЛЬНОЕ УЧРЕЖДЕНИЕ': 'МБОУ',
  'Муниципальное бюджетное учреждение': 'МБУ',
  'Муниципальное бюджетное учреждение дополнительного образования': 'МБУДО',
  'Муниципальное бюджетное учреждение культуры': 'МБУК',
  'Муниципальное бюджетное учреждение культуры дополнительного образования':
    'МБУКДО',
  'Муниципальное казённое учреждение': 'МКУ',
  'Муниципальное казённое общеобразовательное учреждение': 'МКОУ',
  'муниципальное казенное общеобразовательное учреждение': 'МКОУ',
  'Муниципальное казенное общеобразовательное учреждение': 'МКОУ',
  'Муниципальное казённое образовательное учреждение': 'МКОУ',
  'Муниципальное казенное образовательное учреждение': 'МКОУ',
  'Муниципальное казённое учреждение культуры': 'МКУК',
  'Муниципальное учреждение': 'МУ',
  'Муниципальное учреждение культуры': 'МУК',
  'муниципальное общеобразовательное учреждение средняя общеобразовательная школа': 'МОУ СОШ',
  'Муниципальное общеобразовательное автономное учреждение Средняя общеобразовательная школа': 'МОАУ СОШ',
  'Муниципальное образовательное учреждение': 'МОУ',
  'муниципальное образовательное учреждение': 'МОУ',
  'муниципальное общеобразовательное учреждение': 'МОУ',
  'Муниципальное общеобразовательное учреждение': 'МОУ',
  'Муниципальное общеобразовательное бюджетное учреждение': 'МБОУ',
  'НАЧАЛЬНАЯ ОБЩЕОБРАЗОВАТЕЛЬНАЯ ШКОЛА': 'НОШ',
  'негосударственное образовательное учреждение': 'НОУ',
  'Негосударственное образовательное учреждение высшего профессионального образования':
    'НОУ ВПО',
  'Негосударственное некоммерческое образовательное учреждение высшего профессионального образования':
    'ННОУ ВПО',
  'Общеобразовательная автономная некоммерческая организация': 'ОАНО',
  'Областное бюджетное учреждение культуры': 'ОБУК',
  'Областное государственное автономное учреждение культуры': 'ОГАУК',
  'Областное государственное бюджетное учреждение культуры': 'ОГБУК',
  'Областное государственное казённое учреждение культуры': 'ОГКУК',
  'основная общеобразовательная школа': 'ООШ',
  'Основная общеобразовательная школа': 'ООШ',
  'средняя общеобразовательная школа': 'СОШ',
  'Федеральное государственное автономное образовательное учреждение высшего образования':
    'ФГАОУ ВО',
  'Федеральное государственное автономное образовательное учреждение высшего профессионального образования':
    'ФГАОУ ВПО',
  'Федеральное государственное бюджетное военное образовательное учреждение высшего образования':
    'ФГБВОУ ВО',
  'Федеральное государственное бюджетное научно-исследовательское учреждение':
    'ФГБНИУ',
  'Федеральное государственное бюджетное научное учреждение': 'ФГБНУ',
  'Федеральное государственное бюджетное образовательное учреждение': 'ФГБОУ',
  'федеральное государственное бюджетное образовательное учреждение высшего образования': 'ФГБОУ ВО',
  'федеральное государственное бюджетное образовательное учреждение высшего профессионального образования': 'ФГБОУ ВПО',
  'Федеральное государственное бюджетное учреждение': 'ФГБУ',
  'Федеральное государственное бюджетное учреждение культуры': 'ФГБУК',
  'Федеральное государственное бюджетное учреждение науки': 'ФГБУН',
  'Федеральное государственное казённое военное образовательное учреждение':
    'ФГК ВОУ',
  'федеральное государственное казенное военное образовательное учреждение высшего образования':
    'ФГК ВОУ ВО',
  'Федеральное государственное казённое образовательное учреждение': 'ФГКОУ',
  'Федеральное государственное образовательное учреждение': 'ФГОУ',
  'Федеральное государственное учреждение': 'ФГУ',
  'Федеральное государственное унитарное предприятие': 'ФГУП',
  'Федеральное казённое учреждение': 'ФКУ',
  'Федеральное казённое учреждение культуры': 'ФКУК',
  'Частное профессиональное образовательное учреждение': 'ЧПОУ',
  'Образовательное частное учреждение высшего образования': 'ЧОУ ВО',
};
export default function abbreviateInstitutionName(fullName) {
  let abbreviatedName = fullName;
  for (const [full, abbr] of Object.entries(abbreviationMapping)) {
    if (fullName.includes(full)) {
      abbreviatedName = abbreviatedName.replace(full, abbr);
    }
  }
  abbreviatedName = abbreviatedName.replace(/['"“”«»""]/g, '');
 
  return abbreviatedName;
}
