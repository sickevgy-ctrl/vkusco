#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Универсальный менеджер изображений для ресторана
 * Объединяет функции создания, загрузки и оптимизации изображений
 */

// Конфигурация
const config = {
  // Размеры изображений
  dishImageSize: { width: 800, height: 600 },
  atmosphereImageSize: { width: 1200, height: 800 },
  thumbnailSize: { width: 400, height: 300 },
  
  // Качество сжатия
  quality: {
    jpeg: 85,
    webp: 80,
    avif: 75,
    png: 90
  },
  
  // Пути
  paths: {
    dishes: path.join(__dirname, '..', 'public', 'images', 'dishes'),
    atmosphere: path.join(__dirname, '..', 'public', 'images', 'atmosphere'),
    menu: path.join(__dirname, '..', 'data', 'menu.json')
  }
}

/**
 * Создает SVG изображение блюда
 */
function createDishSVG(dish, type = 'realistic') {
  const { name, title, color, emoji, description, bgColor } = dish
  
  if (type === 'simple') {
    return createSimpleDishSVG(title, color, emoji)
  }
  
  if (type === 'realistic') {
    return createRealisticDishSVG(dish)
  }
  
  return createPlaceholderSVG(name)
}

function createSimpleDishSVG(title, color, emoji) {
  return `<svg width="500" height="300" viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${color};stop-opacity:0.2" />
        <stop offset="100%" style="stop-color:${color};stop-opacity:0.4" />
      </linearGradient>
    </defs>
    <rect width="500" height="300" fill="url(#bg)"/>
    <circle cx="250" cy="150" r="60" fill="${color}" fill-opacity="0.3"/>
    <text x="250" y="150" font-family="Arial, sans-serif" font-size="60" text-anchor="middle" dominant-baseline="middle">${emoji}</text>
    <text x="250" y="220" font-family="Arial, sans-serif" font-size="18" fill="${color}" text-anchor="middle" font-weight="bold">${title}</text>
  </svg>`
}

function createRealisticDishSVG(dish) {
  const { title, color, emoji, description, bgColor } = dish
  const gradientId = `gradient-${dish.name}`
  const shadowId = `shadow-${dish.name}`
  
  return `<svg width="800" height="600" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${bgColor};stop-opacity:0.8" />
        <stop offset="100%" style="stop-color:${color};stop-opacity:0.1" />
      </linearGradient>
      <filter id="${shadowId}" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="12" stdDeviation="15" flood-color="rgba(0,0,0,0.4)"/>
      </filter>
    </defs>
    <rect width="800" height="600" fill="url(#${gradientId})"/>
    <ellipse cx="400" cy="300" rx="200" ry="150" fill="white" fill-opacity="0.9" filter="url(#${shadowId})"/>
    <text x="400" y="320" font-family="Arial, sans-serif" font-size="80" text-anchor="middle" dominant-baseline="middle">${emoji}</text>
    <text x="400" y="450" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="${color}" text-anchor="middle">${title}</text>
    <text x="400" y="480" font-family="Arial, sans-serif" font-size="16" fill="${color}" text-anchor="middle" fill-opacity="0.8">${description}</text>
  </svg>`
}

function createPlaceholderSVG(name) {
  return `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#f3f4f6;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#e5e7eb;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#bg)"/>
    <rect x="20" y="20" width="360" height="260" fill="none" stroke="#d1d5db" stroke-width="2" stroke-dasharray="5,5" rx="10"/>
    <circle cx="200" cy="120" r="40" fill="#d1d5db"/>
    <text x="200" y="180" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#6b7280">${name.replace(/-/g, ' ')}</text>
    <text x="200" y="200" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#9ca3af">Placeholder</text>
  </svg>`
}

/**
 * Создает изображения атмосферы
 */
function createAtmosphereSVG(image) {
  const { title, description, color, emoji } = image
  const gradientId = `gradient-${image.name}`
  const shadowId = `shadow-${image.name}`
  
  return `<svg width="1200" height="800" viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${color};stop-opacity:0.1" />
        <stop offset="100%" style="stop-color:${color};stop-opacity:0.05" />
      </linearGradient>
      <filter id="${shadowId}" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="rgba(0,0,0,0.3)"/>
      </filter>
    </defs>
    <rect width="1200" height="800" fill="url(#${gradientId})"/>
    <rect x="100" y="100" width="1000" height="600" fill="white" fill-opacity="0.9" filter="url(#${shadowId})" rx="20"/>
    <text x="600" y="400" font-family="Arial, sans-serif" font-size="120" text-anchor="middle" dominant-baseline="middle">${emoji}</text>
    <text x="600" y="550" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="${color}" text-anchor="middle">${title}</text>
    <text x="600" y="590" font-family="Arial, sans-serif" font-size="24" fill="${color}" text-anchor="middle" fill-opacity="0.8">${description}</text>
  </svg>`
}

