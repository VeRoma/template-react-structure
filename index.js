#!/usr/bin/env node

const path = require('path');
const fs = require('fs-extra');
const { execSync } = require('child_process');

// Получаем аргументы командной строки
const args = process.argv.slice(2);
const appName = args[0];

if (!appName) {
  console.error('Ошибка: Укажите имя проекта');
  process.exit(1); // Выход с ошибкой, если имя не указано
}

// Путь до директории, куда будем копировать файлы
const targetPath = path.resolve(process.cwd(), appName);
const templatePath = path.join(__dirname, 'template');
const packageJsonPath = path.join(templatePath, 'package.json');

// Проверка на существование директории
if (fs.existsSync(targetPath)) {
  console.error(`Ошибка: Директория ${targetPath} уже существует`);
  process.exit(1);
}

// Обновляем поле "name" в package.json
async function updatePackageJson(appName) {
  try {
    const packageJson = await fs.readJson(packageJsonPath);
    packageJson.name = appName; // Устанавливаем имя проекта
    const targetPackageJsonPath = path.join(targetPath, 'package.json');
    
    await fs.writeJson(targetPackageJsonPath, packageJson, { spaces: 2 });
    console.log(`Файл package.json обновлен с именем проекта: ${appName}`);
  } catch (error) {
    console.error('Ошибка при обновлении package.json:', error);
    process.exit(1);
  }
}

// Копируем файлы шаблона
async function createProject() {
  try {
    console.log(`Создание проекта в директории ${targetPath}...`);

    // Копируем файлы в целевую директорию
    await fs.copy(templatePath, targetPath);

    // Обновляем package.json после копирования
    await updatePackageJson(appName);

    console.log('Файлы успешно скопированы.');

    // Переходим в директорию проекта
    process.chdir(targetPath);

    console.log('Устанавливаем зависимости...');
    execSync('npm install', { stdio: 'inherit' });

    console.log('Обновляем зависимости...');
    execSync('npx npm-check-updates --target minor -u', { stdio: 'inherit' });

    console.log('Проект успешно создан с обновлёнными зависимостями');

    // Запуск VS Code в текущей директории
    console.log('Запуск VS Code...');
    execSync('code . --reuse-window', { stdio: 'inherit' });
  } catch (error) {
    console.error('Ошибка:', error);
    process.exit(1);
  }
}

// Основная логика выполнения
(async () => {
  await createProject();
})();