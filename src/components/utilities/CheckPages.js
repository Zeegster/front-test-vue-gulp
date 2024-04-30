async function isPageAvailable(page) {
  try {
     const response = await fetch(`${API}?page=${page}&count=1`);
     return response.ok; // Если статус ответа 200 OK, страница доступна
  } catch (error) {
     return false; // Если произошла ошибка, страница не доступна
  }
 }
 

async function checkAllPages(totalPages) {
  const pageCheckPromises = Array.from({ length: totalPages }, (_, index) =>
     isPageAvailable(index + 1)
  );
  const pageAvailability = await Promise.all(pageCheckPromises);
  return pageAvailability;
 }
 

export default async function AvailablePages(totalPages) {
  const pageAvailability = await checkAllPages(totalPages);

  // Обновление пользовательского интерфейса на основе доступности страниц
  // Например, отключение кнопок для недоступных страниц
  pageAvailability.forEach((isAvailable, index) => {
    const pageButton = document.getElementById(`page-${index + 1}`);
    if (pageButton) {
      pageButton.disabled = !isAvailable;
    }
  });
}