/**
 * Оптимизирует изображение с помощью Sharp
 */
async function optimizeImage(inputPath, outputDir, baseName, options = {}) {
  try {
    const image = sharp(inputPath)
    const metadata = await image.metadata()
    
    console.log(`Обрабатываю: ${baseName} (${metadata.width}x${metadata.height})`)
    
    // Создаем директории
    await fs.promises.mkdir(outputDir, { recursive: true })
    
    // JPEG оптимизация
    if (options.formats?.includes('jpg')) {
      await image
        .jpeg({ 
          quality: config.quality.jpeg,
          progressive: true
        })
        .toFile(path.join(outputDir, `${baseName}.jpg`))
    }
    
    // WebP версия
    if (options.formats?.includes('webp')) {
      await image
        .webp({ 
          quality: config.quality.webp,
          effort: 6
        })
        .toFile(path.join(outputDir, `${baseName}.webp`))
    }
    
    // AVIF версия
    if (options.formats?.includes('avif')) {
      try {
        await image
          .avif({ 
            quality: config.quality.avif,
            effort: 9
          })
          .toFile(path.join(outputDir, `${baseName}.avif`))
      } catch (error) {
        console.warn(`AVIF не поддерживается для ${baseName}`)
      }
    }
    
    console.log(`✅ Оптимизировано: ${baseName}`)
    
  } catch (error) {
    console.error(`❌ Ошибка при обработке ${baseName}:`, error.message)
  }
}

/**
 * Создает изображения блюд
 */
async function createDishImages(type = 'realistic') {
  console.log(`🍽️ Создаем изображения блюд (тип: ${type})...`)
  
  // Читаем меню
  const menuData = JSON.parse(await fs.promises.readFile(config.paths.menu, 'utf8'))
  
  // Создаем директорию
  await fs.promises.mkdir(config.paths.dishes, { recursive: true })
  
  let createdCount = 0
  
  // Обрабатываем каждое блюдо
  for (const category of menuData) {
    for (const dish of category.dishes) {
      const dishKey = dish.image.split('/').pop().replace(/\.(svg|jpg|jpeg|png|webp|avif)$/, '')
      
      // Создаем SVG
      const svgContent = createDishSVG({
        name: dishKey,
        title: dish.name,
        color: getDishColor(dish.name),
        emoji: getDishEmoji(dish.name),
        description: dish.description,
        bgColor: '#FFF8DC'
      }, type)
      
      const svgPath = path.join(config.paths.dishes, `${dishKey}.svg`)
      await fs.promises.writeFile(svgPath, svgContent)
      
      createdCount++
    }
  }
  
  console.log(`✅ Создано ${createdCount} изображений блюд`)
}

/**
 * Создает изображения атмосферы
 */
async function createAtmosphereImages() {
  console.log('🏛️ Создаем изображения атмосферы...')
  
  const atmosphereImages = [
    { name: 'main-hall', title: 'Основной зал', description: 'Просторный зал с изысканным интерьером', color: '#8B4513', emoji: '🏛️' },
    { name: 'bar-counter', title: 'Барная стойка', description: 'Элегантная барная стойка с широким выбором напитков', color: '#DAA520', emoji: '🍸' },
    { name: 'terrace', title: 'Летняя терраса', description: 'Уютная терраса для приятного времяпрепровождения', color: '#228B22', emoji: '🌿' },
    { name: 'wine-cellar', title: 'Винный погреб', description: 'Эксклюзивная коллекция вин в атмосферном погребе', color: '#800080', emoji: '🍷' }
  ]
  
  await fs.promises.mkdir(config.paths.atmosphere, { recursive: true })
  
  for (const image of atmosphereImages) {
    const svgContent = createAtmosphereSVG(image)
    const svgPath = path.join(config.paths.atmosphere, `${image.name}.svg`)
    await fs.promises.writeFile(svgPath, svgContent)
    console.log(`✅ Создано: ${image.name}.svg`)
  }
  
  console.log('✅ Создано изображений атмосферы')
}

/**
 * Оптимизирует все изображения
 */
async function optimizeAllImages() {
  console.log('🚀 Оптимизируем все изображения...')
  
  const formats = ['jpg', 'webp', 'avif']
  
  // Оптимизируем изображения блюд
  const dishesFiles = await fs.promises.readdir(config.paths.dishes)
  const imageFiles = dishesFiles.filter(file => 
    /\.(jpg|jpeg|png)$/i.test(file)
  )
  
  for (const file of imageFiles) {
    const baseName = path.parse(file).name
    const inputPath = path.join(config.paths.dishes, file)
    await optimizeImage(inputPath, config.paths.dishes, baseName, { formats })
  }
  
  console.log('✅ Оптимизация завершена')
}

/**
 * Загружает реальные изображения с сайта
 */
async function downloadRealImages() {
  console.log('🌐 Загружаем реальные изображения...')
  
  // Здесь можно добавить логику загрузки с сайта
  // Пока что создаем заглушки
  await createDishImages('placeholder')
  
  console.log('✅ Загрузка завершена')
}

