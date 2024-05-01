export default function formatAddress(address) {
  if (!address) {
    return 'Адрес не указан';
  }

  address = address.replace(/^,\s*/, '');

  // Search for postal code
  const postalCodeMatch = address.match(/(\d{6})(?=[,\s.\d]|$)/);
  const postalCode = postalCodeMatch ? postalCodeMatch[1] : '';

  const withoutIndex = address.replace(new RegExp(`${postalCode}[\\s,.]+`, 'g'), '');

  const components = withoutIndex.split(' ');

  let formattedAddress = '';

  for (let i = 0; i < components.length; i += 2) {
    const component = components[i].trim();
    const nextComponent = components[i + 1];

    if (component.length === 6 && !isNaN(component)) {
      continue;
    }

    if (nextComponent && nextComponent.length === 6 && !isNaN(nextComponent)) {
      formattedAddress += `${component} ${nextComponent} `;
    } else {
      formattedAddress += `${component} ${nextComponent || ''} `;
    }
  }

  formattedAddress = formattedAddress.slice(0, -2);
  formattedAddress = removeDistrict(formattedAddress);
  formattedAddress = formattedAddress.replace(/,\s*$/, '');
  formattedAddress = formattedAddress.replace(/^,\s*/, '');
  return `${formattedAddress}`;
}

function removeDistrict(address) {
  let formattedAddress = '';

  formattedAddress = address.replace(/(?:Россия|Российская Федерация|РФ)/g, '');

  return formattedAddress;
}