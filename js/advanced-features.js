// ============================================================================
// WebLearn 고급 기능 시스템
// 1. 코드 실행 환경 (CodePen 스타일)
// 2. 노트/북마크 시스템  
// 3. PWA 지원
// 4. AI 학습 도우미 (규칙 기반)
// ============================================================================

class WebLearnAdvancedFeatures {
    constructor() {
        this.initializeAll();
    }

    initializeAll() {
        this.initCodePlayground();
        this.initNotesSystem();
        this.initPWASupport();
        this.initAIAssistant();
    }

    // ========================================================================
    // 1. 코드 실행 환경 (CodePen 스타일)
    // ========================================================================
    initCodePlayground() {
        this.createPlaygroundHTML();
        this.bindPlaygroundEvents();
    }

    createPlaygroundHTML() {
        // 모든 code-block에 실행 환경 추가
        const codeBlocks = document.querySelectorAll('.code-block');
        codeBlocks.forEach((block, index) => {
            if (block.querySelector('pre code')) {
                this.addPlaygroundToCodeBlock(block, index);
            }
        });
    }

    addPlaygroundToCodeBlock(codeBlock, index) {
        const code = codeBlock.querySelector('pre code').textContent;
        
        // 실행 가능한 코드인지 확인 (HTML/CSS/JS 포함)
        if (this.isExecutableCode(code)) {
            const playgroundHTML = this.generatePlaygroundHTML(code, index);
            codeBlock.insertAdjacentHTML('afterend', playgroundHTML);
        }
    }

    isExecutableCode(code) {
        // HTML, CSS, JavaScript 코드 감지
        return code.includes('<') || code.includes('console.log') || 
               code.includes('alert') || code.includes('document.') ||
               code.includes('function') || code.includes('let ') ||
               code.includes('const ') || code.includes('var ');
    }

    generatePlaygroundHTML(code, index) {
        return `
            <div class="code-playground" id="playground-${index}">
                <div class="playground-header">
                    <h4 class="playground-title">코드 실행 환경</h4>
                    <div class="playground-controls">
                        <button class="run-btn" onclick="window.webLearnFeatures.runCode(${index})">실행</button>
                        <button class="reset-btn" onclick="window.webLearnFeatures.resetCode(${index})">초기화</button>
                    </div>
                </div>
                <div class="playground-content">
                    <div class="code-editor">
                        <div class="editor-header">코드 편집기</div>
                        <textarea class="code-textarea" id="code-${index}" placeholder="여기에 코드를 입력하세요...">${code.trim()}</textarea>
                    </div>
                    <div class="preview-panel">
                        <div class="preview-header">실행 결과</div>
                        <iframe class="preview-iframe" id="preview-${index}"></iframe>
                    </div>
                </div>
            </div>
        `;
    }

    bindPlaygroundEvents() {
        // 코드 편집기에서 실시간 업데이트
        document.addEventListener('input', (e) => {
            if (e.target.classList.contains('code-textarea')) {
                const index = e.target.id.split('-')[1];
                clearTimeout(this.updateTimer);
                this.updateTimer = setTimeout(() => {
                    this.runCode(index);
                }, 1000);
            }
        });
    }

