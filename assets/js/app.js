
const AURORA_GRADIENT = "bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-700";

let state = {
    language: 'zh',
    theme: 'system',
    activeToolId: null,
    category: 'All',
    search: '',
    commandOpen: false
};
window.CMI_STATE = state;

function getTranslations() {
    return window.CMI_TRANSLATIONS[state.language];
}
window.getCurrentTranslations = getTranslations;

async function init() {
    // Load saved state
    const savedLang = localStorage.getItem('cmi_lang');
    if (savedLang) state.language = savedLang;

    const savedTheme = localStorage.getItem('cmi_theme');
    if (savedTheme) state.theme = savedTheme;

    applyTheme();

    // 使用 data.js 中的静态数据（已通过 script 标签加载）
    // 如果 Firebase 可用，尝试加载动态数据
    if (window.firebaseDB) {
        try {
            // 尝试从 Firestore 加载工具数据
            const toolsSnapshot = await firebaseDB.collection('tools').where('isActive', '==', true).get();
            if (!toolsSnapshot.empty) {
                const tools = [];
                toolsSnapshot.forEach(doc => {
                    tools.push({ id: doc.id, ...doc.data() });
                });
                window.CMI_TOOLS = tools;
                console.log('从 Firestore 加载了', tools.length, '个工具');
            }

            // 加载更新日志
            const changelogsSnapshot = await firebaseDB.collection('changelogs').orderBy('date', 'desc').get();
            if (!changelogsSnapshot.empty) {
                window.CMI_CHANGELOGS = [];
                changelogsSnapshot.forEach(doc => {
                    window.CMI_CHANGELOGS.push({ id: doc.id, ...doc.data() });
                });
            }

            // 加载设置
            const settingsDoc = await firebaseDB.collection('settings').doc('site').get();
            if (settingsDoc.exists) {
                window.CMI_SETTINGS = settingsDoc.data();
            }

            // 检查站点状态
            if (window.CMI_SETTINGS && window.CMI_SETTINGS.site_status === 'offline') {
                document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;font-size:2rem;color:#666;">网站维护中...</div>';
                return;
            }
        } catch (e) {
            console.warn("Firebase 数据加载失败，使用静态数据:", e);
        }
    }

    renderApp();

    // Entry Loader Timeout
    setTimeout(() => {
        const loader = document.getElementById('entry-loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.remove(), 700);
        }
    }, 800);

    // Event Listeners
    window.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            toggleCommandPalette();
        }
        if (e.key === 'Escape') {
            if (state.commandOpen) toggleCommandPalette(false);
            else if (state.activeToolId) closeTool();
        }
    });

    // Mobile check
    window.addEventListener('resize', renderApp);
}

function applyTheme() {
    const root = document.documentElement;
    const isDark = state.theme === 'dark' || (state.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) root.classList.add('dark');
    else root.classList.remove('dark');
}

function setLanguage(lang) {
    state.language = lang;
    localStorage.setItem('cmi_lang', lang);
    renderApp();
}

function setTheme(theme) {
    state.theme = theme;
    localStorage.setItem('cmi_theme', theme);
    applyTheme();
    renderApp();
}

function toggleCommandPalette(forceState) {
    state.commandOpen = forceState !== undefined ? forceState : !state.commandOpen;
    const palette = document.getElementById('command-palette');
    if (state.commandOpen) {
        palette.classList.remove('hidden');
        document.getElementById('cmd-input').focus();
    } else {
        palette.classList.add('hidden');
    }
}

function openTool(toolId) {
    const tool = window.CMI_TOOLS.find(t => t.id === toolId);
    if (!tool) return;

    if (tool.url) {
        window.open(tool.url, '_blank');
    } else {
        state.activeToolId = toolId;
        renderApp();
    }
}

function closeTool() {
    state.activeToolId = null;
    renderApp();
}

