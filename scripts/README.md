#  Скрипты ресторана

Этот набор скриптов был оптимизирован и объединен для удобства использования. Вместо 18 отдельных скриптов теперь есть 4 универсальных менеджера.

## Структура скриптов

### Основные менеджеры

1. **`restaurant-manager.mjs`** - Главный менеджер для всех операций
2. **`menu-manager.mjs`** - Управление меню ресторана
3. **`images-manager.mjs`** - Управление изображениями
4. **`optimizer.mjs`** - Оптимизация изображений

## Быстрый старт

### Инициализация нового проекта
```bash
npm run restaurant:init
```

### Настройка меню
```bash
npm run restaurant:setup
```

### Проверка состояния
```bash
npm run restaurant:check
```

## Команды по категориям

### Главные команды ресторана
```bash
npm run restaurant:init          # Инициализация проекта
npm run restaurant:setup         # Настройка меню
npm run restaurant:optimize      # Оптимизация изображений
npm run restaurant:update       # Обновление изображений
npm run restaurant:check         # Проверка состояния
npm run restaurant:rebuild      # Полная перестройка
npm run restaurant:cleanup      # Очистка временных файлов
```

### Управление меню
```bash
npm run menu:parse              # Парсинг меню с сайта
npm run menu:create             # Создание меню из данных
npm run menu:add-categories     # Добавление категорий
npm run menu:update-images      # Обновление путей к изображениям
npm run menu:stats              # Статистика меню
```

### Управление изображениями
```bash
npm run images:create-dishes        # Создание изображений блюд
npm run images:create-simple        # Создание простых изображений
npm run images:create-placeholders # Создание заглушек
npm run images:create-atmosphere    # Создание изображений атмосферы
npm run images:optimize             # Оптимизация изображений
npm run images:download            # Загрузка реальных изображений
npm run images:update-paths         # Обновление путей
npm run images:stats                # Статистика изображений
```

### Оптимизация
```bash
npm run optimize:all           # Оптимизация всех изображений
npm run optimize:dishes        # Оптимизация изображений блюд
npm run optimize:modern        # Создание современных форматов
npm run optimize:check         # Проверка качества оптимизации
npm run optimize:cleanup       # Очистка временных файлов
npm run optimize:full          # Полная оптимизация
```

## Прямое использование скриптов

### Главный менеджер
```bash
node scripts/restaurant-manager.mjs init
node scripts/restaurant-manager.mjs setup-menu
node scripts/restaurant-manager.mjs optimize
node scripts/restaurant-manager.mjs check
node scripts/restaurant-manager.mjs rebuild
```

### Менеджер меню
```bash
node scripts/menu-manager.mjs parse
node scripts/menu-manager.mjs create
node scripts/menu-manager.mjs add-categories
node scripts/menu-manager.mjs update-images
node scripts/menu-manager.mjs stats
```

### Менеджер изображений
```bash
node scripts/images-manager.mjs create-dishes
node scripts/images-manager.mjs create-atmosphere
node scripts/images-manager.mjs optimize
node scripts/images-manager.mjs download
node scripts/images-manager.mjs stats
```

### Оптимизатор
```bash
node scripts/optimizer.mjs all
node scripts/optimizer.mjs dishes
node scripts/optimizer.mjs modern
node scripts/optimizer.mjs check
node scripts/optimizer.mjs full
```

### 4 менеджера:
- `restaurant-manager.mjs` - Главный менеджер
- `menu-manager.mjs` - Управление меню
- `images-manager.mjs` - Управление изображениями
- `optimizer.mjs` - Оптимизация


##  Примеры использования

### Полная настройка проекта
```bash
# 1. Инициализация
npm run restaurant:init

# 2. Настройка меню
npm run restaurant:setup

# 3. Проверка состояния
npm run restaurant:check
```

### Обновление изображений
```bash
# 1. Загрузка новых изображений
npm run images:download

# 2. Оптимизация
npm run optimize:all

# 3. Обновление путей
npm run menu:update-images

# 4. Проверка
npm run restaurant:check
```

### Работа с меню
```bash
# 1. Парсинг с сайта
npm run menu:parse

# 2. Добавление категорий
npm run menu:add-categories

# 3. Создание изображений
npm run images:create-dishes

# 4. Обновление путей
npm run menu:update-images

# 5. Статистика
npm run menu:stats
```

##  Технические детали

### Зависимости
- `sharp` - для оптимизации изображений
- `jsdom` - для парсинга HTML
- `fs/promises` - для работы с файлами
- `path` - для работы с путями

### Поддерживаемые форматы
- **Входные**: JPG, JPEG, PNG, TIFF, BMP
- **Выходные**: JPG, WebP, AVIF, SVG

### Качество сжатия
- **JPEG**: 85%
- **WebP**: 80%
- **AVIF**: 75%
- **PNG**: 90%