    runCode(index) {
        const codeTextarea = document.getElementById(`code-${index}`);
        const previewIframe = document.getElementById(`preview-${index}`);
        
        if (!codeTextarea || !previewIframe) return;

        const code = codeTextarea.value;
        let htmlContent = '';

        // JavaScript 코드인 경우
        if (this.isJavaScriptCode(code)) {
            htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        .output { background: #f5f5f5; padding: 10px; border-radius: 5px; margin: 10px 0; }
                        .error { color: red; }
                    </style>
                </head>
                <body>
                    <div id="output"></div>
                    <script>
                        // console.log 캡처
                        const output = document.getElementById('output');
                        const originalLog = console.log;
                        const originalError = console.error;
                        
                        console.log = function(...args) {
                            const div = document.createElement('div');
                            div.className = 'output';
                            div.textContent = args.join(' ');
                            output.appendChild(div);
                            originalLog.apply(console, args);
                        };
                        
                        console.error = function(...args) {
                            const div = document.createElement('div');
                            div.className = 'output error';
                            div.textContent = 'Error: ' + args.join(' ');
                            output.appendChild(div);
                            originalError.apply(console, args);
                        };
                        
                        try {
                            ${code}
                        } catch (error) {
                            console.error(error.message);
                        }
                    </script>
                </body>
                </html>
            `;
        } 
        // HTML 코드인 경우
        else if (code.includes('<')) {
            htmlContent = code;
        }
        // CSS 코드인 경우
        else if (code.includes('{') && code.includes('}')) {
            htmlContent = `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        ${code}
                        body { font-family: Arial, sans-serif; padding: 20px; }
                    </style>
                </head>
                <body>
                    <h3>CSS 스타일 적용 예시</h3>
                    <div class="example">스타일이 적용된 예시 텍스트</div>
                    <p>이 영역에서 CSS 효과를 확인할 수 있습니다.</p>
                </body>
                </html>
            `;
        }

        // iframe에 코드 실행 결과 표시
        previewIframe.src = 'data:text/html;charset=utf-8,' + encodeURIComponent(htmlContent);
    }

    isJavaScriptCode(code) {
        return code.includes('console.log') || code.includes('alert') || 
               code.includes('function') || code.includes('let ') ||
               code.includes('const ') || code.includes('var ') ||
               code.includes('document.') || code.includes('window.');
    }

    resetCode(index) {
        const playground = document.getElementById(`playground-${index}`);
        const originalCode = playground.previousElementSibling.querySelector('pre code').textContent;
        const codeTextarea = document.getElementById(`code-${index}`);
        codeTextarea.value = originalCode.trim();
        this.runCode(index);
    }

    // ========================================================================
    // 2. 노트/북마크 시스템
    // ========================================================================
    initNotesSystem() {
        this.createNotesHTML();
        this.bindNotesEvents();
        this.loadNotes();
    }

    createNotesHTML() {
        const notesHTML = `
            <button class="notes-toggle" onclick="window.webLearnFeatures.toggleNotes()">📝</button>
            <div class="notes-system" id="notesSystem">
                <div class="notes-header">
                    <h3 class="notes-title">학습 노트</h3>
                    <button class="close-notes" onclick="window.webLearnFeatures.toggleNotes()">×</button>
                </div>
                <div class="notes-tabs">
                    <button class="notes-tab active" onclick="window.webLearnFeatures.switchTab('notes')">노트</button>
                    <button class="notes-tab" onclick="window.webLearnFeatures.switchTab('bookmarks')">북마크</button>
                </div>
                <div class="notes-content" id="notesContent">
                    <!-- 노트 내용이 여기에 표시됩니다 -->
                </div>
                <div class="notes-input" style="padding: 1rem; border-top: 1px solid var(--border-color);">
                    <textarea id="noteInput" placeholder="새 노트를 입력하세요..." style="width: 100%; height: 80px; border: 1px solid var(--border-color); border-radius: 6px; padding: 0.5rem; resize: none;"></textarea>
                    <button onclick="window.webLearnFeatures.saveNote()" style="margin-top: 0.5rem; background: var(--primary-color); color: white; border: none; padding: 0.5rem 1rem; border-radius: 6px; cursor: pointer; width: 100%;">노트 저장</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', notesHTML);
    }

    bindNotesEvents() {
        // 더블클릭으로 텍스트 선택하여 노트 생성
        document.addEventListener('dblclick', (e) => {
            const selection = window.getSelection().toString().trim();
            if (selection.length > 0) {
                this.quickNote(selection);
            }
        });

        // 북마크 버튼 추가
        this.addBookmarkButtons();
    }

    addBookmarkButtons() {
        const sections = document.querySelectorAll('.tutorial-section');
        sections.forEach((section, index) => {
            const title = section.querySelector('h2');
            if (title) {
                const bookmarkBtn = document.createElement('button');
                bookmarkBtn.innerHTML = '🔖';
                bookmarkBtn.style.cssText = 'background: none; border: none; font-size: 1.2rem; cursor: pointer; margin-left: 0.5rem;';
                bookmarkBtn.onclick = () => this.toggleBookmark(title.textContent, window.location.href + '#section-' + index);
                title.appendChild(bookmarkBtn);
            }
        });
    }

    toggleNotes() {
        const notesSystem = document.getElementById('notesSystem');
        notesSystem.classList.toggle('active');
    }

    switchTab(tab) {
        const tabs = document.querySelectorAll('.notes-tab');
        tabs.forEach(t => t.classList.remove('active'));
        event.target.classList.add('active');

        if (tab === 'notes') {
            this.displayNotes();
        } else {
            this.displayBookmarks();
        }
    }

    saveNote() {
        const noteInput = document.getElementById('noteInput');
        const noteText = noteInput.value.trim();
        
        if (noteText) {
            const note = {
                id: Date.now(),
                text: noteText,
                page: window.location.pathname,
                timestamp: new Date().toLocaleString(),
                url: window.location.href
            };

            const notes = JSON.parse(localStorage.getItem('weblearn_notes') || '[]');
            notes.unshift(note);
            localStorage.setItem('weblearn_notes', JSON.stringify(notes));

            noteInput.value = '';
            this.displayNotes();
        }
    }

    quickNote(selectedText) {
        const note = {
            id: Date.now(),
            text: `"${selectedText}" - ${window.location.pathname}`,
            page: window.location.pathname,
            timestamp: new Date().toLocaleString(),
            url: window.location.href
        };

        const notes = JSON.parse(localStorage.getItem('weblearn_notes') || '[]');
        notes.unshift(note);
        localStorage.setItem('weblearn_notes', JSON.stringify(notes));

        // 노트 시스템 표시
        const notesSystem = document.getElementById('notesSystem');
        if (!notesSystem.classList.contains('active')) {
            this.toggleNotes();
        }
        this.displayNotes();
    }

    displayNotes() {
        const notes = JSON.parse(localStorage.getItem('weblearn_notes') || '[]');
        const content = document.getElementById('notesContent');
        
        if (notes.length === 0) {
            content.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">저장된 노트가 없습니다.</p>';
            return;
        }

        content.innerHTML = notes.map(note => `
            <div class="note-item">
                <div class="note-text">${note.text}</div>
                <div class="note-meta">${note.timestamp} | ${note.page}</div>
                <button onclick="window.webLearnFeatures.deleteNote(${note.id})" style="background: none; border: none; color: red; cursor: pointer; float: right;">삭제</button>
            </div>
        `).join('');
    }

    toggleBookmark(title, url) {
        const bookmarks = JSON.parse(localStorage.getItem('weblearn_bookmarks') || '[]');
        const existingIndex = bookmarks.findIndex(b => b.url === url);

        if (existingIndex > -1) {
            bookmarks.splice(existingIndex, 1);
        } else {
            bookmarks.unshift({
                id: Date.now(),
                title: title,
                url: url,
                page: window.location.pathname,
                timestamp: new Date().toLocaleString()
            });
        }

        localStorage.setItem('weblearn_bookmarks', JSON.stringify(bookmarks));
        this.displayBookmarks();
    }

    displayBookmarks() {
        const bookmarks = JSON.parse(localStorage.getItem('weblearn_bookmarks') || '[]');
        const content = document.getElementById('notesContent');
        
        if (bookmarks.length === 0) {
            content.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 2rem;">저장된 북마크가 없습니다.</p>';
            return;
        }

        content.innerHTML = bookmarks.map(bookmark => `
            <div class="bookmark-item" onclick="window.location.href='${bookmark.url}'">
                <div class="note-text">${bookmark.title}</div>
                <div class="note-meta">${bookmark.timestamp} | ${bookmark.page}</div>
            </div>
        `).join('');
    }

    deleteNote(noteId) {
        const notes = JSON.parse(localStorage.getItem('weblearn_notes') || '[]');
        const filtered = notes.filter(note => note.id !== noteId);
        localStorage.setItem('weblearn_notes', JSON.stringify(filtered));
        this.displayNotes();
    }

    loadNotes() {
        // 페이지 로드 시 노트 탭을 기본으로 표시
        setTimeout(() => {
            this.displayNotes();
        }, 100);
    }

    // ========================================================================
    // 3. PWA 지원 (오프라인 사용)
    // ========================================================================
    initPWASupport() {
        this.createManifest();
        this.registerServiceWorker();
        this.showInstallPrompt();
    }

    createManifest() {
        // Web App Manifest가 없으면 동적으로 생성
        if (!document.querySelector('link[rel="manifest"]')) {
            const manifest = {
                name: "WebLearn - 웹 개발 학습 플랫폼",
                short_name: "WebLearn",
                description: "HTML, CSS, JavaScript를 배우는 최고의 학습 플랫폼",
                start_url: "/",
                display: "standalone",
                background_color: "#ffffff",
                theme_color: "#6366f1",
                icons: [
                    {
                        src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E🌐%3C/text%3E%3C/svg%3E",
                        sizes: "192x192",
                        type: "image/svg+xml"
                    }
                ]
            };

            const manifestBlob = new Blob([JSON.stringify(manifest)], {type: 'application/json'});
            const manifestURL = URL.createObjectURL(manifestBlob);
            
            const link = document.createElement('link');
            link.rel = 'manifest';
            link.href = manifestURL;
            document.head.appendChild(link);
        }
    }

    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            // Service Worker 코드를 동적으로 생성
            const swCode = `
                const CACHE_NAME = 'weblearn-v1';
                const urlsToCache = [
                    '/',
                    '/css/style.css',
                    '/js/script.js',
                    '/js/advanced-features.js'
                ];

                self.addEventListener('install', event => {
                    event.waitUntil(
                        caches.open(CACHE_NAME)
                            .then(cache => cache.addAll(urlsToCache))
                    );
                });

                self.addEventListener('fetch', event => {
                    event.respondWith(
                        caches.match(event.request)
                            .then(response => response || fetch(event.request))
                    );
                });
            `;

            const swBlob = new Blob([swCode], {type: 'application/javascript'});
            const swURL = URL.createObjectURL(swBlob);

            navigator.serviceWorker.register(swURL)
                .then(registration => {
                    console.log('SW registered: ', registration);
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        }
    }

    showInstallPrompt() {
        let deferredPrompt;

        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;

            // 설치 프롬프트 표시
            const installHTML = `
                <div class="install-prompt" id="installPrompt">
                    <div class="install-text">
                        <strong>WebLearn을 앱으로 설치하세요!</strong><br>
                        오프라인에서도 학습할 수 있습니다.
                    </div>
                    <div class="install-buttons">
                        <button class="install-btn" onclick="window.webLearnFeatures.installApp()">설치</button>
                        <button class="dismiss-btn" onclick="window.webLearnFeatures.dismissInstall()">나중에</button>
                    </div>
                </div>
            `;

            document.body.insertAdjacentHTML('beforeend', installHTML);
            
            setTimeout(() => {
                document.getElementById('installPrompt').classList.add('show');
            }, 3000);

            this.deferredPrompt = deferredPrompt;
        });
    }

