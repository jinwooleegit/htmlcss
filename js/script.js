// ===== WEBLEARN JAVASCRIPT FUNCTIONALITY =====

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
    initMobileNavigation();
    initProgressTracking();
    initAdvancedPracticeEditor();
    initAdvancedQuizSystem();
    initScrollAnimations();
    initThemeToggle();
    initSearchFunction();
    initBookmarkSystem();
    initDeploymentTabs();
    initSecurityChecklist();
    initCostCalculator();
});

// Initialize Website Functions
function initializeWebsite() {
    initMobileNavigation();
    initProgressTracking();
    initAdvancedPracticeEditor();
    initAdvancedQuizSystem();
    initScrollAnimations();
    initThemeToggle();
    initSearchFunction();
    initBookmarkSystem();
}

// ===== MOBILE NAVIGATION =====
function initMobileNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// ===== PROGRESS TRACKING =====
function initProgressTracking() {
    // Update progress bars based on local storage
    updateProgressBars();
    
    // Track tutorial section completion
    trackTutorialProgress();
}

function updateProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    const savedProgress = JSON.parse(localStorage.getItem('weblearn-progress') || '{}');
    
    progressBars.forEach(bar => {
        const skill = bar.dataset.skill;
        if (skill && savedProgress[skill]) {
            bar.style.width = savedProgress[skill] + '%';
            const percentageText = bar.parentElement.nextElementSibling;
            if (percentageText) {
                percentageText.textContent = savedProgress[skill] + '%';
            }
        }
    });
}

function trackTutorialProgress() {
    const tutorialLinks = document.querySelectorAll('.tutorial-link');
    
    tutorialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Mark as active
            tutorialLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Smooth scroll to section
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
            
            // Update progress
            updateLearningProgress();
        });
    });
}

function updateLearningProgress() {
    const currentPage = window.location.pathname;
    const completedSections = document.querySelectorAll('.tutorial-link.active').length;
    const totalSections = document.querySelectorAll('.tutorial-link').length;
    
    if (totalSections > 0) {
        const progress = Math.round((completedSections / totalSections) * 100);
        const progressBar = document.querySelector('.progress-fill');
        const progressText = document.querySelector('.progress-text');
        
        if (progressBar) {
            progressBar.style.width = progress + '%';
        }
        if (progressText) {
            progressText.textContent = progress + '% 완료';
        }
        
        // Save to localStorage
        let savedProgress = JSON.parse(localStorage.getItem('weblearn-progress') || '{}');
        
        if (currentPage.includes('html-tutorial')) {
            savedProgress.html = progress;
        } else if (currentPage.includes('css-tutorial')) {
            savedProgress.css = progress;
        } else if (currentPage.includes('js-tutorial')) {
            savedProgress.javascript = progress;
        }
        
        // Calculate overall progress
        const skills = ['html', 'css', 'javascript'];
        const totalProgress = skills.reduce((sum, skill) => sum + (savedProgress[skill] || 0), 0);
        savedProgress.overall = Math.round(totalProgress / skills.length);
        
        localStorage.setItem('weblearn-progress', JSON.stringify(savedProgress));
    }
}

// ===== ADVANCED PRACTICE EDITOR =====
function initAdvancedPracticeEditor() {
    const runButton = document.getElementById('run-code');
    const clearButton = document.getElementById('clear-code');
    const saveButton = document.getElementById('save-code');
    const exampleSelect = document.getElementById('example-select');
    
    if (runButton) {
        runButton.addEventListener('click', runCode);
    }
    
    if (clearButton) {
        clearButton.addEventListener('click', clearCode);
    }
    
    if (saveButton) {
        saveButton.addEventListener('click', saveCode);
    }
    
    if (exampleSelect) {
        exampleSelect.addEventListener('change', loadExample);
    }
    
    // Load saved code from localStorage
    loadSavedCode();
}

function runCode() {
    const htmlCode = document.getElementById('html-editor')?.value || '';
    const cssCode = document.getElementById('css-editor')?.value || '';
    const jsCode = document.getElementById('js-editor')?.value || '';
    const previewFrame = document.getElementById('preview-frame');
    
    if (previewFrame) {
        const combinedCode = `
            <!DOCTYPE html>
            <html lang="ko">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>${cssCode}</style>
            </head>
            <body>
                ${htmlCode}
                <script>
                    try {
                        ${jsCode}
                    } catch (error) {
                        console.error('JavaScript Error:', error);
                        parent.postMessage({type: 'error', message: error.message}, '*');
                    }
                </script>
            </body>
            </html>
        `;
        
        previewFrame.src = 'data:text/html;charset=utf-8,' + encodeURIComponent(combinedCode);
        
        // Log success message
        logToConsole('코드가 성공적으로 실행되었습니다!', 'info');
    }
}

