class BadgeGenerator {
    constructor(config = {}) {
        this.config = {
            ...config
        };
    }

    renderTemplate(options = {}) {
        const {
            platform = 'custom',
            containerClass = '',
            formId = 'badgeForm',
            linksId = 'badgeLinks'
        } = options;

        const platformConfig = this.config.platforms[platform] || this.config.platforms.custom;

        // 生成样式选项的 HTML
        const stylesHtml = this.config.badgeStyles.map((style, index) => `
      <label class="relative flex cursor-pointer rounded-lg border bg-white p-1 shadow-sm hover:border-blue-500 focus:outline-none">
        <input type="radio"
               name="badgeStyle"
               value="${style.value}"
               class="sr-only peer"
               ${index === 0 ? 'checked' : ''}>
        <div class="flex w-full">
          <div class="flex flex-col items-center justify-center w-full space-y-1">
            <span class="font-medium text-gray-900">${style.label}</span>
            <img src="/api/badge/L/R.svg?style=${style.value}" alt="${style.label}">
          </div>
        </div>
        <div class="absolute -inset-px rounded-lg border-2 pointer-events-none peer-checked:border-blue-500" aria-hidden="true"></div>
      </label>
    `).join('');

        // 如果平台配置了徽章类型，生成徽章类型选项的 HTML
        const typesHtml = platformConfig.badgeTypes ? `
      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">徽章类型</label>
        <div class="grid grid-cols-4 gap-3">
          ${platformConfig.badgeTypes.map((type, index) => `
            <label class="relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm hover:border-blue-500 focus:outline-none">
              <input type="radio"
                     name="badgeType"
                     value="${type.value}"
                     class="sr-only peer"
                     ${index === 0 ? 'checked' : ''}>
              <div class="flex w-full">
                <div class="flex flex-col items-center justify-center w-full space-y-1">
                  <span class="font-medium text-gray-900">${type.label}</span>
                  <img src="/api/badge/${type.value}/100.svg" alt="${type.label}">
                </div>
              </div>
              <div class="absolute -inset-px rounded-lg border-2 pointer-events-none peer-checked:border-blue-500" aria-hidden="true"></div>
            </label>
          `).join('')}
        </div>
      </div>
    ` : '';

        return `
      <div class="${containerClass}">
        <div class="flex justify-between items-start space-x-2">
          <!-- 左侧表单 -->
          <div class="w-1/2">
            <div class="bg-white rounded-sm shadow-sm border border-gray-100 overflow-hidden">
              <div class="border-b border-gray-100 px-4 py-4">
                <h1 class="text-xl font-semibold text-gray-900">创建${platformConfig.name || ''}徽章</h1>
              </div>

              <div class="p-4">
                <form id="${formId}" class="space-y-2">
                  <div class="grid grid-cols-2 gap-2">
                    <div class="space-y-2">
                      <label for="ownerText" class="block text-sm font-medium text-gray-700">组织 | 用户</label>
                      <input type="text"
                             id="ownerText"
                             name="ownerText"
                             class="block w-full rounded-md border-0 ring-1 ring-inset ring-gray-200 py-2 px-4 text-gray-900 placeholder:text-gray-400 hover:ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors sm:text-sm sm:leading-6"
                             placeholder="请输入仓库归属组织或用户"
                             required/>
                    </div>

                    <div class="space-y-2">
                      <label for="repoText" class="block text-sm font-medium text-gray-700">仓库</label>
                      <input type="text"
                             id="repoText"
                             name="repoText"
                             class="block w-full rounded-md border-0 ring-1 ring-inset ring-gray-200 py-2 px-4 text-gray-900 placeholder:text-gray-400 hover:ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors sm:text-sm sm:leading-6"
                             placeholder="请输入仓库名称"
                             required/>
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-2">
                    <div class="space-y-2">
                        <label for="leftColorText" class="block text-sm font-medium text-gray-700">左侧颜色</label>
                        <input type="text"
                               id="leftColorText"
                               name="leftColorText"
                               class="block w-full rounded-md border-0 ring-1 ring-inset ring-gray-200 py-2 px-4 text-gray-900 placeholder:text-gray-400 hover:ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors sm:text-sm sm:leading-6"
                               placeholder="请输入左侧颜色，默认值：#555"/>
                    </div>

                    <div class="space-y-2">
                        <label for="rightColorText" class="block text-sm font-medium text-gray-700">右侧颜色</label>
                        <input type="text"
                               id="rightColorText"
                               name="rightColorText"
                               class="block w-full rounded-md border-0 ring-1 ring-inset ring-gray-200 py-2 px-4 text-gray-900 placeholder:text-gray-400 hover:ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors sm:text-sm sm:leading-6"
                               placeholder="请输入左侧颜色，默认值：#4c1"/>
                    </div>
                </div>

                  <div class="space-y-2">
                            <label for="logoText" class="block text-sm font-medium text-gray-700">设置 Logo</label>
                            <input type="text"
                                   id="logoText"
                                   name="logoText"
                                   class="block w-full rounded-md border-0 ring-1 ring-inset ring-gray-200 py-2 px-4 text-gray-900 placeholder:text-gray-400 hover:ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors sm:text-sm sm:leading-6"
                                   placeholder="[可选] 请输入 Logo 地址，例如 https://example.com/logo.png"/>
                        </div>

                  <!-- 样式选择 -->
                  <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700">徽章样式</label>
                    <div class="grid grid-cols-6 gap-3">
                      ${stylesHtml}
                    </div>
                  </div>

                  <!-- 平台特定的徽章类型选择 -->
                  ${typesHtml}

                  <div class="pt-2">
                    <button type="submit"
                            class="w-full flex justify-center items-center px-4 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                      生成徽章
                      <svg class="ml-2 -mr-1 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                      </svg>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <!-- 右侧链接区域 -->
          <div class="w-1/2">
            <div id="${linksId}" class="hidden border-gray-100"></div>
          </div>
        </div>
      </div>
    `;
    }