    installApp() {
        if (this.deferredPrompt) {
            this.deferredPrompt.prompt();
            this.deferredPrompt.userChoice.then((choiceResult) => {
                this.deferredPrompt = null;
                this.dismissInstall();
            });
        }
    }

    dismissInstall() {
        const installPrompt = document.getElementById('installPrompt');
        if (installPrompt) {
            installPrompt.remove();
        }
    }

    // ========================================================================
    // 4. AI 학습 도우미 (규칙 기반)
    // ========================================================================
    initAIAssistant() {
        this.createAIHTML();
        this.initAIKnowledge();
        this.bindAIEvents();
    }

    createAIHTML() {
        const aiHTML = `
            <button class="ai-toggle" onclick="window.webLearnFeatures.toggleAI()">🤖</button>
            <div class="ai-assistant" id="aiAssistant">
                <div class="ai-header">
                    <h3 class="ai-title">
                        <span>🤖</span>
                        WebLearn AI 도우미
                    </h3>
                    <button class="ai-close" onclick="window.webLearnFeatures.toggleAI()">×</button>
                </div>
                <div class="ai-chat" id="aiChat">
                    <div class="ai-message ai">
                        안녕하세요! 웹 개발 학습을 도와드리는 AI 도우미입니다.<br>
                        궁금한 것이 있으면 언제든 물어보세요! 🚀
                    </div>
                </div>
                <div class="ai-input-area">
                    <input type="text" class="ai-input" id="aiInput" placeholder="질문을 입력하세요..." onkeypress="if(event.key==='Enter') window.webLearnFeatures.sendAIMessage()">
                    <button class="ai-send" onclick="window.webLearnFeatures.sendAIMessage()">전송</button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', aiHTML);
    }

    initAIKnowledge() {
        this.aiKnowledge = {
            'html': {
                '태그': 'HTML 태그는 &lt;태그명&gt;으로 시작해서 &lt;/태그명&gt;으로 끝납니다. 예: &lt;h1&gt;제목&lt;/h1&gt;',
                '속성': 'HTML 속성은 태그에 추가 정보를 제공합니다. 예: &lt;img src="이미지.jpg" alt="설명"&gt;',
                '구조': 'HTML 문서는 DOCTYPE, html, head, body로 구성됩니다.',
                '시맨틱': '시맨틱 태그는 의미를 가진 태그입니다. header, nav, main, article, aside, footer 등이 있어요.',
                '폼': 'HTML 폼은 &lt;form&gt; 태그로 만들고, input, textarea, select 등으로 입력 요소를 추가합니다.'
            },
            'css': {
                '선택자': 'CSS 선택자는 스타일을 적용할 요소를 지정합니다. 타입선택자(h1), 클래스(.class), 아이디(#id) 등이 있어요.',
                'flexbox': 'Flexbox는 1차원 레이아웃을 위한 CSS 기술입니다. display: flex로 시작해요.',
                '그리드': 'CSS Grid는 2차원 레이아웃 시스템입니다. display: grid로 시작합니다.',
                '반응형': '반응형 디자인은 @media 쿼리를 사용해서 다양한 화면 크기에 대응합니다.',
                '애니메이션': 'CSS 애니메이션은 @keyframes과 animation 속성을 사용합니다.',
                '박스모델': '박스모델은 content, padding, border, margin으로 구성됩니다.'
            },
            'javascript': {
                '변수': 'JavaScript 변수는 let, const, var로 선언할 수 있습니다. const는 상수, let은 재할당 가능한 변수입니다.',
                '함수': '함수는 재사용 가능한 코드 블록입니다. function 키워드나 화살표 함수(=&gt;)로 만들 수 있어요.',
                '배열': '배열은 여러 값을 저장하는 자료구조입니다. [1, 2, 3] 형태로 만듭니다.',
                '객체': '객체는 키-값 쌍으로 데이터를 저장합니다. {name: "홍길동", age: 25} 형태입니다.',
                '비동기': '비동기 처리는 Promise와 async/await를 사용합니다. 시간이 걸리는 작업을 처리할 때 사용해요.',
                'dom': 'DOM은 Document Object Model의 줄임말로, HTML 요소를 JavaScript로 조작할 수 있게 해줍니다.',
                '이벤트': '이벤트는 사용자의 행동(클릭, 키보드 입력 등)에 반응하는 기능입니다. addEventListener로 등록합니다.'
            },
            '일반': {
                '학습방법': '웹 개발 학습은 이론 → 실습 → 프로젝트 순서로 진행하는 것이 좋습니다. 매일 조금씩이라도 꾸준히 하세요!',
                '순서': 'HTML → CSS → JavaScript 순서로 학습하시는 것을 추천합니다.',
                '도구': '개발 도구로는 VS Code, Chrome DevTools, Cursor AI 등을 추천합니다.',
                '프로젝트': '간단한 개인 홈페이지부터 시작해서 점점 복잡한 프로젝트로 발전시켜보세요.',
                '오류': '오류가 나면 당황하지 마세요. 개발자 도구(F12)의 Console 탭에서 오류 메시지를 확인해보세요.'
            }
        };
    }

    bindAIEvents() {
        // 엔터키로 메시지 전송
        document.getElementById('aiInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendAIMessage();
            }
        });
    }

    toggleAI() {
        const aiAssistant = document.getElementById('aiAssistant');
        aiAssistant.classList.toggle('active');
    }

    sendAIMessage() {
        const input = document.getElementById('aiInput');
        const message = input.value.trim();
        
        if (message) {
            this.addAIMessage(message, 'user');
            input.value = '';
            
            // AI 응답 생성
            setTimeout(() => {
                const response = this.generateAIResponse(message);
                this.addAIMessage(response, 'ai');
            }, 1000);
        }
    }

    addAIMessage(message, sender) {
        const chat = document.getElementById('aiChat');
        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-message ${sender}`;
        messageDiv.innerHTML = message;
        chat.appendChild(messageDiv);
        chat.scrollTop = chat.scrollHeight;
    }

