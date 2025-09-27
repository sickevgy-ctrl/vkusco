import { defineEventHandler } from 'h3'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export default defineEventHandler(async (event) => {
  try {
    console.log('Запускаем обновление меню...')
    
    // Запускаем скрипт парсинга
    const { stdout, stderr } = await execAsync('node scripts/parse-menu-simple.mjs')
    
    if (stderr) {
      console.error('Ошибка при выполнении скрипта:', stderr)
      return {
        success: false,
        message: 'Ошибка при обновлении меню',
        error: stderr
      }
    }
    
    console.log('Скрипт выполнен:', stdout)
    
    return {
      success: true,
      message: 'Меню успешно обновлено',
      timestamp: new Date().toISOString()
    }
    
  } catch (error) {
    console.error('Ошибка при обновлении меню:', error)
    
    return {
      success: false,
      message: 'Ошибка при обновлении меню',
      error: error.message
    }
  }
})
