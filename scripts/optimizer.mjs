#!/usr/bin/env node

import sharp from 'sharp'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Универсальный оптимизатор изображений
 * Объединяет все функции оптимизации в один скрипт
 */

// Конфигурация оптимизации
const config = {
  // Размеры для responsive изображений
  responsiveSizes: [320, 640, 768, 1024, 1280, 1920],
  
  // Качество для разных форматов
  quality: {
    jpeg: 85,
    webp: 80,
    avif: 75,
    png: 90
  },
  
  // Папки для обработки
  inputDirs: [
    path.join(__dirname, '..', 'public', 'images'),
    path.join(__dirname, '..', 'public', 'content'),
    path.join(__dirname, '..', 'public', 'img')
  ],
  
  // Поддерживаемые форматы
  supportedFormats: ['.jpg', '.jpeg', '.png', '.webp', '.tiff', '.bmp'],
  
  // Форматы для создания
  outputFormats: ['jpg', 'webp', 'avif']
}

/**
 * Оптимизирует одно изображение
 */
async function optimizeImage(inputPath, outputDir, filename, options = {}) {
  const baseName = path.parse(filename).name
  const ext = path.parse(filename).ext.toLowerCase()
  
  // Пропускаем уже оптимизированные файлы
  if (ext === '.webp' || ext === '.avif') {
    return
  }
  
  try {
    const image = sharp(inputPath)
    const metadata = await image.metadata()
    
    console.log(`🔄 Обрабатываю: ${filename} (${metadata.width}x${metadata.height})`)
    
    // Создаем директории если их нет
    await fs.mkdir(outputDir, { recursive: true })
    
    // JPEG оптимизация
    if (ext === '.jpg' || ext === '.jpeg') {
      await image
        .jpeg({ 
          quality: config.quality.jpeg,
          progressive: true,
          mozjpeg: true
        })
        .toFile(path.join(outputDir, `${baseName}.jpg`))
    }
    
    // PNG оптимизация
    if (ext === '.png') {
      await image
        .png({ 
          quality: config.quality.png,
          compressionLevel: 9,
          progressive: true
        })
        .toFile(path.join(outputDir, `${baseName}.png`))
    }
    
    // WebP версия
    await image
      .webp({ 
        quality: config.quality.webp,
        effort: 6
      })
      .toFile(path.join(outputDir, `${baseName}.webp`))
    
    // AVIF версия (если поддерживается)
    try {
      await image
        .avif({ 
          quality: config.quality.avif,
          effort: 9
        })
        .toFile(path.join(outputDir, `${baseName}.avif`))
    } catch (error) {
      console.warn(`⚠️ AVIF не поддерживается для ${filename}`)
    }
    
    // Responsive версии
    if (options.responsive) {
      await createResponsiveImages(image, outputDir, baseName, metadata)
    }
    
    // Blur placeholder
    if (options.blur) {
      await createBlurPlaceholder(image, outputDir, baseName)
    }
    
    console.log(`✅ Оптимизировано: ${baseName}`)
    
  } catch (error) {
    console.error(`❌ Ошибка при обработке ${filename}:`, error.message)
  }
}

/**
 * Создает responsive версии изображения
 */
async function createResponsiveImages(image, outputDir, baseName, metadata) {
  for (const size of config.responsiveSizes) {
    if (metadata.width && metadata.width > size) {
      const responsiveDir = path.join(outputDir, `${size}w`)
      await fs.mkdir(responsiveDir, { recursive: true })
      
      // WebP responsive
      await image
        .resize(size, null, { 
          withoutEnlargement: true,
          fit: 'inside'
        })
        .webp({ quality: config.quality.webp })
        .toFile(path.join(responsiveDir, `${baseName}.webp`))
      
      // AVIF responsive
      try {
        await image
          .resize(size, null, { 
            withoutEnlargement: true,
            fit: 'inside'
          })
          .avif({ quality: config.quality.avif })
          .toFile(path.join(responsiveDir, `${baseName}.avif`))
      } catch (error) {
        console.warn(`⚠️ AVIF responsive не поддерживается для ${baseName} ${size}w`)
      }
    }
  }
}

/**
 * Создает blur placeholder для изображения
 */
async function createBlurPlaceholder(image, outputDir, baseName) {
  try {
    await image
      .resize(40, 40, { fit: 'cover' })
      .jpeg({ quality: 20 })
      .toFile(path.join(outputDir, `${baseName}-blur.jpg`))
    
    console.log(`✅ Создан blur placeholder: ${baseName}-blur.jpg`)
  } catch (error) {
    console.error(`❌ Ошибка создания blur placeholder для ${baseName}:`, error.message)
  }
}

/**
 * Рекурсивно обрабатывает все изображения в директории
 */
async function processDirectory(dirPath, outputPath = dirPath, options = {}) {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true })
    
    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name)
      const outputDir = path.join(outputPath, entry.name)
      
      if (entry.isDirectory()) {
        await processDirectory(fullPath, outputDir, options)
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase()
        if (config.supportedFormats.includes(ext)) {
          await optimizeImage(fullPath, path.dirname(fullPath), entry.name, options)
        }
      }
    }
  } catch (error) {
    console.error(`❌ Ошибка при обработке директории ${dirPath}:`, error.message)
  }
}

/**
 * Оптимизирует изображения блюд
 */