    generateAIResponse(question) {
        const lowerQuestion = question.toLowerCase();
        
        // 키워드 기반 답변 검색
        for (const [category, topics] of Object.entries(this.aiKnowledge)) {
            for (const [topic, answer] of Object.entries(topics)) {
                if (lowerQuestion.includes(topic) || lowerQuestion.includes(category)) {
                    return `💡 <strong>${topic}에 대한 답변:</strong><br><br>${answer}<br><br>더 궁금한 점이 있으면 언제든 물어보세요!`;
                }
            }
        }

        // 일반적인 질문에 대한 응답
        if (lowerQuestion.includes('안녕') || lowerQuestion.includes('hello')) {
            return '안녕하세요! 웹 개발 학습에 대해 무엇이든 물어보세요. HTML, CSS, JavaScript에 대한 질문을 환영합니다! 😊';
        }

        if (lowerQuestion.includes('감사') || lowerQuestion.includes('고마워')) {
            return '천만에요! 웹 개발 학습을 응원합니다. 더 궁금한 것이 있으면 언제든 물어보세요! 🚀';
        }

        if (lowerQuestion.includes('어려워') || lowerQuestion.includes('힘들어')) {
            return '처음에는 모든 것이 어렵게 느껴질 수 있어요. 하지만 꾸준히 하다 보면 분명히 늘어납니다! 💪<br><br>작은 것부터 차근차근 해보세요. 제가 도와드릴게요!';
        }

        // 기본 응답
        return `죄송해요, "${question}"에 대한 구체적인 답변을 찾을 수 없습니다.<br><br>다음 키워드로 질문해보세요:<br>• <strong>HTML:</strong> 태그, 속성, 구조, 시맨틱, 폼<br>• <strong>CSS:</strong> 선택자, flexbox, 그리드, 반응형, 애니메이션<br>• <strong>JavaScript:</strong> 변수, 함수, 배열, 객체, 비동기, DOM, 이벤트<br>• <strong>일반:</strong> 학습방법, 순서, 도구, 프로젝트`;
    }
}

// 전역 인스턴스 생성
let webLearnFeatures;

// DOM 로드 완료 후 초기화
document.addEventListener('DOMContentLoaded', () => {
    webLearnFeatures = new WebLearnAdvancedFeatures();
});

// 전역 함수들 (HTML에서 직접 호출용)
window.webLearnFeatures = {
    runCode: (index) => webLearnFeatures?.runCode(index),
    resetCode: (index) => webLearnFeatures?.resetCode(index),
    toggleNotes: () => webLearnFeatures?.toggleNotes(),
    switchTab: (tab) => webLearnFeatures?.switchTab(tab),
    saveNote: () => webLearnFeatures?.saveNote(),
    deleteNote: (id) => webLearnFeatures?.deleteNote(id),
    installApp: () => webLearnFeatures?.installApp(),
    dismissInstall: () => webLearnFeatures?.dismissInstall(),
    toggleAI: () => webLearnFeatures?.toggleAI(),
    sendAIMessage: () => webLearnFeatures?.sendAIMessage()
}; 