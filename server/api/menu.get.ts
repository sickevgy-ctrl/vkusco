import fs from 'fs'
import path from 'path'
import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    // Путь к файлу с данными меню
    const menuPath = path.join(process.cwd(), 'data', 'menu.json')
    // Проверяем, существует ли файл
    if (!fs.existsSync(menuPath)) {
      // Если файла нет, возвращаем базовые данные
      return {
        success: false,
        message: 'Файл меню не найден. Запустите скрипт парсинга.',
        data: getDefaultMenu()
      }
    }
    
    // Читаем данные из файла
    const menuData = JSON.parse(fs.readFileSync(menuPath, 'utf8'))
    
    // Проверяем актуальность данных (не старше 24 часов)
    const stats = fs.statSync(menuPath)
    const now = new Date()
    const fileTime = new Date(stats.mtime)
    const hoursDiff = (now.getTime() - fileTime.getTime()) / (1000 * 60 * 60)
    
    if (hoursDiff > 24) {
      console.log('Данные меню устарели, рекомендуется обновление')
    }
    
    return {
      success: true,
      data: menuData,
      lastUpdated: fileTime.toISOString(),
      needsUpdate: hoursDiff > 24
    }
    
  } catch (error) {
    console.error('Ошибка при загрузке меню:', error)
    
    return {
      success: false,
      message: 'Ошибка при загрузке данных меню',
      data: getDefaultMenu()
    }
  }
})

// Базовое меню на случай ошибок
function getDefaultMenu() {
  return [
    {
      id: 'breakfast',
      name: 'Завтраки',
      dishes: [
        {
          id: 1,
          name: 'Фермерский завтрак',
          description: 'Говяжья вырезка, глазунья, обжаренный картофель дольками, шампиньоны и свежий салат',
          price: 785,
          weight: '370 г',
          image: '/images/dishes/risotto-truffle.svg',
          ingredients: ['говяжья вырезка', 'яйца', 'картофель', 'шампиньоны', 'салат'],
          isHit: true
        }
      ]
    }
  ]
}