function renderApp() {
    const t = getTranslations();
    const appContainer = document.getElementById('app-root');

    // Render Header
    const btnEn = document.getElementById('header-lang-en');
    const btnZh = document.getElementById('header-lang-zh');
    if (btnEn) btnEn.className = `px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${state.language === 'en' ? 'bg-blue-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'}`;
    if (btnZh) btnZh.className = `px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${state.language === 'zh' ? 'bg-blue-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'}`;

    const subtitle = document.getElementById('header-subtitle');
    if (subtitle) {
        subtitle.innerText = state.language === 'zh' ? '细米兰阁 · 极效中枢' : 'Similan Pavilion Hub';
    }

    const btnPrivacy = document.getElementById('footer-btn-privacy');
    const btnTeam = document.getElementById('footer-btn-team');
    if (btnPrivacy) btnPrivacy.innerText = state.language === 'zh' ? '隐私政策' : 'Privacy';
    if (btnTeam) btnTeam.innerText = state.language === 'zh' ? '团队介绍' : 'Team Intro';

    // Render Main Content
    const main = document.getElementById('main-content');
    if (!main) return;

    if (state.activeToolId) {
        renderToolView(main, t);
    } else {
        renderGridView(main, t);
    }

    if (window.lucide) window.lucide.createIcons();
}

