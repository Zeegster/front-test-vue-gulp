export default function formatAddress(address) {
  // Извлечение почтового индекса
  const withoutIndex = address.replace(/(\d+\.)?\s/, '');

  const components = withoutIndex.split(',');

  let formattedAddress = '';

  components.forEach((component, index) => {
    component = component.trim();

    if (component.length === 6 && !isNaN(component)) {
      return;
    } else {
      formattedAddress += `${component}, `;
    }
  });

  formattedAddress = formattedAddress.slice(0, -2);

  return formattedAddress;
}
