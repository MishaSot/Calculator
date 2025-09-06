/**
 * Калькулятор с памятью
 * Включает функции: основные арифметические операции, корни, память (M+, M-, MC, MR)
 */

// Глобальные переменные для состояния калькулятора
let currentInput = '0';           // Текущий ввод пользователя
let previousInput = '';           // Предыдущий ввод
let operator = null;              // Текущий оператор
let shouldResetDisplay = false;   // Флаг для сброса дисплея
let memoryValue = 0;              // Значение в памяти калькулятора
const MAX_DISPLAY_LENGTH = 12;    // Максимальная длина отображаемого числа

// Получение элементов DOM
const inputDisplay = document.getElementById('inputDisplay');
const resultDisplay = document.getElementById('resultDisplay');
const memoryIndicator = document.getElementById('memoryIndicator');

/**
 * Обновляет отображение на дисплее калькулятора
 */
function updateDisplay() {
    // Ограничиваем длину отображаемого текста
    const displayText = truncateDisplayText(currentInput);
    inputDisplay.textContent = displayText;
    
    if (previousInput && operator) {
        const prevText = truncateDisplayText(previousInput);
        resultDisplay.textContent = `${prevText} ${operator}`;
    } else {
        resultDisplay.textContent = '';
    }
    
    // Обновляем индикатор памяти
    updateMemoryIndicator();
}

/**
 * Обрезает текст для отображения, если он слишком длинный
 * @param {string} text - Текст для обрезки
 * @returns {string} Обрезанный текст
 */
function truncateDisplayText(text) {
    if (text.length > MAX_DISPLAY_LENGTH) {
        // Если число слишком длинное, показываем в экспоненциальной записи
        const num = parseFloat(text);
        if (!isNaN(num)) {
            return num.toExponential(6);
        }
        // Если это не число, просто обрезаем
        return text.substring(0, MAX_DISPLAY_LENGTH - 3) + '...';
    }
    return text;
}

/**
 * Обновляет индикатор памяти
 */
function updateMemoryIndicator() {
    if (memoryValue !== 0) {
        memoryIndicator.classList.add('visible');
    } else {
        memoryIndicator.classList.remove('visible');
    }
}

/**
 * Добавляет цифру к текущему вводу
 * @param {string} number - Цифра для добавления
 */
function addNumber(number) {
    // Если дисплей должен быть сброшен, начинаем новое число
    if (shouldResetDisplay) {
        currentInput = number;
        shouldResetDisplay = false;
    } else {
        // Проверяем лимит символов
        if (currentInput.length >= MAX_DISPLAY_LENGTH) {
            return; // Не добавляем цифру, если достигнут лимит
        }
        
        // Если текущий ввод "0", заменяем его на новую цифру
        // Иначе добавляем цифру к существующему числу
        currentInput = currentInput === '0' ? number : currentInput + number;
    }
    updateDisplay();
}

/**
 * Добавляет десятичную точку к текущему числу
 */
function addDecimal() {
    if (shouldResetDisplay) {
        currentInput = '0.';
        shouldResetDisplay = false;
    } else if (currentInput.indexOf('.') === -1 && currentInput.length < MAX_DISPLAY_LENGTH) {
        // Добавляем точку только если её ещё нет в числе и не достигнут лимит
        currentInput += '.';
    }
    updateDisplay();
}

/**
 * Добавляет оператор для вычисления
 * @param {string} nextOperator - Оператор (+, -, *, /)
 */
function addOperator(nextOperator) {
    const inputValue = parseFloat(currentInput);
    
    // Если есть предыдущий ввод и оператор, вычисляем результат
    if (previousInput && operator && !shouldResetDisplay) {
        const result = calculateResult();
        currentInput = String(result);
        previousInput = String(result);
    } else {
        previousInput = currentInput;
    }
    
    operator = nextOperator;
    shouldResetDisplay = true;
    updateDisplay();
}

/**
 * Выполняет вычисление результата
 * @returns {number} Результат вычисления
 */
function calculateResult() {
    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);
    
    if (isNaN(prev) || isNaN(current)) return current;
    
    switch (operator) {
        case '+':
            return prev + current;
        case '-':
            return prev - current;
        case '*':
            return prev * current;
        case '/':
            return current !== 0 ? prev / current : 0;
        default:
            return current;
    }
}

