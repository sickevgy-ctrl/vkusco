#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { JSDOM } from 'jsdom'

/**
 * Универсальный менеджер меню ресторана
 * Объединяет функции парсинга, обновления и проверки меню
 */

const config = {
  menuPath: path.join(process.cwd(), 'data', 'menu.json'),
  dishesDir: path.join(process.cwd(), 'public', 'images', 'dishes')
}

/**
 * Парсит меню с сайта vkusdostavka.shop
 */
async function parseMenuFromWebsite() {
  try {
    console.log('🌐 Парсим меню с сайта vkusdostavka.shop...')
    
    const response = await fetch('https://vkusdostavka.shop/')
    const html = await response.text()
    
    const dom = new JSDOM(html)
    const document = dom.window.document
    
    const menuData = []
    const categories = []
    
    // Находим все секции меню
    const sections = document.querySelectorAll('h2')
    
    sections.forEach(section => {
      const categoryName = section.textContent.trim()
      if (categoryName && !categoryName.includes('Меню может отличаться')) {
        categories.push(categoryName)
      }
    })
    
    // Парсим блюда для каждой категории
    for (const category of categories) {
      console.log(`📂 Парсим категорию: ${category}`)
      
      const categoryData = {
        id: category.toLowerCase().replace(/\s+/g, '-'),
        name: category,
        dishes: []
      }
      
      // Ищем блюда в этой категории
      const categorySection = Array.from(document.querySelectorAll('h2')).find(h2 => 
        h2.textContent.trim() === category
      )
      
      if (categorySection) {
        let currentElement = categorySection.nextElementSibling
        let dishId = 1
        
        while (currentElement && currentElement.tagName !== 'H2') {
          if (currentElement.tagName === 'P' || currentElement.classList?.contains('dish-item')) {
            const dishText = currentElement.textContent.trim()
            
            if (dishText && !dishText.includes('₽') && dishText.length > 10) {
              // Парсим название блюда
              const nameMatch = dishText.match(/^([^0-9]+?)\s+(\d+)\s*г/)
              if (nameMatch) {
                const name = nameMatch[1].trim()
                const weight = nameMatch[2] + ' г'
                
                // Ищем описание и цену в следующих элементах
                let description = ''
                let price = 0
                let isHit = false
                let isNew = false
                
                let nextElement = currentElement.nextElementSibling
                while (nextElement && nextElement.tagName !== 'P' && nextElement.tagName !== 'H2') {
                  nextElement = nextElement.nextElementSibling
                }
                
                if (nextElement && nextElement.tagName === 'P') {
                  const nextText = nextElement.textContent.trim()
                  if (nextText.includes('₽')) {
                    price = parseInt(nextText.match(/(\d+)\s*₽/)?.[1] || '0')
                  } else if (nextText.length > 10 && !nextText.includes('₽')) {
                    description = nextText
                  }
                }
                
                // Проверяем на метки
                if (dishText.includes('_Хит_') || dishText.includes('Хит')) {
                  isHit = true
                }
                if (dishText.includes('_Новинка_') || dishText.includes('Новинка')) {
                  isNew = true
                }
                
                if (name && price > 0) {
                  categoryData.dishes.push({
                    id: dishId++,
                    name,
                    description: description || 'Вкусное блюдо от наших поваров',
                    price,
                    weight,
                    image: '/images/dishes/placeholder.svg',
                    ingredients: generateIngredients(name),
                    isHit,
                    isNew
                  })
                }
              }
            }
          }
          currentElement = currentElement.nextElementSibling
        }
      }
      
      if (categoryData.dishes.length > 0) {
        menuData.push(categoryData)
      }
    }
    
    // Сохраняем данные в файл
    await fs.promises.mkdir(path.dirname(config.menuPath), { recursive: true })
    await fs.promises.writeFile(config.menuPath, JSON.stringify(menuData, null, 2))
    
    console.log(`✅ Сохранено ${menuData.length} категорий меню`)
    return menuData
    
  } catch (error) {
    console.error('❌ Ошибка при парсинге меню:', error)
    return null
  }
}

/**
 * Создает меню из готовых данных
 */
function createMenuFromData() {
  const menuData = [
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
          image: '/images/dishes/fermer-zavtrak.svg',
          ingredients: ['говяжья вырезка', 'яйца', 'картофель', 'шампиньоны', 'салат'],
          isHit: true
        },
        {
          id: 2,
          name: 'Немецкий завтрак',
          description: 'Глазунья, манная колбаска, картофельные дольки, фасоль, салат',
          price: 625,
          weight: '340 г',
          image: '/images/dishes/nemeckiy-zavtrak.svg',
          ingredients: ['яйца', 'манная колбаска', 'картофель', 'фасоль', 'салат'],
          isHit: true
        }
      ]
    },
    {
      id: 'salads',
      name: 'Салаты',
      dishes: [
        {
          id: 3,
          name: 'Салат с говядиной и овощами гриль',
          description: 'Ростбиф, овощи гриль',
          price: 795,
          weight: '180 г',
          image: '/images/dishes/salat-govyadina.svg',
          ingredients: ['ростбиф', 'овощи гриль', 'зелень', 'оливковое масло']
        }
      ]
    }
  ]
  
  return menuData
}