function renderGridView(container, t) {
    // Check if Hero exists (to avoid re-rendering input and losing focus)
    let hero = document.getElementById('main-hero');
    let gridContainer = document.getElementById('grid-container');

    if (!hero) {
        // First Time Render
        let html = `
        <div id="main-hero" class="text-center max-w-4xl mx-auto mb-10 md:mb-20 animate-fade-in-up">
          <div class="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] mb-6 md:mb-8">
            <i data-lucide="sparkles" size="12"></i><span>${state.language === 'zh' ? '智慧中枢导航' : 'THE INTELLIGENT HUB'}</span>
          </div>
          <h1 class="text-5xl md:text-9xl font-black text-zinc-900 dark:text-white mb-4 md:mb-6 tracking-tighter leading-[0.85] flex flex-col">
              <span>${state.language === 'zh' ? '细米兰阁' : 'Similan'}</span>
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600">${state.language === 'zh' ? '中枢导航' : 'Pavilion'}</span>
          </h1>
          <p class="text-zinc-500 dark:text-zinc-400 text-base md:text-xl font-medium max-w-xl mx-auto mb-10 md:mb-12 px-4">
              ${t.hero_subtitle}
          </p>
          
          <div class="relative group max-w-xl mx-auto mb-16">
            <div class="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-[2rem] blur opacity-10 group-hover:opacity-30 transition"></div>
            <div class="relative flex items-center bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-white/10 rounded-[1.8rem] px-8 py-5 shadow-2xl backdrop-blur-3xl">
              <i data-lucide="search" class="text-zinc-400 mr-4"></i>
              <input type="text" id="main-search" placeholder="${t.search_placeholder}" class="bg-transparent border-none outline-none flex-1 text-zinc-900 dark:text-white placeholder-zinc-300 dark:placeholder-zinc-700 text-xl font-semibold" value="${state.search}">
            </div>
          </div>
        </div>

        <!-- Categories -->
        <div id="categories-nav" class="mb-10 md:mb-16 flex justify-center overflow-x-auto no-scrollbar">
            <!-- Injected below -->
        </div>

        <div id="grid-container">
            <!-- Grid Injected Here -->
        </div>
        `;

        // Pre-append static sections (News & Partners) which are also conditional but usually static
        // For simplicity, we re-render them with the grid or separate. 
        // Let's add a footer container for them.
        html += `<div id="extra-sections"></div>`;

        container.innerHTML = html;

        // Bind Search Listener ONCE
        const searchInput = document.getElementById('main-search');
        if (searchInput) {
            searchInput.oninput = (e) => {
                state.search = e.target.value;
                renderGridView(container, t); // Re-call self to update grid only
            };
            searchInput.focus(); // Restore focus if needed
        }
    }

    // Always Update Categories (to show active state)
    const categories = [
        { id: 'All', label: t.categories.all },
        { id: 'Recommend', label: state.language === 'zh' ? '推荐' : 'Featured' },
        { id: 'International', label: state.language === 'zh' ? '国际' : 'Global' },
        { id: 'SmartUJS', label: state.language === 'zh' ? '智慧江大' : 'Smart UJS' },
        { id: 'Tool', label: t.categories.utility },
        { id: 'Info', label: state.language === 'zh' ? '信息' : 'Info' },
        { id: 'External', label: state.language === 'zh' ? '社交' : 'Social' },
    ];

    const catContainer = document.getElementById('categories-nav');
    if (catContainer) {
        let catHtml = `<div class="inline-flex p-1 rounded-2xl md:rounded-[1.8rem] bg-zinc-100/80 dark:bg-white/5 border border-zinc-200 dark:border-white/10 min-w-max">`;
        categories.forEach(cat => {
            const isActive = state.category === cat.id;
            catHtml += `<button onclick="setCategory('${cat.id}')" class="relative px-4 py-2.5 md:px-6 md:py-3 rounded-xl md:rounded-2xl text-[10px] md:text-[12px] font-black uppercase tracking-widest transition-all ${isActive ? 'text-white ' + AURORA_GRADIENT : 'text-zinc-500'}">${cat.label}</button>`;
        });
        catHtml += `</div>`;
        catContainer.innerHTML = catHtml;
    }

    // Always Update Grid
    const filtered = window.CMI_TOOLS.filter(tool => {
        if (tool.id === 'privacy-policy' || tool.id === 'team-introduction' || tool.id === 'admin-panel') return false;
        const nameMatch = tool.name[state.language]?.toLowerCase().includes(state.search.toLowerCase());
        const descMatch = tool.description[state.language]?.toLowerCase().includes(state.search.toLowerCase());
        const catMatch = state.category === 'All' || tool.category === state.category;
        return (nameMatch || descMatch) && catMatch;
    });

    let gridHtml = '';
    if (state.category === 'SmartUJS') {
        const grouped = {};
        filtered.forEach(tool => {
            const sub = tool.subCategory || 'Other';
            if (!grouped[sub]) grouped[sub] = [];
            grouped[sub].push(tool);
        });
        gridHtml += `<div class="space-y-20">`;
        for (const [sub, tools] of Object.entries(grouped)) {
            gridHtml += `
          <section class="animate-fade-in-up">
            <div class="flex items-center gap-4 mb-8">
               <div class="h-px flex-1 bg-zinc-200 dark:bg-white/10"></div>
               <h3 class="text-xs md:text-sm font-black uppercase tracking-[0.4em] text-zinc-400 dark:text-zinc-600 flex items-center gap-2"><i data-lucide="chevron-right" size="14" class="text-blue-500"></i> ${sub}</h3>
               <div class="h-px flex-1 bg-zinc-200 dark:bg-white/10"></div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
              ${tools.map(renderCard).join('')}
            </div>
          </section>
        `;
        }
        gridHtml += `</div>`;
    } else {
        gridHtml += `<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 animate-fade-in-up">${filtered.map(renderCard).join('')}</div>`;
    }

    document.getElementById('grid-container').innerHTML = gridHtml;

    // --- Partners and News sections (Update content too for language switch) ---
    const extra = document.getElementById('extra-sections');
    if (state.category === 'All' && !state.search) {
        const partners = ["云上江江团队", "ISAS 起零平台", "江苏大学土力学院团委", "雅和社区志愿服务站", "细米科技工作室", "英格科技"];

        extra.innerHTML = `
          <section id="section-news" class="mt-32 md:mt-48 p-8 md:p-20 rounded-[2.5rem] md:rounded-[4rem] bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200 dark:border-white/5 relative overflow-hidden group shadow-xl">
            <div class="absolute top-0 right-0 w-[400px] md:w-[600px] h-[400px] md:h-[600px] bg-blue-500/10 dark:bg-blue-600/20 blur-[100px] md:blur-[150px] -z-10 group-hover:scale-110 transition-transform duration-1000"></div>
            <div class="flex flex-col md:flex-row items-center gap-10 md:gap-12">
               <div class="flex-1 space-y-6 md:text-left text-center">
                  <h2 class="text-4xl md:text-5xl font-black tracking-tighter">${state.language === 'zh' ? '细米新闻' : 'CMI News'}</h2>
                  <p class="text-zinc-500 dark:text-zinc-400 text-sm md:text-lg leading-relaxed max-w-xl mx-auto md:mx-0">
                    ${state.language === 'zh' ? '获取 CMI 团队的最新动态、项目进展与重要公告。我们致力于为您提供第一手资讯。' : 'Get the latest updates, project progress and technical sharing from CMI Team.'}
                  </p>
                  <a href="https://www.cmiteam.top/index/mixinfo.html" target="_blank" class="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-blue-600 text-white font-black uppercase tracking-widest text-[10px] hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20">
                     ${state.language === 'zh' ? '前往新闻中心' : 'Enter News Center'} <i data-lucide="arrow-right" size="16"></i>
                  </a>
               </div>
               <div class="hidden md:flex flex-1 justify-center opacity-10 dark:opacity-30 group-hover:opacity-40 transition-opacity duration-1000">
                  <i data-lucide="newspaper" style="width: 180px; height: 180px;" stroke-width="0.5"></i>
               </div>
            </div>
          </section>

          <section id="section-partners" class="mt-32 md:mt-48 mb-20">
             <h2 class="text-center text-zinc-400 dark:text-zinc-600 font-black uppercase tracking-[0.4em] text-[10px] mb-12">${state.language === 'zh' ? '我们的合作伙伴' : 'STRATEGIC PARTNERS'}</h2>
             
             <div class="relative overflow-hidden w-full py-10 bg-zinc-100/50 dark:bg-white/5 rounded-[3rem] border border-zinc-200 dark:border-white/10">
               <div class="flex whitespace-nowrap animate-marquee">
                  ${[...partners, ...partners, ...partners].map(p => `
                    <div class="flex items-center mx-10 md:mx-20">
                      <span class="text-xl md:text-3xl font-black tracking-tighter text-zinc-400 dark:text-zinc-600 hover:text-blue-500 dark:hover:text-blue-400 transition-colors cursor-default whitespace-nowrap">
                        ${p}
                      </span>
                    </div>
                  `).join('')}
               </div>
               <div class="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-zinc-50 dark:from-black to-transparent z-10 pointer-events-none"></div>
               <div class="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-zinc-50 dark:from-black to-transparent z-10 pointer-events-none"></div>
             </div>
          </section>
        `;
        lucide.createIcons(); // Icons for extra setions
    } else {
        extra.innerHTML = '';
    }
}