function clearCode() {
    const editors = ['html-editor', 'css-editor', 'js-editor'];
    
    editors.forEach(editorId => {
        const editor = document.getElementById(editorId);
        if (editor) {
            editor.value = '';
        }
    });
    
    // Clear preview
    const previewFrame = document.getElementById('preview-frame');
    if (previewFrame) {
        previewFrame.src = 'about:blank';
    }
    
    // Clear console
    clearConsole();
    
    logToConsole('코드가 초기화되었습니다.', 'info');
}

function saveCode() {
    const htmlCode = document.getElementById('html-editor')?.value || '';
    const cssCode = document.getElementById('css-editor')?.value || '';
    const jsCode = document.getElementById('js-editor')?.value || '';
    
    const codeData = {
        html: htmlCode,
        css: cssCode,
        javascript: jsCode,
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('weblearn-saved-code', JSON.stringify(codeData));
    logToConsole('코드가 저장되었습니다!', 'info');
}

function loadSavedCode() {
    const savedCode = localStorage.getItem('weblearn-saved-code');
    
    if (savedCode) {
        try {
            const codeData = JSON.parse(savedCode);
            
            const htmlEditor = document.getElementById('html-editor');
            const cssEditor = document.getElementById('css-editor');
            const jsEditor = document.getElementById('js-editor');
            
            if (htmlEditor && codeData.html) htmlEditor.value = codeData.html;
            if (cssEditor && codeData.css) cssEditor.value = codeData.css;
            if (jsEditor && codeData.javascript) jsEditor.value = codeData.javascript;
            
        } catch (error) {
            console.error('Error loading saved code:', error);
        }
    }
}

function loadExample() {
    const exampleSelect = document.getElementById('example-select');
    const selectedExample = exampleSelect?.value;
    
    const examples = {
        'basic': {
            html: `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>기본 HTML 페이지</title>
</head>
<body>
    <h1>안녕하세요!</h1>
    <p>이것은 기본 HTML 구조입니다.</p>
    <button onclick="greet()">인사하기</button>
</body>
</html>`,
            css: `body {
    font-family: Arial, sans-serif;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f5f5f5;
}

h1 {
    color: #333;
    text-align: center;
}

button {
    background-color: #007bff;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
}`,
            javascript: `function greet() {
    alert('안녕하세요! WebLearn에 오신 것을 환영합니다!');
}

console.log('페이지가 로드되었습니다!');`
        },
        'css-styling': {
            html: `<div class="card">
    <h2>CSS 스타일링 예제</h2>
    <p>이 카드는 CSS로 스타일링되었습니다.</p>
    <div class="buttons">
        <button class="btn-primary">Primary</button>
        <button class="btn-secondary">Secondary</button>
    </div>
</div>`,
            css: `.card {
    background: white;
    border-radius: 10px;
    padding: 30px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    max-width: 400px;
    margin: 50px auto;
    text-align: center;
}

.card h2 {
    color: #333;
    margin-bottom: 15px;
}

.card p {
    color: #666;
    margin-bottom: 25px;
}

.buttons {
    display: flex;
    gap: 10px;
    justify-content: center;
}

button {
    padding: 12px 24px;
    border: none;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-primary {
    background-color: #007bff;
    color: white;
}

.btn-primary:hover {
    background-color: #0056b3;
    transform: translateY(-2px);
}

.btn-secondary {
    background-color: #6c757d;
    color: white;
}

.btn-secondary:hover {
    background-color: #545b62;
    transform: translateY(-2px);
}`,
            javascript: `// 버튼 클릭 이벤트 추가
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('button');
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            console.log(this.textContent + ' 버튼이 클릭되었습니다!');
        });
    });
});`
        }
    };
    
    if (selectedExample && examples[selectedExample]) {
        const example = examples[selectedExample];
        
        const htmlEditor = document.getElementById('html-editor');
        const cssEditor = document.getElementById('css-editor');
        const jsEditor = document.getElementById('js-editor');
        
        if (htmlEditor) htmlEditor.value = example.html;
        if (cssEditor) cssEditor.value = example.css;
        if (jsEditor) jsEditor.value = example.javascript;
        
        logToConsole(`${selectedExample} 예제가 로드되었습니다.`, 'info');
    }
}

// ===== CONSOLE FUNCTIONALITY =====
function logToConsole(message, type = 'info') {
    const consoleOutput = document.getElementById('console-output');
    if (!consoleOutput) return;
    
    const messageElement = document.createElement('div');
    messageElement.className = `console-message ${type}`;
    
    const timeElement = document.createElement('span');
    timeElement.className = 'console-time';
    timeElement.textContent = `[${new Date().toLocaleTimeString()}]`;
    
    const textElement = document.createElement('span');
    textElement.className = 'console-text';
    textElement.textContent = message;
    
    messageElement.appendChild(timeElement);
    messageElement.appendChild(textElement);
    
    consoleOutput.appendChild(messageElement);
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

function clearConsole() {
    const consoleOutput = document.getElementById('console-output');
    if (consoleOutput) {
        consoleOutput.innerHTML = '';
        logToConsole('콘솔이 초기화되었습니다.', 'info');
    }
}

// Listen for messages from iframe
window.addEventListener('message', function(event) {
    if (event.data.type === 'error') {
        logToConsole('JavaScript Error: ' + event.data.message, 'error');
    }
});

// ===== QUIZ SYSTEM =====
function initQuizSystem() {
    // Quiz functionality will be implemented here
    const quizCategories = document.querySelectorAll('.quiz-category');
    
    quizCategories.forEach(category => {
        const button = category.querySelector('button');
        if (button) {
            button.addEventListener('click', function() {
                const categoryType = category.dataset.category;
                logToConsole(`${categoryType} 퀴즈를 시작합니다!`, 'info');
            });
        }
    });
}

function startQuiz(category) {
    logToConsole(`${category} 퀴즈가 시작되었습니다!`, 'info');
    // Quiz implementation will be added in phase 3
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate
    const animateElements = document.querySelectorAll('.step, .feature, .quiz-category');
    animateElements.forEach(el => observer.observe(el));
}

// ===== THEME TOGGLE =====
function initThemeToggle() {
    // Check for saved theme preference or default to 'light'
    const currentTheme = localStorage.getItem('weblearn-theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Create theme toggle button (if not exists)
    createThemeToggle();
}

function createThemeToggle() {
    const existingToggle = document.querySelector('.theme-toggle');
    if (existingToggle) return;
    
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = '🌙';
    themeToggle.setAttribute('aria-label', 'Toggle dark mode');
    
    themeToggle.addEventListener('click', toggleTheme);
    
    // Add to navigation
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
        const li = document.createElement('li');
        li.className = 'nav-item';
        li.appendChild(themeToggle);
        navMenu.appendChild(li);
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('weblearn-theme', newTheme);
    
    // Update toggle button
    const toggleButton = document.querySelector('.theme-toggle');
    if (toggleButton) {
        toggleButton.innerHTML = newTheme === 'dark' ? '☀️' : '🌙';
    }
}

// ===== UTILITY FUNCTIONS =====
function smoothScrollTo(targetId) {
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
        targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// ===== GLOBAL FUNCTIONS =====
// Functions that can be called from HTML onclick attributes

function restartQuiz() {
    window.location.reload();
}

function goToHome() {
    window.location.href = 'index.html';
}

function shareResults() {
    if (navigator.share) {
        navigator.share({
            title: 'WebLearn 퀴즈 결과',
            text: '방금 WebLearn에서 퀴즈를 완료했습니다!',
            url: window.location.href
        });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(window.location.href).then(() => {
            showNotification('링크가 클립보드에 복사되었습니다!', 'success');
        });
    }
}

// ===== ERROR HANDLING =====
window.addEventListener('error', function(event) {
    console.error('Global error:', event.error);
    logToConsole('오류가 발생했습니다: ' + event.error.message, 'error');
});

// ===== PERFORMANCE MONITORING =====
window.addEventListener('load', function() {
    const loadTime = performance.now();
    console.log(`페이지 로드 시간: ${Math.round(loadTime)}ms`);
});

// ===== ADVANCED QUIZ SYSTEM =====
function initAdvancedQuizSystem() {
    // Initialize quiz data
    loadQuizData();
    setupQuizEventListeners();
}

const quizData = {
    html: [
        {
            question: "HTML의 기본 구조에서 문서의 제목을 설정하는 태그는?",
            options: ["<title>", "<head>", "<header>", "<h1>"],
            correct: 0,
            explanation: "<title> 태그는 브라우저 탭에 표시되는 문서의 제목을 설정합니다."
        },
        {
            question: "HTML에서 링크를 만드는 태그는?",
            options: ["<link>", "<a>", "<href>", "<url>"],
            correct: 1,
            explanation: "<a> 태그의 href 속성을 사용하여 링크를 만듭니다."
        },
        {
            question: "HTML 문서의 기본 구조에서 콘텐츠가 들어가는 태그는?",
            options: ["<html>", "<head>", "<body>", "<main>"],
            correct: 2,
            explanation: "<body> 태그 안에 사용자에게 보여질 모든 콘텐츠가 들어갑니다."
        }
    ],
    css: [
        {
            question: "CSS에서 요소의 배경색을 설정하는 속성은?",
            options: ["color", "background-color", "bg-color", "background"],
            correct: 1,
            explanation: "background-color 속성으로 요소의 배경색을 설정합니다."
        },
        {
            question: "CSS에서 텍스트를 가운데 정렬하는 속성값은?",
            options: ["text-align: middle", "text-align: center", "align: center", "center: true"],
            correct: 1,
            explanation: "text-align: center로 텍스트를 가운데 정렬합니다."
        },
        {
            question: "CSS에서 요소를 숨기는 방법이 아닌 것은?",
            options: ["display: none", "visibility: hidden", "opacity: 0", "hidden: true"],
            correct: 3,
            explanation: "hidden: true는 CSS 속성이 아닙니다. HTML의 hidden 속성입니다."
        }
    ],
    javascript: [
        {
            question: "JavaScript에서 변수를 선언하는 키워드가 아닌 것은?",
            options: ["var", "let", "const", "variable"],
            correct: 3,
            explanation: "variable은 JavaScript의 키워드가 아닙니다. var, let, const를 사용합니다."
        },
        {
            question: "JavaScript에서 함수를 정의하는 방법이 아닌 것은?",
            options: ["function name() {}", "const name = () => {}", "let name = function() {}", "def name() {}"],
            correct: 3,
            explanation: "def는 Python의 함수 정의 키워드입니다. JavaScript는 function을 사용합니다."
        },
        {
            question: "DOM에서 ID로 요소를 선택하는 메서드는?",
            options: ["getElementById", "querySelector", "getElement", "selectById"],
            correct: 0,
            explanation: "document.getElementById()로 ID를 가진 요소를 선택합니다."
        }
    ]
};

let currentQuiz = null;
let currentQuestionIndex = 0;
let userAnswers = [];
let quizScore = 0;

function setupQuizEventListeners() {
    // Quiz category buttons
    document.querySelectorAll('.quiz-category button').forEach(button => {
        button.addEventListener('click', function() {
            const category = this.closest('.quiz-category').dataset.category;
            if (category) {
                startAdvancedQuiz(category);
            }
        });
    });
}

function startAdvancedQuiz(category) {
    if (!quizData[category]) {
        showNotification('해당 카테고리의 퀴즈가 준비되지 않았습니다.', 'warning');
        return;
    }
    
    currentQuiz = quizData[category];
    currentQuestionIndex = 0;
    userAnswers = [];
    quizScore = 0;
    
    // Hide quiz selection and show quiz interface
    const quizSelection = document.querySelector('.quiz-selection');
    if (quizSelection) {
        quizSelection.style.display = 'none';
    }
    
    // Create quiz interface
    createQuizInterface();
    showQuestion();
    
    logToConsole(`${category.toUpperCase()} 퀴즈를 시작합니다!`, 'info');
}

function createQuizInterface() {
    const main = document.querySelector('main');
    const quizInterface = document.createElement('div');
    quizInterface.className = 'quiz-interface';
    quizInterface.innerHTML = `
        <div class="quiz-container">
            <div class="quiz-header">
                <div class="quiz-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" id="quiz-progress"></div>
                    </div>
                    <span class="progress-text" id="quiz-progress-text">1/3</span>
                </div>
                <button class="btn btn-secondary" onclick="exitQuiz()">퀴즈 종료</button>
            </div>
            <div class="quiz-content" id="quiz-content">
                <!-- Question content will be inserted here -->
            </div>
            <div class="quiz-controls">
                <button class="btn btn-outline" id="prev-btn" onclick="previousQuestion()" disabled>이전</button>
                <button class="btn btn-primary" id="next-btn" onclick="nextQuestion()">다음</button>
            </div>
        </div>
    `;
    
    main.appendChild(quizInterface);
}

function showQuestion() {
    const question = currentQuiz[currentQuestionIndex];
    const quizContent = document.getElementById('quiz-content');
    
    quizContent.innerHTML = `
        <div class="question-container">
            <h2 class="question-title">질문 ${currentQuestionIndex + 1}</h2>
            <p class="question-text">${question.question}</p>
            <div class="options-container">
                ${question.options.map((option, index) => `
                    <label class="option-label">
                        <input type="radio" name="answer" value="${index}" 
                               ${userAnswers[currentQuestionIndex] === index ? 'checked' : ''}>
                        <span class="option-text">${option}</span>
                    </label>
                `).join('')}
            </div>
        </div>
    `;
    
    // Update progress
    const progress = ((currentQuestionIndex + 1) / currentQuiz.length) * 100;
    document.getElementById('quiz-progress').style.width = progress + '%';
    document.getElementById('quiz-progress-text').textContent = `${currentQuestionIndex + 1}/${currentQuiz.length}`;
    
    // Update button states
    document.getElementById('prev-btn').disabled = currentQuestionIndex === 0;
    document.getElementById('next-btn').textContent = currentQuestionIndex === currentQuiz.length - 1 ? '결과 보기' : '다음';
    
    // Add event listeners to options
    document.querySelectorAll('input[name="answer"]').forEach(input => {
        input.addEventListener('change', function() {
            userAnswers[currentQuestionIndex] = parseInt(this.value);
        });
    });
}

function nextQuestion() {
    if (currentQuestionIndex < currentQuiz.length - 1) {
        currentQuestionIndex++;
        showQuestion();
    } else {
        showQuizResults();
    }
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showQuestion();
    }
}

function showQuizResults() {
    // Calculate score
    quizScore = 0;
    userAnswers.forEach((answer, index) => {
        if (answer === currentQuiz[index].correct) {
            quizScore++;
        }
    });
    
    const percentage = Math.round((quizScore / currentQuiz.length) * 100);
    
    const quizContent = document.getElementById('quiz-content');
    quizContent.innerHTML = `
        <div class="quiz-results">
            <h2>퀴즈 완료!</h2>
            <div class="score-display">
                <div class="score-circle">
                    <span class="score-percentage">${percentage}%</span>
                    <span class="score-fraction">${quizScore}/${currentQuiz.length}</span>
                </div>
            </div>
            <div class="results-summary">
                <h3>결과 분석</h3>
                ${userAnswers.map((answer, index) => `
                    <div class="result-item ${answer === currentQuiz[index].correct ? 'correct' : 'incorrect'}">
                        <p class="result-question">Q${index + 1}: ${currentQuiz[index].question}</p>
                        <p class="result-answer">
                            ${answer === currentQuiz[index].correct ? '✅ 정답' : '❌ 오답'}: 
                            ${currentQuiz[index].options[currentQuiz[index].correct]}
                        </p>
                        <p class="result-explanation">${currentQuiz[index].explanation}</p>
                    </div>
                `).join('')}
            </div>
            <div class="results-actions">
                <button class="btn btn-primary" onclick="restartQuiz()">다시 시도</button>
                <button class="btn btn-secondary" onclick="exitQuiz()">퀴즈 선택으로</button>
                <button class="btn btn-outline" onclick="shareResults()">결과 공유</button>
            </div>
        </div>
    `;
    
    // Hide quiz controls
    document.querySelector('.quiz-controls').style.display = 'none';
    
    // Save results to localStorage
    saveQuizResults(percentage);
    
    logToConsole(`퀴즈 완료! 점수: ${quizScore}/${currentQuiz.length} (${percentage}%)`, 'info');
}

function saveQuizResults(percentage) {
    const results = JSON.parse(localStorage.getItem('weblearn-quiz-results') || '{}');
    const category = getCurrentQuizCategory();
    
    if (!results[category]) {
        results[category] = [];
    }
    
    results[category].push({
        score: quizScore,
        total: currentQuiz.length,
        percentage: percentage,
        date: new Date().toISOString()
    });
    
    localStorage.setItem('weblearn-quiz-results', JSON.stringify(results));
}

function getCurrentQuizCategory() {
    // Determine category based on current quiz data
    for (let category in quizData) {
        if (quizData[category] === currentQuiz) {
            return category;
        }
    }
    return 'unknown';
}

function exitQuiz() {
    const quizInterface = document.querySelector('.quiz-interface');
    if (quizInterface) {
        quizInterface.remove();
    }
    
    const quizSelection = document.querySelector('.quiz-selection');
    if (quizSelection) {
        quizSelection.style.display = 'block';
    }
}

// ===== SEARCH FUNCTION =====
function initSearchFunction() {
    createSearchInterface();
}

function createSearchInterface() {
    const nav = document.querySelector('.nav-menu');
    if (nav) {
        const searchItem = document.createElement('li');
        searchItem.className = 'nav-item search-item';
        searchItem.innerHTML = `
            <div class="search-container">
                <input type="text" id="search-input" placeholder="검색..." class="search-input">
                <button id="search-btn" class="search-btn">🔍</button>
                <div id="search-results" class="search-results"></div>
            </div>
        `;
        nav.appendChild(searchItem);
        
        // Add event listeners
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.getElementById('search-btn');
        
        searchInput.addEventListener('input', performSearch);
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
}

function performSearch() {
    const query = document.getElementById('search-input').value.toLowerCase().trim();
    const resultsContainer = document.getElementById('search-results');
    
    if (query.length < 2) {
        resultsContainer.innerHTML = '';
        resultsContainer.style.display = 'none';
        return;
    }
    
    const searchableContent = [
        { title: 'HTML 기초', url: 'html-tutorial.html#intro', content: 'html 태그 구조 마크업' },
        { title: 'CSS 스타일링', url: 'css-tutorial.html#intro', content: 'css 스타일 디자인 레이아웃' },
        { title: 'JavaScript 프로그래밍', url: 'js-tutorial.html#intro', content: 'javascript 함수 변수 dom' },
        { title: '코드 실습', url: 'practice.html', content: '실습 에디터 코딩 연습' },
        { title: '퀴즈', url: 'quiz.html', content: '퀴즈 테스트 문제' }
    ];
    
    const results = searchableContent.filter(item => 
        item.title.toLowerCase().includes(query) || 
        item.content.toLowerCase().includes(query)
    );
    
    if (results.length > 0) {
        resultsContainer.innerHTML = results.map(result => `
            <div class="search-result-item">
                <a href="${result.url}" class="search-result-link">
                    <strong>${result.title}</strong>
                </a>
            </div>
        `).join('');
        resultsContainer.style.display = 'block';
    } else {
        resultsContainer.innerHTML = '<div class="search-no-results">검색 결과가 없습니다.</div>';
        resultsContainer.style.display = 'block';
    }
    
    // Hide results when clicking outside
    setTimeout(() => {
        document.addEventListener('click', function hideResults(e) {
            if (!e.target.closest('.search-container')) {
                resultsContainer.style.display = 'none';
                document.removeEventListener('click', hideResults);
            }
        });
    }, 100);
}

// ===== BOOKMARK SYSTEM =====
function initBookmarkSystem() {
    loadBookmarks();
    createBookmarkInterface();
}

function createBookmarkInterface() {
    const nav = document.querySelector('.nav-menu');
    if (nav) {
        const bookmarkItem = document.createElement('li');
        bookmarkItem.className = 'nav-item bookmark-item';
        bookmarkItem.innerHTML = `
            <button class="bookmark-toggle" onclick="toggleBookmarkPanel()">📚</button>
            <div id="bookmark-panel" class="bookmark-panel" style="display: none;">
                <h3>북마크</h3>
                <div id="bookmark-list"></div>
                <button class="btn btn-sm" onclick="addCurrentPageBookmark()">현재 페이지 추가</button>
            </div>
        `;
        nav.appendChild(bookmarkItem);
    }
    
    // Add bookmark button to each tutorial section
    document.querySelectorAll('.tutorial-section').forEach(section => {
        const bookmarkBtn = document.createElement('button');
        bookmarkBtn.className = 'bookmark-section-btn';
        bookmarkBtn.innerHTML = '🔖';
        bookmarkBtn.title = '북마크 추가';
        bookmarkBtn.onclick = () => addSectionBookmark(section);
        
        const heading = section.querySelector('h1, h2');
        if (heading) {
            heading.appendChild(bookmarkBtn);
        }
    });
}

function toggleBookmarkPanel() {
    const panel = document.getElementById('bookmark-panel');
    if (panel.style.display === 'none') {
        panel.style.display = 'block';
        loadBookmarkList();
    } else {
        panel.style.display = 'none';
    }
}

function addCurrentPageBookmark() {
    const title = document.title;
    const url = window.location.href;
    addBookmark(title, url);
}

function addSectionBookmark(section) {
    const heading = section.querySelector('h1, h2');
    const title = heading ? heading.textContent : 'Unknown Section';
    const url = window.location.href + '#' + section.id;
    addBookmark(title, url);
}

function addBookmark(title, url) {
    const bookmarks = JSON.parse(localStorage.getItem('weblearn-bookmarks') || '[]');
    
    // Check if bookmark already exists
    if (bookmarks.some(bookmark => bookmark.url === url)) {
        showNotification('이미 북마크에 추가된 페이지입니다.', 'warning');
        return;
    }
    
    bookmarks.push({
        title: title,
        url: url,
        date: new Date().toISOString()
    });
    
    localStorage.setItem('weblearn-bookmarks', JSON.stringify(bookmarks));
    showNotification('북마크에 추가되었습니다!', 'success');
    loadBookmarkList();
}

function loadBookmarkList() {
    const bookmarks = JSON.parse(localStorage.getItem('weblearn-bookmarks') || '[]');
    const bookmarkList = document.getElementById('bookmark-list');
    
    if (bookmarks.length === 0) {
        bookmarkList.innerHTML = '<p class="no-bookmarks">북마크가 없습니다.</p>';
        return;
    }
    
    bookmarkList.innerHTML = bookmarks.map((bookmark, index) => `
        <div class="bookmark-item">
            <a href="${bookmark.url}" class="bookmark-link">${bookmark.title}</a>
            <button class="bookmark-delete" onclick="removeBookmark(${index})">×</button>
        </div>
    `).join('');
}

function removeBookmark(index) {
    const bookmarks = JSON.parse(localStorage.getItem('weblearn-bookmarks') || '[]');
    bookmarks.splice(index, 1);
    localStorage.setItem('weblearn-bookmarks', JSON.stringify(bookmarks));
    loadBookmarkList();
    showNotification('북마크가 삭제되었습니다.', 'info');
}

// Export functions for use in other scripts
window.WebLearn = {
    runCode,
    clearCode,
    saveCode,
    startQuiz: startAdvancedQuiz,
    toggleTheme,
    logToConsole,
    showNotification,
    nextQuestion,
    previousQuestion,
    exitQuiz,
    restartQuiz,
    addBookmark,
    performSearch
};

// 배포 튜토리얼 탭 기능
function initDeploymentTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // 모든 탭 버튼과 콘텐츠 비활성화
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // 클릭된 탭 활성화
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
}

// 보안 체크리스트 기능
function initSecurityChecklist() {
    const checkboxes = document.querySelectorAll('.checklist input[type="checkbox"]');
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const label = checkbox.parentElement;
            if (checkbox.checked) {
                label.style.background = 'var(--success-color)';
                label.style.color = 'white';
            } else {
                label.style.background = 'white';
                label.style.color = 'var(--text-color)';
            }
        });
    });
}

// 비용 계산기 기능
function initCostCalculator() {
    const costItems = document.querySelectorAll('.cost-item');
    let totalCost = 0;
    
    costItems.forEach(item => {
        const valueElement = item.querySelector('.cost-value');
        if (valueElement && valueElement.textContent.includes('원')) {
            const cost = parseInt(valueElement.textContent.replace(/[^0-9]/g, ''));
            if (!isNaN(cost)) {
                totalCost += cost;
            }
        }
    });
    
    // 총 비용 업데이트
    const totalElement = document.querySelector('.cost-total .cost-value');
    if (totalElement) {
        totalElement.textContent = `${totalCost.toLocaleString()}원/년`;
    }
} 