/**
 * Обновляет пути к изображениям в меню
 */
async function updateMenuPaths() {
  console.log('🔄 Обновляем пути к изображениям в меню...')
  
  const menuData = JSON.parse(await fs.promises.readFile(config.paths.menu, 'utf8'))
  const dishesFiles = await fs.promises.readdir(config.paths.dishes)
  
  let updatedCount = 0
  
  for (const category of menuData) {
    for (const dish of category.dishes) {
      const dishKey = dish.image.split('/').pop().replace(/\.(svg|jpg|jpeg|png|webp|avif)$/, '')
      
      // Ищем лучшее доступное изображение
      const availableFormats = ['png', 'jpg', 'jpeg', 'webp', 'avif', 'svg']
      let imagePath = null
      
      for (const format of availableFormats) {
        const filename = `${dishKey}.${format}`
        if (dishesFiles.includes(filename)) {
          imagePath = `/images/dishes/${filename}`
          break
        }
      }
      
      if (imagePath && dish.image !== imagePath) {
        dish.image = imagePath
        updatedCount++
      }
    }
  }
  
  await fs.promises.writeFile(config.paths.menu, JSON.stringify(menuData, null, 2))
  console.log(`✅ Обновлено ${updatedCount} путей к изображениям`)
}

/**
 * Проверяет статистику изображений
 */
async function checkImageStats() {
  console.log('📊 Проверяем статистику изображений...')
  
  const menuData = JSON.parse(await fs.promises.readFile(config.paths.menu, 'utf8'))
  const dishesFiles = await fs.promises.readdir(config.paths.dishes)
  
  let totalDishes = 0
  let dishesWithImages = 0
  let svgFiles = 0
  let realImages = 0
  
  for (const category of menuData) {
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
  
  console.log(`📋 Статистика:`)
  console.log(`   • Всего блюд: ${totalDishes}`)
  console.log(`   • С изображениями: ${dishesWithImages}`)
  console.log(`   • Реальные изображения: ${realImages}`)
  console.log(`   • SVG заглушки: ${svgFiles}`)
  console.log(`   • Без изображений: ${totalDishes - dishesWithImages}`)
}

// Вспомогательные функции
function getDishColor(dishName) {
  const colors = {
    'завтрак': '#8B4513',
    'салат': '#228B22',
    'суп': '#FFA500',
    'стейк': '#8B0000',
    'торт': '#FF8C00',
    'паста': '#DAA520',
    'рыба': '#4169E1',
    'курица': '#F4A460',
    'говядина': '#A0522D'
  }
  
  const name = dishName.toLowerCase()
  for (const [key, color] of Object.entries(colors)) {
    if (name.includes(key)) return color
  }
  return '#666666'
}

function getDishEmoji(dishName) {
  const emojis = {
    'завтрак': '🍳',
    'салат': '🥗',
    'суп': '🍲',
    'стейк': '🥩',
    'торт': '🍰',
    'паста': '🍝',
    'рыба': '🐟',
    'курица': '🍗',
    'говядина': '🍖'
  }
  
  const name = dishName.toLowerCase()
  for (const [key, emoji] of Object.entries(emojis)) {
    if (name.includes(key)) return emoji
  }
  return '🍽️'
}

// CLI интерфейс
async function main() {
  const command = process.argv[2]
  
  switch (command) {
    case 'create-dishes':
      await createDishImages('realistic')
      break
    case 'create-simple':
      await createDishImages('simple')
      break
    case 'create-placeholders':
      await createDishImages('placeholder')
      break
    case 'create-atmosphere':
      await createAtmosphereImages()
      break
    case 'optimize':
      await optimizeAllImages()
      break
    case 'download':
      await downloadRealImages()
      break
    case 'update-paths':
      await updateMenuPaths()
      break
    case 'stats':
      await checkImageStats()
      break
    case 'all':
      await createDishImages('realistic')
      await createAtmosphereImages()
      await optimizeAllImages()
      await updateMenuPaths()
      await checkImageStats()
      break
    default:
      console.log(`
🍽️ Менеджер изображений для ресторана

Использование: node images-manager.mjs <команда>

Команды:
  create-dishes     - Создать реалистичные изображения блюд
  create-simple     - Создать простые изображения блюд
  create-placeholders - Создать заглушки для блюд
  create-atmosphere - Создать изображения атмосферы
  optimize          - Оптимизировать все изображения
  download          - Загрузить реальные изображения
  update-paths      - Обновить пути к изображениям в меню
  stats             - Показать статистику изображений
  all               - Выполнить все операции
      `)
  }
}

// Запуск
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error)
}

export { 
  createDishImages, 
  createAtmosphereImages, 
  optimizeAllImages, 
  downloadRealImages, 
  updateMenuPaths, 
  checkImageStats 
}