function renderCard(tool) {
    const isSpecial = tool.category === 'Recommend';
    const name = tool.name[state.language];
    const desc = tool.description[state.language];

    return `
     <div onclick="openTool('${tool.id}')" class="group relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] backdrop-blur-xl p-5 md:p-8 flex flex-col justify-between transition-all duration-300 border ${isSpecial ? 'cursor-pointer border-blue-500/30 bg-blue-500/5 dark:bg-blue-500/5' : 'cursor-pointer border-zinc-200 dark:border-white/5 bg-white/40 dark:bg-zinc-900/40'} hover:shadow-2xl hover:border-blue-500/30 hover:-translate-y-1">
        <div class="relative z-10">
           <div class="flex justify-between items-start mb-4 md:mb-6">
              <div class="inline-flex items-center justify-center p-3 md:p-4 rounded-xl md:rounded-2xl ${isSpecial ? 'bg-blue-600 text-white shadow-lg' : 'bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-400'}">
                 <i data-lucide="${tool.icon}" size="22"></i>
              </div>
              <div class="flex gap-2">
                 ${tool.isBeta ? `<span class="px-2 py-0.5 rounded-lg bg-amber-500/10 text-amber-600 text-[8px] font-black uppercase tracking-widest border border-amber-500/20">Beta</span>` : ''}
              </div>
           </div>
           <h3 class="text-xl md:text-2xl font-black text-zinc-900 dark:text-white mb-2 md:mb-3 tracking-tighter leading-none">${name}</h3>
           <p class="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium line-clamp-2">${desc}</p>
        </div>
        <div class="relative z-10 flex items-center justify-between mt-4 md:mt-6">
           <div class="flex items-center gap-2">
              <span class="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 dark:text-zinc-500">${tool.category}</span>
           </div>
           <span class="text-[9px] md:text-[10px] font-bold text-zinc-300 dark:text-zinc-600 group-hover:text-blue-500 transition-colors uppercase tracking-widest">${tool.url ? 'Go' : 'Open'}</span>
        </div>
     </div>
   `;
}

