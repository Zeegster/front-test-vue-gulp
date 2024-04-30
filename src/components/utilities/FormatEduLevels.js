const educationLevels = {
  'Высшее образование - специалитет': 'Специальное',
  'Послевузовское профессиональное образование': 'Послевузовское',
  'Среднее профессиональное образование': 'Cреднее',
  'Высшее образование - бакалавриат': 'Бакалавриат',
  'Высшее образование - бакалавриат': 'Бакалавриат',
  'Начальное общее образование': 'Начальное',
  'Основное общее образование': 'Основное',
  'Среднее общее образование': 'Среднее',
  'Среднее (полное) общее образование': 'Среднее',
  'Высшее образование': 'Магистратура',
  'Высшее профессиональное образование': 'Высшее профессиональное',
  'Профессиональное обучение': 'Проф',
  'Высшее образование - магистратура': 'Магистратура',
};

export default function abbreviateEducationLevel(level) {
  return educationLevels[level] || level; 
}
