#!/usr/bin/env node

import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

/**
 * Главный менеджер ресторана
 * Объединяет все операции в один удобный интерфейс
 */

/**
 * Выполняет команду с обработкой ошибок
 */
async function runCommand(command, description) {
  try {
    console.log(`\n🔄 ${description}...`)
    const { stdout, stderr } = await execAsync(command)
    if (stdout) console.log(stdout)
    if (stderr) console.log(stderr)
    console.log(`✅ ${description} завершено`)
    return true
  } catch (error) {
    console.error(`❌ Ошибка при ${description.toLowerCase()}:`, error.message)
    return false
  }
}

/**
 * Инициализация проекта
 */
async function initProject() {
  console.log('🚀 Инициализация проекта ресторана...')
  
  const commands = [
    { cmd: 'node scripts/menu-manager.mjs create', desc: 'Создание базового меню' },
    { cmd: 'node scripts/images-manager.mjs create-dishes', desc: 'Создание изображений блюд' },
    { cmd: 'node scripts/images-manager.mjs create-atmosphere', desc: 'Создание изображений атмосферы' },
    { cmd: 'node scripts/optimizer.mjs modern', desc: 'Создание современных форматов' },
    { cmd: 'node scripts/menu-manager.mjs update-images', desc: 'Обновление путей к изображениям' },
    { cmd: 'node scripts/menu-manager.mjs stats', desc: 'Проверка статистики' }
  ]
  
  for (const { cmd, desc } of commands) {
    await runCommand(cmd, desc)
  }
  
  console.log('\n🎉 Инициализация проекта завершена!')
}

/**
 * Полная настройка меню
 */
async function setupMenu() {
  console.log('🍽️ Настройка меню...')
  
  const commands = [
    { cmd: 'node scripts/menu-manager.mjs parse', desc: 'Парсинг меню с сайта' },
    { cmd: 'node scripts/menu-manager.mjs add-categories', desc: 'Добавление категорий' },
    { cmd: 'node scripts/images-manager.mjs create-dishes', desc: 'Создание изображений' },
    { cmd: 'node scripts/optimizer.mjs dishes', desc: 'Оптимизация изображений' },
    { cmd: 'node scripts/menu-manager.mjs update-images', desc: 'Обновление путей' },
    { cmd: 'node scripts/menu-manager.mjs stats', desc: 'Проверка статистики' }
  ]
  
  for (const { cmd, desc } of commands) {
    await runCommand(cmd, desc)
  }
  
  console.log('\n🎉 Настройка меню завершена!')
}

/**
 * Оптимизация изображений
 */
async function optimizeImages() {
  console.log('🖼️ Оптимизация изображений...')
  
  const commands = [
    { cmd: 'node scripts/optimizer.mjs all', desc: 'Оптимизация всех изображений' },
    { cmd: 'node scripts/optimizer.mjs check', desc: 'Проверка качества' }
  ]
  
  for (const { cmd, desc } of commands) {
    await runCommand(cmd, desc)
  }
  
  console.log('\n🎉 Оптимизация завершена!')
}

/**
 * Обновление изображений
 */
async function updateImages() {
  console.log('🔄 Обновление изображений...')
  
  const commands = [
    { cmd: 'node scripts/images-manager.mjs download', desc: 'Загрузка реальных изображений' },
    { cmd: 'node scripts/optimizer.mjs modern', desc: 'Создание современных форматов' },
    { cmd: 'node scripts/menu-manager.mjs update-images', desc: 'Обновление путей' },
    { cmd: 'node scripts/menu-manager.mjs stats', desc: 'Проверка статистики' }
  ]
  
  for (const { cmd, desc } of commands) {
    await runCommand(cmd, desc)
  }
  
  console.log('\n🎉 Обновление изображений завершено!')
}

/**
 * Проверка состояния проекта
 */
async function checkStatus() {
  console.log('📊 Проверка состояния проекта...')
  
  const commands = [
    { cmd: 'node scripts/menu-manager.mjs stats', desc: 'Статистика меню' },
    { cmd: 'node scripts/images-manager.mjs stats', desc: 'Статистика изображений' },
    { cmd: 'node scripts/optimizer.mjs check', desc: 'Качество оптимизации' }
  ]
  
  for (const { cmd, desc } of commands) {
    await runCommand(cmd, desc)
  }
  
  console.log('\n🎉 Проверка состояния завершена!')
}