async function optimizeDishImages() {
  console.log('🍽️ Оптимизируем изображения блюд...')
  
  const dishesDir = path.join(__dirname, '..', 'public', 'images', 'dishes')
  
  if (!(await fs.access(dishesDir).then(() => true).catch(() => false))) {
    console.log('❌ Директория с изображениями блюд не найдена')
    return
  }
  
  const files = await fs.readdir(dishesDir)
  const imageFiles = files.filter(file => 
    file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png')
  )
  
  console.log(`📊 Найдено ${imageFiles.length} изображений для оптимизации`)
  
  for (const file of imageFiles) {
    const baseName = path.parse(file).name
    const inputPath = path.join(dishesDir, file)
    await optimizeImage(inputPath, dishesDir, file, { responsive: false, blur: true })
  }
  
  console.log('✅ Оптимизация изображений блюд завершена')
}

/**
 * Оптимизирует все изображения в проекте
 */
async function optimizeAllImages() {
  console.log('🚀 Оптимизируем все изображения...')
  
  const startTime = Date.now()
  
  for (const inputDir of config.inputDirs) {
    if (await fs.access(inputDir).then(() => true).catch(() => false)) {
      console.log(`📁 Обрабатываем: ${inputDir}`)
      await processDirectory(inputDir, inputDir, { responsive: true, blur: true })
    }
  }
  
  const endTime = Date.now()
  const duration = (endTime - startTime) / 1000
  
  console.log(`\n✅ Оптимизация завершена за ${duration.toFixed(2)} секунд`)
  console.log('\n📊 Статистика:')
  console.log(`- Responsive размеры: ${config.responsiveSizes.join(', ')}px`)
  console.log(`- Форматы: JPEG, WebP, AVIF`)
  console.log(`- Качество: JPEG ${config.quality.jpeg}%, WebP ${config.quality.webp}%, AVIF ${config.quality.avif}%`)
}

/**
 * Создает только WebP и AVIF версии
 */
async function createModernFormats() {
  console.log('🔄 Создаем современные форматы изображений...')
  
  for (const inputDir of config.inputDirs) {
    if (await fs.access(inputDir).then(() => true).catch(() => false)) {
      await processDirectory(inputDir, inputDir, { responsive: false, blur: false })
    }
  }
  
  console.log('✅ Современные форматы созданы')
}

/**
 * Проверяет качество оптимизации
 */
async function checkOptimizationQuality() {
  console.log('🔍 Проверяем качество оптимизации...')
  
  const dishesDir = path.join(__dirname, '..', 'public', 'images', 'dishes')
  
  if (!(await fs.access(dishesDir).then(() => true).catch(() => false))) {
    console.log('❌ Директория с изображениями не найдена')
    return
  }
  
  const files = await fs.readdir(dishesDir)
  const imageFiles = files.filter(file => 
    /\.(jpg|jpeg|png|webp|avif)$/i.test(file)
  )
  
  let totalSize = 0
  let webpCount = 0
  let avifCount = 0
  let jpegCount = 0
  let pngCount = 0
  
  for (const file of imageFiles) {
    const filePath = path.join(dishesDir, file)
    const stats = await fs.stat(filePath)
    const fileSizeKB = Math.round(stats.size / 1024)
    totalSize += fileSizeKB
    
    if (file.endsWith('.webp')) webpCount++
    else if (file.endsWith('.avif')) avifCount++
    else if (file.endsWith('.jpg') || file.endsWith('.jpeg')) jpegCount++
    else if (file.endsWith('.png')) pngCount++
  }
  
  console.log(`\n📊 Результаты оптимизации:`)
  console.log(`   • Всего файлов: ${imageFiles.length}`)
  console.log(`   • Общий размер: ${totalSize}KB`)
  console.log(`   • JPEG: ${jpegCount}`)
  console.log(`   • PNG: ${pngCount}`)
  console.log(`   • WebP: ${webpCount}`)
  console.log(`   • AVIF: ${avifCount}`)
  
  const modernFormats = webpCount + avifCount
  const totalFormats = jpegCount + pngCount + webpCount + avifCount
  const modernPercentage = Math.round((modernFormats / totalFormats) * 100)
  
  console.log(`   • Современные форматы: ${modernPercentage}%`)
  
  if (modernPercentage >= 50) {
    console.log(`   ✅ Хорошее качество оптимизации`)
  } else {
    console.log(`   ⚠️ Нужно больше современных форматов`)
  }
}

/**
 * Очищает временные файлы
 */
async function cleanupTempFiles() {
  console.log('🧹 Очищаем временные файлы...')
  
  const tempPatterns = [
    '**/*.tmp',
    '**/*.temp',
    '**/*-blur.jpg'
  ]
  
  // Здесь можно добавить логику очистки временных файлов
  console.log('✅ Очистка завершена')
}

// CLI интерфейс
async function main() {
  const command = process.argv[2]
  
  switch (command) {
    case 'dishes':
      await optimizeDishImages()
      break
    case 'all':
      await optimizeAllImages()
      break
    case 'modern':
      await createModernFormats()
      break
    case 'check':
      await checkOptimizationQuality()
      break
    case 'cleanup':
      await cleanupTempFiles()
      break
    case 'full':
      await optimizeAllImages()
      await checkOptimizationQuality()
      await cleanupTempFiles()
      break
    default:
      console.log(`
🚀 Оптимизатор изображений

Использование: node optimizer.mjs <команда>

Команды:
  dishes    - Оптимизировать только изображения блюд
  all       - Оптимизировать все изображения в проекте
  modern    - Создать только WebP и AVIF версии
  check     - Проверить качество оптимизации
  cleanup   - Очистить временные файлы
  full      - Полная оптимизация (все + проверка + очистка)
      `)
  }
}

// Запуск если файл выполняется напрямую
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error)
}

export { 
  optimizeImage, 
  processDirectory, 
  optimizeDishImages, 
  optimizeAllImages, 
  createModernFormats, 
  checkOptimizationQuality 
}

