const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

// Функция для капитализации первой буквы
const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

const folderName = process.argv[2];
const createCssFile = process.argv.length > 3 && process.argv[3] === 'css';
const capitalizedName = capitalizeFirstLetter(folderName);

const componentPath = path.join('src', 'components', capitalizedName);

// Создаем директорию и файлы
fs.mkdirSync(componentPath, { recursive: true });
fs.writeFileSync(path.join(componentPath, `${capitalizedName}.jsx`), '');
if (createCssFile) {
    fs.writeFileSync(path.join(componentPath, `${capitalizedName}.module.scss`), '');
}

// Открываем файл в VSCode
exec(`code -r "${path.join(componentPath, `${capitalizedName}.jsx`)}"`, (err) => {
    if (err) {
        console.error(err);
    }
});