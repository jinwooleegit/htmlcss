// ============================================================================
// WebLearn 고급 기능 시스템
// 1. 코드 실행 환경 (CodePen 스타일)
// 2. PWA 지원
// ============================================================================

class WebLearnAdvancedFeatures {
    constructor() {
        this.initializeAll();
    }

    initializeAll() {
        this.initCodePlayground();
        this.initPWASupport();
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
    // 2. PWA 지원
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
    installApp: () => webLearnFeatures?.installApp(),
    dismissInstall: () => webLearnFeatures?.dismissInstall()
}; 