    // 在 initializeScript 方法中修改表单处理逻辑
    initializeScript(options = {}) {
        const {
            formId = 'badgeForm',
            linksId = 'badgeLinks',
            platform = 'custom'
        } = options;

        const platformConfig = this.config.platforms[platform] || this.config.platforms.custom;
        const {previewUrl, urlParams = {}} = platformConfig;

        return `
  <script>
    (function() {
      const badgeForm = document.getElementById('${formId}');
      const elements = {
        owner: document.getElementById('ownerText'),
        repo: document.getElementById('repoText'),
        leftColor: document.getElementById('leftColorText'),
        rightColor: document.getElementById('rightColorText'),
        logo: document.getElementById('logoText')
      };
      const badgeLinks = document.getElementById('${linksId}');

      // 帮助函数：处理表单值
      function getFormValues() {
        const values = {};
        
        // 处理所有输入框的值
        Object.entries(elements).forEach(([key, element]) => {
          if (element && element.value) {
            values[key] = element.value;
          }
        });

        // 获取选中的单选按钮值
        const styleElement = document.querySelector('input[name="badgeStyle"]:checked');
        if (styleElement) {
          values.style = styleElement.value;
        }

        const typeElement = document.querySelector('input[name="badgeType"]:checked');
        if (typeElement) {
          values.type = typeElement.value;
        }

        return values;
      }

      // 帮助函数：构建 URL 参数
      function buildUrlParams(values) {
        const params = new URLSearchParams();
        
        // 添加平台配置的默认参数
        Object.entries(${JSON.stringify(urlParams)}).forEach(([key, value]) => {
          params.append(key, value);
        });

        // 添加表单值
        Object.entries(values).forEach(([key, value]) => {
          if (value) {
            params.append(key, value);
          }
        });

        return params;
      }

      // Tab 切换功能
      function bindTabEvents() {
        const tabButtons = document.querySelectorAll('[role="tab"]');
        const tabPanels = document.querySelectorAll('[role="tabpanel"]');

        tabButtons.forEach(button => {
          button.addEventListener('click', () => {
            // 重置所有 tab 状态
            tabButtons.forEach(btn => {
              btn.setAttribute('data-active', 'false');
              btn.classList.remove('text-blue-600');
              btn.classList.add('text-gray-500');
            });

            // 重置所有面板
            tabPanels.forEach(panel => panel.classList.add('hidden'));

            // 激活当前 tab
            button.setAttribute('data-active', 'true');
            button.classList.remove('text-gray-500');
            button.classList.add('text-blue-600');

            // 显示对应面板
            const targetId = button.getAttribute('data-target');
            const targetPanel = document.getElementById(targetId);
            if (targetPanel) {
              targetPanel.classList.remove('hidden');
            }
          });
        });
      }

      // 复制功能
      function bindCopyEvents() {
        document.querySelectorAll('input[readonly]').forEach(input => {
          const copyButton = input.nextElementSibling;
          
          // 为输入框添加点击事件
          input.addEventListener('click', async () => {
            await copyToClipboard(input.value);
          });

          // 为复制按钮添加点击事件
          if (copyButton) {
            copyButton.addEventListener('click', async () => {
              await copyToClipboard(input.value);
            });
          }
        });
      }

      // 复制到剪贴板并显示提示
      async function copyToClipboard(text) {
        try {
          await navigator.clipboard.writeText(text);
          showToast('已复制到剪贴板!');
        } catch (err) {
          console.error('复制失败:', err);
          showToast('复制失败，请手动复制');
        }
      }

      // Toast 提示
      function showToast(message) {
        const toast = document.getElementById('toast');
        if (!toast) return;
        
        toast.textContent = message;
        toast.style.transform = 'translateY(0)';
        toast.style.opacity = '1';
        
        setTimeout(() => {
          toast.style.transform = 'translateY(100%)';
          toast.style.opacity = '0';
        }, 2000);
      }

      // 绑定所有事件监听器
      function bindEventListeners() {
        bindTabEvents();
        bindCopyEvents();
      }

      // 绑定表单提交事件
      badgeForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const values = getFormValues();
        const params = buildUrlParams(values);
        
        try {
          const response = await fetch(\`${previewUrl}?\${params.toString()}\`);
          const html = await response.text();

          badgeLinks.innerHTML = html;
          badgeLinks.classList.remove('hidden');

          // 使用 requestAnimationFrame 确保 DOM 已更新
          requestAnimationFrame(() => {
            bindEventListeners();
          });
        } catch (error) {
          console.error('Error fetching badge preview:', error);
        }
      });

      // 初始化事件监听
      document.addEventListener('DOMContentLoaded', bindEventListeners);
    })();
  </script>
  `;
    }
}

module.exports = BadgeGenerator;