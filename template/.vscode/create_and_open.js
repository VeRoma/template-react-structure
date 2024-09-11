const fs = require("fs");
const { exec } = require("child_process");
const path = require("path");

// Функция для капитализации первой буквы
const capitalizeFirstLetter = (string) =>
	string.charAt(0).toUpperCase() + string.slice(1);

const folderName = process.argv[2];
const createCssFile = process.argv.length > 3 && process.argv[3] === "css";
const capitalizedName = capitalizeFirstLetter(folderName);

const componentPath = path.join("src", "components", capitalizedName);

// Создаем директорию и файлы
fs.mkdirSync(componentPath, { recursive: true });

// Шаблон JSX-кода компонента
let componentCode = `
import React from 'react';
${createCssFile ? `import './${capitalizedName}.module.scss';\n` : ""}
const ${capitalizedName} = () => {
    return (
        <div>
            
        </div>
    );
};

export default ${capitalizedName};
`;

// Записываем JSX-файл с содержимым
fs.writeFileSync(
	path.join(componentPath, `${capitalizedName}.jsx`),
	componentCode.trim()
);

// Если указан флаг 'css', создаем SCSS-файл
if (createCssFile) {
	fs.writeFileSync(
		path.join(componentPath, `${capitalizedName}.module.scss`),
		""
	);
}

// Открываем файл в VSCode
exec(
	`code -r "${path.join(componentPath, `${capitalizedName}.jsx`)}"`,
	(err) => {
		if (err) {
			console.error(err);
		}
	}
);
