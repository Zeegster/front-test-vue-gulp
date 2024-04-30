export default function formatAddress(address) {
  // Убираем индекс из адреса. Учитываем индес с точкой и пробелом
  const withoutIndex = address.replace(/(\d+\.)?\s/, '');

  const components = withoutIndex.split(',');
 
  // Извлекаем и форматируем необходимые компоненты
  let formattedAddress = '';
  components.forEach((component, index) => {
     // Удаляем пробелы в начале и конце компонента
     component = component.trim();
 
     // Проверяем, является ли компонент индексом
     if (component.length === 6 && !isNaN(component)) {
       // Если это индекс, пропускаем его
       return;
     } else {
       // Добавляем компонент в форматированный адрес
       formattedAddress += `${component}, `;
     }
  });
 
  // Удаляем последний лишний пробел и запятую
  formattedAddress = formattedAddress.slice(0, -2);
 
  return formattedAddress;
 }