/**
 * Добавляет недостающие категории в меню
 */
async function addMissingCategories() {
  try {
    console.log('🍽️ Добавляем недостающие категории в меню...')
    
    const menuData = JSON.parse(await fs.promises.readFile(config.menuPath, 'utf8'))
    
    // Находим максимальный ID блюда
    let maxDishId = 0
    for (const category of menuData) {
      for (const dish of category.dishes) {
        if (dish.id > maxDishId) {
          maxDishId = dish.id
        }
      }
    }
    
    // Новые категории
    const newCategories = [
      {
        id: "pasta",
        name: "Паста",
        dishes: [
          {
            id: ++maxDishId,
            name: "Паста Карбонара",
            description: "Классическая паста с беконом, яйцами и пармезаном",
            price: 645,
            weight: "280 г",
            image: "/images/dishes/pasta-carbonara.svg",
            ingredients: ["паста", "бекон", "яйца", "пармезан", "сливки"],
            isHit: false
          }
        ]
      },
      {
        id: "bakery",
        name: "Выпечка",
        dishes: [
          {
            id: ++maxDishId,
            name: "Круассан с лососем",
            description: "Нежный круассан со слабосоленым лососем",
            price: 495,
            weight: "150 г",
            image: "/images/dishes/croissant-salmon.svg",
            ingredients: ["круассан", "лосось", "сливочный сыр", "укроп"],
            isHit: false
          }
        ]
      }
    ]
    
    // Добавляем новые категории
    menuData.push(...newCategories)
    
    // Сохраняем обновленное меню
    await fs.promises.writeFile(config.menuPath, JSON.stringify(menuData, null, 2))
    
    console.log(`✅ Добавлено ${newCategories.length} новых категорий`)
    return menuData
    
  } catch (error) {
    console.error('❌ Ошибка при добавлении категорий:', error)
    return null
  }
}

/**
 * Обновляет пути к изображениям в меню
 */
async function updateMenuImages() {
  try {
    console.log('🖼️ Обновляем пути к изображениям в меню...')
    
    const menuData = JSON.parse(await fs.promises.readFile(config.menuPath, 'utf8'))
    const dishesFiles = await fs.promises.readdir(config.dishesDir)
    
    let updatedCount = 0
    
    // Маппинг названий блюд на ключи файлов
    const dishNameToKey = {
      'Фермерский завтрак': 'fermer-zavtrak',
      'Немецкий завтрак': 'nemeckiy-zavtrak',
      'Салат с говядиной и овощами гриль': 'salat-govyadina',
      'Паста Карбонара': 'pasta-carbonara',
      'Круассан с лососем': 'croissant-salmon'
    }
    
    // Обновляем пути к изображениям для каждого блюда
    for (const category of menuData) {
      for (const dish of category.dishes) {
        const dishKey = dishNameToKey[dish.name]
        
        if (!dishKey) {
          console.log(`⚠️ Не найден ключ для блюда: ${dish.name}`)
          continue
        }
        
        // Проверяем доступные форматы (приоритет: PNG > JPG > WebP > AVIF > SVG)
        const availableFormats = ['png', 'jpg', 'jpeg', 'webp', 'avif', 'svg']
        let imagePath = null
        
        for (const format of availableFormats) {
          const filename = `${dishKey}.${format}`
          if (dishesFiles.includes(filename)) {
            imagePath = `/images/dishes/${filename}`
            break
          }
        }
        
        // Если не найдено изображение, оставляем SVG как fallback
        if (!imagePath) {
          imagePath = `/images/dishes/${dishKey}.svg`
        }
        
        // Обновляем путь к изображению
        if (dish.image !== imagePath) {
          console.log(`  🔄 ${dish.name}: ${dish.image} → ${imagePath}`)
          dish.image = imagePath
          updatedCount++
        }
      }
    }
    
    // Сохраняем обновленное меню
    await fs.promises.writeFile(config.menuPath, JSON.stringify(menuData, null, 2))
    
    console.log(`✅ Обновлено ${updatedCount} путей к изображениям`)
    return menuData
    
  } catch (error) {
    console.error('❌ Ошибка при обновлении изображений:', error)
    return null
  }
}

/**
 * Проверяет статистику меню
 */