/**
 * Полная перестройка проекта
 */
async function rebuildProject() {
  console.log('🔨 Полная перестройка проекта...')
  
  const commands = [
    { cmd: 'node scripts/menu-manager.mjs create', desc: 'Создание меню' },
    { cmd: 'node scripts/images-manager.mjs create-dishes', desc: 'Создание изображений блюд' },
    { cmd: 'node scripts/images-manager.mjs create-atmosphere', desc: 'Создание изображений атмосферы' },
    { cmd: 'node scripts/optimizer.mjs full', desc: 'Полная оптимизация' },
    { cmd: 'node scripts/menu-manager.mjs update-images', desc: 'Обновление путей' },
    { cmd: 'node scripts/menu-manager.mjs stats', desc: 'Проверка статистики' }
  ]
  
  for (const { cmd, desc } of commands) {
    await runCommand(cmd, desc)
  }
  
  console.log('\n🎉 Перестройка проекта завершена!')
}

/**
 * Очистка проекта
 */
async function cleanupProject() {
  console.log('🧹 Очистка проекта...')
  
  const commands = [
    { cmd: 'node scripts/optimizer.mjs cleanup', desc: 'Очистка временных файлов' }
  ]
  
  for (const { cmd, desc } of commands) {
    await runCommand(cmd, desc)
  }
  
  console.log('\n🎉 Очистка проекта завершена!')
}

/**
 * Показывает справку
 */
function showHelp() {
  console.log(`
🍽️ Менеджер ресторана - Универсальный инструмент для управления ресторанным проектом

Использование: node restaurant-manager.mjs <команда>

Основные команды:
  init          - Инициализация нового проекта
  setup-menu    - Настройка меню (парсинг + изображения)
  optimize      - Оптимизация изображений
  update-images - Обновление изображений
  check         - Проверка состояния проекта
  rebuild       - Полная перестройка проекта
  cleanup       - Очистка временных файлов

Специализированные команды:
  menu-parse    - Парсинг меню с сайта
  menu-create   - Создание меню из данных
  menu-stats    - Статистика меню
  images-create - Создание изображений
  images-optimize - Оптимизация изображений
  images-stats  - Статистика изображений

Примеры использования:
  node restaurant-manager.mjs init          # Начать новый проект
  node restaurant-manager.mjs setup-menu   # Настроить меню
  node restaurant-manager.mjs check        # Проверить состояние
  node restaurant-manager.mjs rebuild      # Перестроить проект
  `)
}

// CLI интерфейс
async function main() {
  const command = process.argv[2]
  
  switch (command) {
    case 'init':
      await initProject()
      break
    case 'setup-menu':
      await setupMenu()
      break
    case 'optimize':
      await optimizeImages()
      break
    case 'update-images':
      await updateImages()
      break
    case 'check':
      await checkStatus()
      break
    case 'rebuild':
      await rebuildProject()
      break
    case 'cleanup':
      await cleanupProject()
      break
    case 'menu-parse':
      await runCommand('node scripts/menu-manager.mjs parse', 'Парсинг меню')
      break
    case 'menu-create':
      await runCommand('node scripts/menu-manager.mjs create', 'Создание меню')
      break
    case 'menu-stats':
      await runCommand('node scripts/menu-manager.mjs stats', 'Статистика меню')
      break
    case 'images-create':
      await runCommand('node scripts/images-manager.mjs create-dishes', 'Создание изображений')
      break
    case 'images-optimize':
      await runCommand('node scripts/optimizer.mjs all', 'Оптимизация изображений')
      break
    case 'images-stats':
      await runCommand('node scripts/images-manager.mjs stats', 'Статистика изображений')
      break
    default:
      showHelp()
  }
}

// Запуск
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error)
}

export { 
  initProject, 
  setupMenu, 
  optimizeImages, 
  updateImages, 
  checkStatus, 
  rebuildProject, 
  cleanupProject 
}

