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

// Проверяем, установлен ли degit
function installDegit() {
  try {
    execSync('npx degit --help', { stdio: 'inherit' });
  } catch (e) {
    console.log('Устанавливаем degit...');
    execSync('npm install degit --global', { stdio: 'inherit' });
  }
}

// Обновляем поле "name" в package.json
async function updatePackageJson(appName) {
  try {
    const packageJson = await fs.readJson(packageJsonPath);
    packageJson.name = appName; // Устанавливаем имя проекта
    await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
    console.log(`Файл package.json обновлен с именем проекта: ${appName}`);
  } catch (error) {
    console.error('Ошибка при обновлении package.json:', error);
  }
}

// Копируем файлы шаблона
async function createProject() {
  try {
    console.log(`Создание проекта в директории ${targetPath}...`);

    // Обновляем package.json перед копированием
    await updatePackageJson(appName);

    // Копируем файлы в целевую директорию
    await fs.copy(templatePath, targetPath);

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
  }
}

// Основная логика выполнения
(async () => {
  installDegit();
  await createProject();
})();