async function checkMenuStats() {
  try {
    console.log('📊 Проверяем статистику меню...')
    
    const menuData = JSON.parse(await fs.promises.readFile(config.menuPath, 'utf8'))
    const dishesFiles = await fs.promises.readdir(config.dishesDir)
    
    console.log(`\n📋 Статистика меню:`)
    console.log(`   • Категорий: ${menuData.length}`)
    
    let totalDishes = 0
    let dishesWithImages = 0
    let svgFiles = 0
    let realImages = 0
    
    for (const category of menuData) {
      console.log(`   • ${category.name}: ${category.dishes.length} блюд`)
      totalDishes += category.dishes.length
      
      for (const dish of category.dishes) {
        const dishKey = dish.image.split('/').pop().replace(/\.(svg|jpg|jpeg|png|webp|avif)$/, '')
        const hasImage = dishesFiles.some(file => file.startsWith(dishKey + '.'))
        
        if (hasImage) {
          dishesWithImages++
          
          // Проверяем тип изображения
          const svgFile = `${dishKey}.svg`
          const realImageFiles = dishesFiles.filter(file => 
            file.startsWith(dishKey + '.') && !file.endsWith('.svg')
          )
          
          if (realImageFiles.length > 0) {
            realImages++
          } else if (dishesFiles.includes(svgFile)) {
            svgFiles++
          }
        }
      }
    }
    
    console.log(`   • Всего блюд: ${totalDishes}`)
    
    console.log(`\n🖼️ Статистика изображений:`)
    console.log(`   • Всего файлов: ${dishesFiles.length}`)
    console.log(`   • С изображениями: ${dishesWithImages}`)
    console.log(`   • Реальные изображения: ${realImages}`)
    console.log(`   • SVG заглушки: ${svgFiles}`)
    console.log(`   • Без изображений: ${totalDishes - dishesWithImages}`)
    
    if (dishesWithImages === totalDishes) {
      console.log(`\n✅ Все блюда имеют изображения!`)
    } else {
      console.log(`\n⚠️ Некоторые блюда не имеют изображений`)
    }
    
  } catch (error) {
    console.error('❌ Ошибка при проверке статистики:', error)
  }
}

/**
 * Генерирует ингредиенты на основе названия блюда
 */
function generateIngredients(dishName) {
  const ingredientsMap = {
    'завтрак': ['яйца', 'хлеб', 'масло', 'соль', 'перец'],
    'салат': ['овощи', 'зелень', 'оливковое масло', 'соль'],
    'суп': ['овощи', 'мясо', 'специи', 'зелень'],
    'стейк': ['мясо', 'специи', 'масло', 'соль', 'перец'],
    'торт': ['мука', 'сахар', 'яйца', 'сливки', 'шоколад'],
    'паста': ['макароны', 'соус', 'сыр', 'специи'],
    'рыба': ['рыба', 'лимон', 'специи', 'масло'],
    'курица': ['курица', 'специи', 'масло', 'соль'],
    'говядина': ['говядина', 'специи', 'масло', 'соль']
  }
  
  const name = dishName.toLowerCase()
  for (const [key, ingredients] of Object.entries(ingredientsMap)) {
    if (name.includes(key)) {
      return ingredients
    }
  }
  
  return ['специи', 'соль', 'перец', 'масло']
}

/**
 * Сохраняет меню в файл
 */
async function saveMenu(menuData) {
  try {
    await fs.promises.mkdir(path.dirname(config.menuPath), { recursive: true })
    await fs.promises.writeFile(config.menuPath, JSON.stringify(menuData, null, 2))
    console.log(`✅ Меню сохранено в: ${config.menuPath}`)
    return true
  } catch (error) {
    console.error('❌ Ошибка при сохранении меню:', error)
    return false
  }
}

// CLI интерфейс
async function main() {
  const command = process.argv[2]
  
  switch (command) {
    case 'parse':
      const parsedMenu = await parseMenuFromWebsite()
      if (parsedMenu) {
        console.log('✅ Парсинг завершен успешно!')
      }
      break
    case 'create':
      const createdMenu = createMenuFromData()
      await saveMenu(createdMenu)
      break
    case 'add-categories':
      await addMissingCategories()
      break
    case 'update-images':
      await updateMenuImages()
      break
    case 'stats':
      await checkMenuStats()
      break
    case 'all':
      await parseMenuFromWebsite()
      await addMissingCategories()
      await updateMenuImages()
      await checkMenuStats()
      break
    default:
      console.log(`
🍽️ Менеджер меню ресторана

Использование: node menu-manager.mjs <команда>

Команды:
  parse           - Парсить меню с сайта vkusdostavka.shop
  create          - Создать меню из готовых данных
  add-categories  - Добавить недостающие категории
  update-images   - Обновить пути к изображениям
  stats           - Показать статистику меню
  all             - Выполнить все операции
      `)
  }
}

// Запуск
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error)
}

export { 
  parseMenuFromWebsite, 
  createMenuFromData, 
  addMissingCategories, 
  updateMenuImages, 
  checkMenuStats 
}