function renderToolView(container, t) {
    const tool = window.CMI_TOOLS.find(t => t.id === state.activeToolId);
    if (!tool) return;

    container.innerHTML = `
    <div class="fixed inset-0 z-[100] md:relative md:inset-auto flex flex-col h-full md:min-h-[70vh] bg-zinc-50 dark:bg-black md:bg-transparent animate-fade-in">
       <div class="flex items-center justify-between p-6 md:p-0 md:mb-12 border-b md:border-none border-zinc-200 dark:border-white/5 bg-white/80 dark:bg-zinc-950/80 md:bg-transparent backdrop-blur-xl md:backdrop-blur-none">
          <button onclick="closeTool()" class="group flex items-center gap-3 md:gap-4 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-all">
             <div class="p-3 md:p-4 rounded-xl md:rounded-2xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 group-active:scale-90 transition-transform"><i data-lucide="chevron-left" size="24"></i></div>
             <span class="hidden md:inline text-xs font-black uppercase tracking-widest">${t.back_to_grid}</span>
          </button>
          <div class="flex items-center gap-4 md:gap-6">
             <div class="text-right">
                <h2 class="text-xl md:text-3xl font-black text-zinc-900 dark:text-white tracking-tighter mb-0.5 md:mb-1">${tool.name[state.language]}</h2>
                <p class="text-[9px] md:text-[10px] text-blue-500 font-black uppercase tracking-widest">${tool.category}</p>
             </div>
             <div class="p-3 md:p-5 rounded-xl md:rounded-2xl ${AURORA_GRADIENT} text-white shadow-xl"><i data-lucide="${tool.icon}" size="32"></i></div>
          </div>
       </div>
       <div class="flex-1 md:bg-white/70 md:dark:bg-zinc-950/40 md:border md:border-zinc-200 md:dark:border-white/5 md:rounded-[3rem] p-6 md:p-16 backdrop-blur-[80px] shadow-2xl relative overflow-y-auto no-scrollbar" id="tool-canvas">
          <!-- Tool Content Injected Here -->
       </div>
    </div>
  `;

    const canvas = document.getElementById('tool-canvas');
    if (window.ToolHandlers && window.ToolHandlers[tool.component]) {
        window.ToolHandlers[tool.component].render(canvas);
    } else {
        canvas.innerHTML = `<div class="flex items-center justify-center h-full text-zinc-400">Tool component not found: ${tool.component}</div>`;
    }
}

// Global Exports
window.setCategory = (cat) => { state.category = cat; renderApp(); };
window.initApp = init;
window.toggleCommandPalette = toggleCommandPalette;
window.setLanguage = setLanguage;
window.setTheme = setTheme;
window.openTool = openTool;
window.closeTool = closeTool;