/**
 * Выполняет вычисление и отображает результат
 */
function calculate() {
    if (previousInput && operator && !shouldResetDisplay) {
        const result = calculateResult();
        currentInput = String(result);
        previousInput = '';
        operator = null;
        shouldResetDisplay = true;
        updateDisplay();
    }
}

/**
 * Вычисляет квадратный корень из текущего числа
 */
function calculateSquareRoot() {
    const number = parseFloat(currentInput);
    
    if (number < 0) {
        // Обработка ошибки для отрицательных чисел
        currentInput = 'Ошибка';
        shouldResetDisplay = true;
        updateDisplay();
        return;
    }
    
    if (number >= 0) {
        const result = Math.sqrt(number);
        currentInput = String(formatNumber(result));
        shouldResetDisplay = true;
        updateDisplay();
    }
}

/**
 * Форматирует число для отображения (убирает лишние нули)
 * @param {number} num - Число для форматирования
 * @returns {string} Отформатированное число
 */
function formatNumber(num) {
    if (Number.isInteger(num)) {
        return num.toString();
    } else {
        // Ограничиваем количество знаков после запятой и общую длину
        let formatted = parseFloat(num.toFixed(10)).toString();
        
        // Если число слишком длинное, используем экспоненциальную запись
        if (formatted.length > MAX_DISPLAY_LENGTH) {
            return num.toExponential(6);
        }
        
        return formatted;
    }
}

/**
 * Очищает весь калькулятор
 */
function clearAll() {
    currentInput = '0';
    previousInput = '';
    operator = null;
    shouldResetDisplay = false;
    updateDisplay();
}

/**
 * Очищает текущий ввод
 */
function clearEntry() {
    currentInput = '0';
    updateDisplay();
}

/**
 * Удаляет последний символ из текущего ввода
 */
function deleteLast() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}

/**
 * Очищает память калькулятора (Memory Clear)
 */
function memoryClear() {
    memoryValue = 0;
    updateMemoryIndicator();
}

/**
 * Восстанавливает значение из памяти (Memory Recall)
 */
function memoryRecall() {
    if (memoryValue !== 0) {
        currentInput = String(formatNumber(memoryValue));
        shouldResetDisplay = true;
        updateDisplay();
    }
}

/**
 * Добавляет текущее значение к памяти (Memory Add)
 */
function memoryAdd() {
    const currentValue = parseFloat(currentInput);
    if (!isNaN(currentValue)) {
        memoryValue += currentValue;
        updateMemoryIndicator();
    }
}

/**
 * Вычитает текущее значение из памяти (Memory Subtract)
 */
function memorySubtract() {
    const currentValue = parseFloat(currentInput);
    if (!isNaN(currentValue)) {
        memoryValue -= currentValue;
        updateMemoryIndicator();
    }
}

/**
 * Обработка нажатий клавиш на клавиатуре
 * @param {KeyboardEvent} event - Событие нажатия клавиши
 */
function handleKeyPress(event) {
    const key = event.key;
    
    // Предотвращаем стандартное поведение для обрабатываемых клавиш
    if ('0123456789+-*/.='.includes(key) || key === 'Enter' || key === 'Escape' || key === 'Backspace') {
        event.preventDefault();
    }
    
    // Обработка различных клавиш
    if ('0123456789'.includes(key)) {
        addNumber(key);
    } else if (key === '.') {
        addDecimal();
    } else if ('+-*/'.includes(key)) {
        addOperator(key);
    } else if (key === '=' || key === 'Enter') {
        calculate();
    } else if (key === 'Escape') {
        clearAll();
    } else if (key === 'Backspace') {
        deleteLast();
    }
}

// Инициализация калькулятора при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Обновляем дисплей
    updateDisplay();
    
    // Добавляем обработчик клавиатуры
    document.addEventListener('keydown', handleKeyPress);
    
    console.log('Калькулятор с памятью инициализирован успешно');
});

// Дополнительные утилиты для отладки (можно удалить в продакшене)
window.calculatorDebug = {
    getCurrentState: () => ({
        currentInput,
        previousInput,
        operator,
        shouldResetDisplay,
        memoryValue
    }),
    clearAllData: () => {
        clearAll();
        memoryClear();
    }
};
