
window.ToolHandlers = {
    'json-formatter': {
        render: (container) => {
            const t = window.getCurrentTranslations().json;
            container.innerHTML = `
        <div class="flex flex-col h-full gap-6">
          <div class="flex items-center justify-between">
            <div class="flex gap-2">
              <button id="json-fmt-pretty" class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-colors shadow-lg shadow-blue-900/20">${t.prettify}</button>
              <button id="json-fmt-mini" class="px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-sm font-medium transition-colors border border-zinc-200 dark:border-white/5">${t.minify}</button>
            </div>
            <div class="flex gap-2">
              <button id="json-fmt-copy" class="p-2 rounded-lg bg-zinc-100 dark:bg-white/5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white"><i data-lucide="copy"></i></button>
              <button id="json-fmt-clear" class="p-2 rounded-lg bg-zinc-100 dark:bg-white/5 text-zinc-400 hover:text-red-500 hover:bg-red-400/10 transition-all"><i data-lucide="trash-2"></i></button>
            </div>
          </div>
          <div class="relative flex-1 min-h-[400px]">
            <textarea id="json-input" placeholder="${t.placeholder}" class="w-full h-full bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-white/5 rounded-2xl p-6 font-mono text-sm leading-relaxed text-zinc-900 dark:text-blue-100 placeholder-zinc-400 dark:placeholder-zinc-600 resize-none outline-none focus:border-blue-500/30 transition-all shadow-inner"></textarea>
            <div id="json-error" class="hidden absolute bottom-4 right-4 max-w-[300px] p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-500/30 text-red-600 dark:text-red-200 text-xs flex gap-3 backdrop-blur-md"></div>
          </div>
        </div>
      `;
            lucide.createIcons();

            const input = container.querySelector('#json-input');
            const errEl = container.querySelector('#json-error');

            const showError = (msg) => {
                errEl.textContent = msg;
                errEl.classList.remove('hidden');
                setTimeout(() => errEl.classList.add('hidden'), 3000);
            };

            container.querySelector('#json-fmt-pretty').onclick = () => {
                try {
                    if (!input.value.trim()) return;
                    const obj = JSON.parse(input.value);
                    input.value = JSON.stringify(obj, null, 2);
                } catch (e) { showError(e.message); }
            };

            container.querySelector('#json-fmt-mini').onclick = () => {
                try {
                    if (!input.value.trim()) return;
                    const obj = JSON.parse(input.value);
                    input.value = JSON.stringify(obj);
                } catch (e) { showError(e.message); }
            };

            container.querySelector('#json-fmt-copy').onclick = () => {
                navigator.clipboard.writeText(input.value);
                const btn = container.querySelector('#json-fmt-copy');
                btn.innerHTML = '<i data-lucide="check"></i>';
                lucide.createIcons();
                setTimeout(() => {
                    btn.innerHTML = '<i data-lucide="copy"></i>';
                    lucide.createIcons();
                }, 2000);
            };

            container.querySelector('#json-fmt-clear').onclick = () => {
                input.value = '';
                errEl.classList.add('hidden');
            };
        }
    },

    'image-base64': {
        render: (container) => {
            const t = window.getCurrentTranslations().image;
            let mode = 'encode'; // encode | decode

            const renderUI = () => {
                container.innerHTML = `
          <div class="flex flex-col gap-8 h-full">
            <div class="flex flex-col md:flex-row items-center justify-between gap-4">
              <div class="flex p-1 bg-zinc-100 dark:bg-white/5 rounded-2xl w-fit border border-zinc-200 dark:border-white/10">
                <button id="ib64-mode-encode" class="px-6 py-2 rounded-xl text-xs font-bold tracking-widest transition-all ${mode === 'encode' ? 'bg-blue-600 text-white shadow-lg' : 'text-zinc-500'}">${t.encode}</button>
                <button id="ib64-mode-decode" class="px-6 py-2 rounded-xl text-xs font-bold tracking-widest transition-all ${mode === 'decode' ? 'bg-blue-600 text-white shadow-lg' : 'text-zinc-500'}">${t.decode}</button>
              </div>
              <button id="ib64-clear" class="p-3 rounded-2xl bg-zinc-100 dark:bg-white/5 text-zinc-400 hover:text-red-500 border border-zinc-200 dark:border-white/10"><i data-lucide="eraser"></i></button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
              <div class="flex flex-col gap-4">
                <span class="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">${mode === 'encode' ? 'IMAGE INPUT' : 'BASE64 INPUT'}</span>
                ${mode === 'encode' ? `
                  <label class="relative flex-1 flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 dark:border-white/10 rounded-[2rem] cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-900/50 transition-all">
                    <input type="file" id="ib64-file" class="hidden" accept="image/*">
                    <div class="flex flex-col items-center gap-4 text-center px-6 py-12" id="ib64-drop-zone">
                      <div class="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500"><i data-lucide="image"></i></div>
                      <div><p class="font-bold text-lg dark:text-white">${t.drop}</p><p class="text-sm text-zinc-400">${t.browse}</p></div>
                    </div>
                    <div id="ib64-preview-overlay" class="hidden absolute inset-4 rounded-[1.5rem] overflow-hidden"><img id="ib64-preview-img" class="w-full h-full object-cover"></div>
                  </label>
                ` : `
                  <textarea id="ib64-text-input" placeholder="${t.paste_placeholder}" class="flex-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 rounded-[2rem] p-8 font-mono text-xs dark:text-blue-100 outline-none resize-none shadow-inner"></textarea>
                `}
              </div>

              <div class="flex flex-col gap-4">
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">${mode === 'encode' ? t.output : 'IMAGE PREVIEW'}</span>
                  <div class="flex gap-2">
                    ${mode === 'encode' ? `<button id="ib64-copy" class="p-2 rounded-xl bg-zinc-100 dark:bg-white/5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all"><i data-lucide="copy"></i></button>` : `<button id="ib64-download" class="hidden p-2 rounded-xl bg-blue-600 text-white shadow-lg"><i data-lucide="download"></i></button>`}
                  </div>
                </div>
                ${mode === 'encode' ? `
                  <textarea id="ib64-text-output" readonly class="flex-1 bg-zinc-100/50 dark:bg-zinc-950/80 border border-zinc-200 dark:border-white/5 rounded-[2rem] p-8 font-mono text-[11px] break-all text-zinc-500 resize-none shadow-inner"></textarea>
                ` : `
                  <div class="flex-1 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-white/10 rounded-[2rem] overflow-hidden flex items-center justify-center" id="ib64-preview-area">
                    <div class="flex flex-col items-center gap-3 text-zinc-300 dark:text-zinc-700">
                      <i data-lucide="image" size="64"></i>
                      <p class="text-xs font-bold uppercase tracking-widest">Waiting for input</p>
                    </div>
                  </div>
                `}
              </div>
            </div>
          </div>
        `;
                lucide.createIcons();
                attachEvents();
            };

            const attachEvents = () => {
                container.querySelector('#ib64-mode-encode').onclick = () => { mode = 'encode'; renderUI(); };
                container.querySelector('#ib64-mode-decode').onclick = () => { mode = 'decode'; renderUI(); };
                container.querySelector('#ib64-clear').onclick = () => { renderUI(); };

                if (mode === 'encode') {
                    const fileInput = container.querySelector('#ib64-file');
                    fileInput.onchange = (e) => {
                        const file = e.target.files[0];
                        if (file) {
                            const reader = new FileReader();
                            reader.onload = (rev) => {
                                const res = rev.target.result;
                                container.querySelector('#ib64-text-output').value = res;
                                container.querySelector('#ib64-preview-img').src = res;
                                container.querySelector('#ib64-preview-overlay').classList.remove('hidden');
                                container.querySelector('#ib64-drop-zone').classList.add('opacity-0');
                            };
                            reader.readAsDataURL(file);
                        }
                    };
                    container.querySelector('#ib64-copy').onclick = () => {
                        const val = container.querySelector('#ib64-text-output').value;
                        if (val) navigator.clipboard.writeText(val);
                    };
                } else {
                    const txtIn = container.querySelector('#ib64-text-input');
                    const dlBtn = container.querySelector('#ib64-download');
                    const previewArea = container.querySelector('#ib64-preview-area');

                    txtIn.oninput = (e) => {
                        const val = e.target.value;
                        if (val.startsWith('data:image')) {
                            previewArea.innerHTML = `<img src="${val}" class="max-w-full max-h-full object-contain">`;
                            dlBtn.classList.remove('hidden');
                            dlBtn.onclick = () => {
                                const a = document.createElement('a'); a.href = val; a.download = 'image.png'; a.click();
                            };
                        }
                    };
                }
            };

            renderUI();
        }
    },

    'random-gen-built': {
        render: (container) => {
            const t = window.getCurrentTranslations();
            container.innerHTML = `
        <div class="flex flex-col items-center justify-center h-full gap-8">
           <div class="text-9xl font-black text-zinc-900 dark:text-white tabular-nums tracking-tighter" id="rnd-display">0</div>
           <div class="flex gap-4 items-center bg-zinc-100 dark:bg-white/5 p-2 rounded-2xl border border-zinc-200 dark:border-white/10">
              <input type="number" id="rnd-min" value="0" class="w-20 bg-transparent text-center font-bold text-zinc-500 outline-none">
              <span class="text-zinc-300">to</span>
              <input type="number" id="rnd-max" value="100" class="w-20 bg-transparent text-center font-bold text-zinc-500 outline-none">
           </div>
           <button id="rnd-gen" class="px-12 py-4 rounded-2xl bg-blue-600 text-white font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-xl shadow-blue-500/20">Generate</button>
        </div>
      `;
            const display = container.querySelector('#rnd-display');
            container.querySelector('#rnd-gen').onclick = () => {
                const min = parseInt(container.querySelector('#rnd-min').value);
                const max = parseInt(container.querySelector('#rnd-max').value);
                const val = Math.floor(Math.random() * (max - min + 1)) + min;
                display.innerText = val;
                // TODO: Add simple animation logic if desired
            };
        }
    },

    'pomodoro-built': {
        render: (container) => {
            const t = window.getCurrentTranslations().pomodoro;
            let timeLeft = 25 * 60;
            let totalTime = 25 * 60;
            let isActive = false;
            let mode = 'work'; // work | break
            let timer = null;

            const updateDisplay = () => {
                const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
                const s = (timeLeft % 60).toString().padStart(2, '0');
                const display = container.querySelector('#pomo-time');
                if (display) display.innerText = `${m}:${s}`;

                // Circular progress
                const circle = container.querySelector('#pomo-circle');
                if (circle) {
                    const progress = (timeLeft / totalTime) * 100;
                    // 282.7 is 2*PI*45
                    const offset = 282.7 - (282.7 * progress) / 100;
                    circle.style.strokeDashoffset = `${offset}%`;
                    circle.style.stroke = mode === 'work' ? '#3b82f6' : '#10b981';
                }

                const label = container.querySelector('#pomo-label');
                if (label) {
                    label.innerText = mode === 'work' ? t.work : t.break;
                    label.className = `text-xs font-bold uppercase tracking-[0.3em] mt-3 ${mode === 'work' ? 'text-blue-500' : 'text-emerald-500'}`;
                }

                const startBtn = container.querySelector('#pomo-start');
                if (startBtn) {
                    startBtn.innerHTML = isActive ? `<i data-lucide="pause"></i> ${t.pause}` : `<i data-lucide="play"></i> ${t.start}`;
                    lucide.createIcons();
                }
            };

            container.innerHTML = `
        <div class="flex flex-col items-center gap-8 py-4">
           <div class="relative w-64 h-64 flex items-center justify-center">
             <svg class="absolute inset-0 w-full h-full -rotate-90">
                <circle cx="50%" cy="50%" r="45%" stroke="currentColor" stroke-width="8" fill="none" class="text-zinc-100 dark:text-zinc-800" />
                <circle id="pomo-circle" cx="50%" cy="50%" r="45%" stroke="#3b82f6" stroke-width="8" fill="none" stroke-dasharray="282.7%" stroke-linecap="round" class="transition-all duration-1000" />
             </svg>
             <div class="text-center z-10">
                <div id="pomo-time" class="text-6xl font-black text-zinc-900 dark:text-white tabular-nums">25:00</div>
                <div id="pomo-label" class="text-xs font-bold uppercase tracking-[0.3em] mt-3 text-blue-500">WORK</div>
             </div>
           </div>
           <div class="flex gap-4">
              <button id="pomo-start" class="px-8 py-3 rounded-2xl flex items-center gap-3 font-bold uppercase tracking-widest text-sm bg-blue-600 text-white shadow-xl shadow-blue-500/20 transition-all hover:scale-105 active:scale-95"></button>
              <button id="pomo-reset" class="p-3 rounded-2xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 text-zinc-500 hover:text-zinc-900 dark:hover:text-white"><i data-lucide="rotate-ccw"></i></button>
           </div>
        </div>
      `;
            lucide.createIcons();
            updateDisplay();

            container.querySelector('#pomo-start').onclick = () => {
                if (isActive) {
                    clearInterval(timer);
                    isActive = false;
                } else {
                    isActive = true;
                    timer = setInterval(() => {
                        timeLeft--;
                        if (timeLeft <= 0) {
                            clearInterval(timer);
                            isActive = false;
                            mode = mode === 'work' ? 'break' : 'work';
                            timeLeft = mode === 'work' ? 25 * 60 : 5 * 60;
                            totalTime = timeLeft;
                            // Play sound?
                        }
                        updateDisplay();
                    }, 1000);
                }
                updateDisplay();
            };

            container.querySelector('#pomo-reset').onclick = () => {
                clearInterval(timer);
                isActive = false;
                mode = 'work';
                timeLeft = 25 * 60;
                totalTime = 25 * 60;
                updateDisplay();
            };

            // Cleanup when unmounting handled by overwriting innerHTML in main app
        }
    },

    'digital-clock': {
        render: (container) => {
            container.innerHTML = `<div class="flex flex-col items-center justify-center h-full"><div id="clock-display" class="font-black text-5xl md:text-9xl text-zinc-900 dark:text-white tabular-nums tracking-tighter transition-all"></div><p id="clock-date" class="mt-4 font-bold text-zinc-400 uppercase tracking-widest"></p></div>`;
            const update = () => {
                if (!document.contains(container)) return;
                const now = new Date();
                container.querySelector('#clock-display').innerText = now.toLocaleTimeString([], { hour12: false });
                container.querySelector('#clock-date').innerText = now.toLocaleDateString();
                requestAnimationFrame(update);
            };
            update();
        }
    },

    'stopwatch-built': {
        render: (container) => {
            // Simple implementation
            let time = 0;
            let interval = null;
            let running = false;
            container.innerHTML = `
         <div class="flex flex-col items-center justify-center h-full gap-8">
            <div id="sw-time" class="text-7xl md:text-9xl font-mono text-zinc-900 dark:text-white">00:00.00</div>
            <div class="flex gap-4">
               <button id="sw-start" class="px-8 py-3 rounded-2xl bg-blue-600 text-white font-bold uppercase tracking-widest hover:scale-105 transition-all">Start</button>
               <button id="sw-reset" class="px-8 py-3 rounded-2xl bg-zinc-200 dark:bg-white/10 text-zinc-600 dark:text-zinc-300 font-bold uppercase tracking-widest hover:bg-zinc-300 transition-all">Reset</button>
            </div>
         </div>
       `;
            const display = container.querySelector('#sw-time');
            const fmt = (ms) => {
                const m = Math.floor(ms / 60000).toString().padStart(2, '0');
                const s = Math.floor((ms % 60000) / 1000).toString().padStart(2, '0');
                const cs = Math.floor((ms % 1000) / 10).toString().padStart(2, '0');
                return `${m}:${s}.${cs}`;
            };
            container.querySelector('#sw-start').onclick = (e) => {
                if (running) {
                    clearInterval(interval);
                    running = false;
                    e.target.innerText = "Start";
                    e.target.classList.replace('bg-amber-500', 'bg-blue-600');
                } else {
                    const start = Date.now() - time;
                    interval = setInterval(() => {
                        time = Date.now() - start;
                        display.innerText = fmt(time);
                    }, 10);
                    running = true;
                    e.target.innerText = "Pause";
                    e.target.classList.replace('bg-blue-600', 'bg-amber-500');
                }
            };
            container.querySelector('#sw-reset').onclick = () => {
                clearInterval(interval);
                running = false;
                time = 0;
                display.innerText = "00:00.00";
                const btn = container.querySelector('#sw-start');
                btn.innerText = "Start";
                btn.classList.replace('bg-amber-500', 'bg-blue-600');
            };
        }
    },

    'ascii-query': {
        render: (container) => {
            let html = `<div class="overflow-auto h-full"><table class="w-full text-left border-collapse">
         <thead><tr class="text-zinc-400 text-xs uppercase tracking-wider border-b border-zinc-200 dark:border-white/10"><th class="p-4">Decimal</th><th class="p-4">Hex</th><th class="p-4">Char</th><th class="p-4">Description</th></tr></thead>
         <tbody class="text-zinc-600 dark:text-zinc-300 text-sm font-mono">`;
            for (let i = 0; i < 128; i++) {
                let char = i >= 32 && i <= 126 ? String.fromCharCode(i) : '.';
                if (i === 32) char = 'Space';
                html += `<tr class="hover:bg-zinc-100 dark:hover:bg-white/5 border-b border-zinc-100 dark:border-white/5">
           <td class="p-3">${i}</td>
           <td class="p-3">0x${i.toString(16).toUpperCase().padStart(2, '0')}</td>
           <td class="p-3 text-blue-500 font-bold">${char}</td>
           <td class="p-3 opacity-50">ASCII Code ${i}</td>
         </tr>`;
            }
            html += `</tbody></table></div>`;
            container.innerHTML = html;
        }
    },

    'mindmap-gen': {
        render: (container) => {
            const box = `
         <div class="flex flex-col lg:flex-row gap-8 h-full">
           <div class="flex-1 flex flex-col gap-4">
              <span class="text-xs font-bold text-zinc-500 uppercase">Mermaid Syntax</span>
              <textarea id="mm-input" class="flex-1 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 font-mono text-sm dark:text-blue-100">content
  root((CMItool))
    Feature 1
    Feature 2</textarea>
              <button id="mm-render" class="p-3 bg-blue-600 text-white rounded-xl font-bold uppercase text-xs">Render</button>
           </div>
           <div class="flex-[2] bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/10 rounded-[2rem] p-8 flex items-center justify-center overflow-auto" id="mm-preview"></div>
         </div>
       `;
            container.innerHTML = box;
            const input = container.querySelector('#mm-input');
            const renderBtn = container.querySelector('#mm-render');
            const preview = container.querySelector('#mm-preview');

            renderBtn.onclick = async () => {
                if (window.mermaid) {
                    preview.innerHTML = '<div class="mermaid">' + input.value + '</div>';
                    try {
                        await mermaid.run({ nodes: [preview.querySelector('.mermaid')] });
                    } catch (e) {
                        preview.innerText = "Syntax Error";
                    }
                }
            };
            setTimeout(() => renderBtn.click(), 500); // Initial render
        }
    },

    'password-gen': {
        render: (container) => {
            const t = window.getCurrentTranslations().password;
            let length = 16;
            let includeNumbers = true;
            let includeSymbols = true;

            const generate = () => {
                const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ' +
                    (includeNumbers ? '0123456789' : '') +
                    (includeSymbols ? '!@#$%^&*()_+~`|}{[]:;?><,./-=' : '');
                let res = '';
                const array = new Uint32Array(length);
                window.crypto.getRandomValues(array);
                for (let i = 0; i < length; i++) {
                    res += charset[array[i] % charset.length];
                }
                const display = container.querySelector('#pw-display');
                if (display) display.innerText = res;
                updateStrength();
            };

            const updateStrength = () => {
                const label = container.querySelector('#pw-strength-label');
                const grade = length < 10 ? t.weak : (length < 16 ? t.medium : t.strong);
                const color = length < 10 ? 'text-red-500' : (length < 16 ? 'text-yellow-500' : 'text-emerald-500');
                if (label) {
                    label.innerText = grade;
                    label.className = `text-5xl font-black mt-2 tracking-tight ${color}`;
                }
            };

            const renderUI = () => {
                container.innerHTML = `
                    <div class="flex flex-col gap-8">
                        <div class="relative group">
                            <div class="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                            <div class="relative flex items-center bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-white/10 rounded-3xl p-6 shadow-xl">
                                <span id="pw-display" class="flex-1 font-mono text-xl md:text-2xl text-zinc-900 dark:text-white break-all tracking-tight tabular-nums"></span>
                                <div class="flex gap-2 shrink-0 ml-4">
                                    <button id="pw-refresh" class="p-3 rounded-2xl bg-zinc-100 dark:bg-white/5 hover:bg-zinc-200 dark:hover:bg-white/10 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all shadow-sm"><i data-lucide="refresh-cw"></i></button>
                                    <button id="pw-copy" class="p-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 active:scale-95 transition-all"><i data-lucide="copy"></i></button>
                                </div>
                            </div>
                        </div>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div class="space-y-6">
                                <div class="space-y-4">
                                    <div class="flex justify-between text-[10px] font-bold tracking-widest text-zinc-500 uppercase">
                                        <span>${t.length}</span>
                                        <span id="pw-len-val" class="text-blue-600 dark:text-blue-400">${length}</span>
                                    </div>
                                    <input type="range" id="pw-len-slider" min="8" max="64" value="${length}" class="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-blue-500">
                                </div>
                                <div class="flex flex-col gap-3">
                                    <label class="flex items-center justify-between p-4 rounded-2xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/5 cursor-pointer hover:bg-zinc-200 dark:hover:bg-white/10 transition-all shadow-sm">
                                        <span class="text-sm font-medium text-zinc-600 dark:text-zinc-400">${t.numbers}</span>
                                        <input type="checkbox" id="pw-num" ${includeNumbers ? 'checked' : ''} class="w-5 h-5 rounded-lg bg-zinc-200 dark:bg-zinc-800 border-zinc-300 dark:border-white/10 text-blue-500 focus:ring-blue-500">
                                    </label>
                                    <label class="flex items-center justify-between p-4 rounded-2xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/5 cursor-pointer hover:bg-zinc-200 dark:hover:bg-white/10 transition-all shadow-sm">
                                        <span class="text-sm font-medium text-zinc-600 dark:text-zinc-400">${t.symbols}</span>
                                        <input type="checkbox" id="pw-sym" ${includeSymbols ? 'checked' : ''} class="w-5 h-5 rounded-lg bg-zinc-200 dark:bg-zinc-800 border-zinc-300 dark:border-white/10 text-blue-500 focus:ring-blue-500">
                                    </label>
                                </div>
                            </div>
                            <div class="p-8 rounded-[2rem] bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 flex flex-col justify-center gap-4 shadow-inner">
                                <div class="text-center">
                                    <p class="text-[10px] text-zinc-500 uppercase tracking-widest font-black">${t.grade}</p>
                                    <p id="pw-strength-label" class="text-5xl font-black mt-2 tracking-tight"></p>
                                </div>
                                <p class="text-xs text-center text-zinc-400 dark:text-zinc-600 leading-relaxed font-medium">${t.disclaimer}</p>
                            </div>
                        </div>
                    </div>
                `;
                lucide.createIcons();

                const slider = container.querySelector('#pw-len-slider');
                slider.oninput = (e) => {
                    length = parseInt(e.target.value);
                    container.querySelector('#pw-len-val').innerText = length;
                    generate();
                };
                container.querySelector('#pw-num').onchange = (e) => { includeNumbers = e.target.checked; generate(); };
                container.querySelector('#pw-sym').onchange = (e) => { includeSymbols = e.target.checked; generate(); };
                container.querySelector('#pw-refresh').onclick = () => generate();
                container.querySelector('#pw-copy').onclick = () => {
                    navigator.clipboard.writeText(container.querySelector('#pw-display').innerText);
                    const btn = container.querySelector('#pw-copy');
                    btn.innerHTML = '<i data-lucide="check"></i>';
                    lucide.createIcons();
                    setTimeout(() => { btn.innerHTML = '<i data-lucide="copy"></i>'; lucide.createIcons(); }, 2000);
                };
                generate();
            };
            renderUI();
        }
    },

    'weather-tool': {
        render: (container) => {
            const t = window.getCurrentTranslations().weather;
            let city = localStorage.getItem('cmi_weather_city') || '';
            let loading = false;

            const renderUI = () => {
                container.innerHTML = `
                    <div class="flex flex-col gap-8 h-full relative">
                        ${!city ? `
                            <div class="absolute inset-0 z-20 flex items-center justify-center bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl rounded-[2rem]">
                                <div class="max-w-xs w-full p-8 text-center space-y-6">
                                    <div class="w-16 h-16 rounded-3xl bg-blue-500/10 text-blue-500 flex items-center justify-center mx-auto"><i data-lucide="map-pin"></i></div>
                                    <div><h3 class="text-xl font-black text-zinc-900 dark:text-white tracking-tight">${t.set_city}</h3><p class="text-xs text-zinc-500 mt-2">${t.enter_city}</p></div>
                                    <div class="relative">
                                        <input type="text" id="wt-city-in" placeholder="e.g. Shanghai" class="w-full bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-blue-500/50 transition-all text-sm font-medium">
                                        <button id="wt-city-set" class="absolute right-2 top-2 bottom-2 px-4 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all"><i data-lucide="send"></i></button>
                                    </div>
                                </div>
                            </div>
                        ` : ''}

                        <div class="flex justify-between items-center">
                            <div class="flex items-center gap-3">
                                <div class="p-3 rounded-2xl bg-blue-500/10 text-blue-500 cursor-pointer" onclick="localStorage.removeItem('cmi_weather_city'); location.reload();"><i data-lucide="map-pin"></i></div>
                                <div><h3 class="text-2xl font-black text-zinc-900 dark:text-white leading-none">${city || '---'}</h3><p class="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Similan Station</p></div>
                            </div>
                            <button id="wt-refresh" class="p-3 rounded-2xl bg-zinc-100 dark:bg-white/5 text-zinc-400 border border-zinc-200 dark:border-white/10 transition-all"><i data-lucide="refresh-cw"></i></button>
                        </div>

                        <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div class="flex flex-col items-center justify-center p-12 rounded-[3rem] bg-gradient-to-br from-blue-500/10 to-indigo-500/5 border border-blue-500/20 shadow-inner">
                                <div class="text-blue-500 mb-6" id="wt-icon-box"><i data-lucide="sun" size="80"></i></div>
                                <span class="text-7xl font-black text-zinc-900 dark:text-white tracking-tighter tabular-nums" id="wt-temp">1.1<span class="text-blue-500">°</span></span>
                                <p class="text-sm font-bold text-zinc-400 uppercase tracking-[0.4em] mt-4" id="wt-cond">CLEAR</p>
                            </div>
                            <div class="grid grid-cols-2 gap-4">
                                <div class="p-6 rounded-[2rem] bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 flex flex-col gap-4">
                                    <i data-lucide="wind" class="text-zinc-400"></i>
                                    <div><p class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">${t.wind}</p><p class="text-lg font-black text-zinc-900 dark:text-white">North 1</p></div>
                                </div>
                                <div class="p-6 rounded-[2rem] bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 flex flex-col gap-4">
                                    <i data-lucide="droplets" class="text-zinc-400"></i>
                                    <div><p class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">${t.humidity}</p><p class="text-lg font-black text-zinc-900 dark:text-white">45%</p></div>
                                </div>
                                <div class="col-span-2 p-6 rounded-[2rem] bg-amber-500/5 border border-amber-500/20 flex items-center gap-6">
                                    <div class="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0"><i data-lucide="alert-triangle"></i></div>
                                    <div><p class="text-[10px] font-bold text-amber-500 uppercase tracking-widest">${t.warning}</p><p class="text-sm font-medium text-zinc-600 dark:text-zinc-400">No active warnings.</p></div>
                                </div>
                            </div>
                        </div>
                        <div class="flex items-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest"><div class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>${t.update}</div>
                    </div>
                `;
                lucide.createIcons();
                if (!city) {
                    container.querySelector('#wt-city-set').onclick = () => {
                        const val = container.querySelector('#wt-city-in').value.trim();
                        if (val) { city = val; localStorage.setItem('cmi_weather_city', val); renderUI(); }
                    };
                }
            };
            renderUI();
        }
    },

    'text-util': {
        render: (container) => {
            const t = window.getCurrentTranslations().text;
            const renderUI = () => {
                container.innerHTML = `
                    <div class="flex flex-col gap-6">
                        <textarea id="tu-input" placeholder="${t.placeholder}" class="w-full h-48 bg-zinc-50 dark:bg-zinc-950/50 border border-zinc-200 dark:border-white/5 rounded-3xl p-6 font-medium text-lg leading-relaxed text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-700 resize-none outline-none focus:border-blue-500/30 transition-all shadow-inner"></textarea>
                        <div class="grid grid-cols-2 sm:grid-cols-5 gap-3">
                            <button data-type="upper" class="tu-btn px-3 py-2.5 rounded-2xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/5 text-[10px] font-bold text-zinc-600 dark:text-zinc-300 transition-all active:scale-95">UPPERCASE</button>
                            <button data-type="lower" class="tu-btn px-3 py-2.5 rounded-2xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/5 text-[10px] font-bold text-zinc-600 dark:text-zinc-300 transition-all active:scale-95">lowercase</button>
                            <button data-type="title" class="tu-btn px-3 py-2.5 rounded-2xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/5 text-[10px] font-bold text-zinc-600 dark:text-zinc-300 transition-all active:scale-95">Title Case</button>
                            <button data-type="camel" class="tu-btn px-3 py-2.5 rounded-2xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/5 text-[10px] font-bold text-zinc-600 dark:text-zinc-300 transition-all active:scale-95">camelCase</button>
                            <button data-type="snake" class="tu-btn px-3 py-2.5 rounded-2xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/5 text-[10px] font-bold text-zinc-600 dark:text-zinc-300 transition-all active:scale-95">snake_case</button>
                        </div>
                        <div class="flex items-center justify-between p-6 rounded-3xl bg-zinc-100 dark:bg-zinc-900/50 border border-zinc-200 dark:border-white/5 shadow-sm">
                            <div class="flex gap-8">
                                <div class="text-xs">
                                    <span class="text-zinc-500 block font-bold uppercase tracking-widest text-[10px] mb-1">${t.chars}</span>
                                    <span id="tu-chars" class="text-zinc-900 dark:text-white font-mono font-bold text-lg">0</span>
                                </div>
                                <div class="text-xs">
                                    <span class="text-zinc-500 block font-bold uppercase tracking-widest text-[10px] mb-1">${t.words}</span>
                                    <span id="tu-words" class="text-zinc-900 dark:text-white font-mono font-bold text-lg">0</span>
                                </div>
                            </div>
                            <button id="tu-copy" class="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 transition-colors"><i data-lucide="copy" size="16"></i> ${t.copy_result}</button>
                        </div>
                    </div>
                `;
                lucide.createIcons();
                const input = container.querySelector('#tu-input');
                const charEl = container.querySelector('#tu-chars');
                const wordEl = container.querySelector('#tu-words');

                input.oninput = () => {
                    charEl.innerText = input.value.length;
                    wordEl.innerText = input.value.trim() ? input.value.trim().split(/\s+/).length : 0;
                };

                container.querySelectorAll('.tu-btn').forEach(btn => {
                    btn.onclick = () => {
                        const type = btn.dataset.type;
                        let text = input.value;
                        if (type === 'upper') text = text.toUpperCase();
                        else if (type === 'lower') text = text.toLowerCase();
                        else if (type === 'title') text = text.toLowerCase().split(' ').map(s => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
                        else if (type === 'camel') text = text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
                        else if (type === 'snake') text = text.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)?.map(x => x.toLowerCase()).join('_') || '';
                        input.value = text;
                        input.oninput();
                    };
                });

                container.querySelector('#tu-copy').onclick = () => {
                    navigator.clipboard.writeText(input.value);
                    const btn = container.querySelector('#tu-copy');
                    btn.innerHTML = '<i data-lucide="check"></i> COPIED';
                    lucide.createIcons();
                    setTimeout(() => { btn.innerHTML = `<i data-lucide="copy"></i> ${t.copy_result}`; lucide.createIcons(); }, 2000);
                };
            };
            renderUI();
        }
    },

    'epic-games-tool': {
        render: (container) => {
            const t = window.getCurrentTranslations().epic;
            const games = [
                { title: "Bloons TD 6", desc: "Massive 3D tower defense game.", image: "https://cdn1.epicgames.com/offer/1jl6n/bloons-td-6-offer-1jl6n.jpg", status: "coming_soon", price: "¥42.00", date: "01/09 - 01/16" },
                { title: "Ghostrunner 2", desc: "Cyberpunk slasher.", image: "https://cdn1.epicgames.com/offer/Ghostrunner2/EGS_Ghostrunner2_OneMoreLevel_S1_2560x1440-15845148fae1d0cfd7f3e98c9b3ba6ba", status: "free_now", price: "¥169.00", date: "12/12 - 01/09" }
            ];
            container.innerHTML = `
                <div class="flex flex-col gap-8 h-full">
                    <div class="flex items-center gap-3">
                        <div class="p-3 rounded-2xl bg-indigo-600 text-white"><i data-lucide="gamepad-2"></i></div>
                        <div><h3 class="text-2xl font-black text-zinc-900 dark:text-white leading-none">${t.title}</h3><p class="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Weekly Store Updates</p></div>
                    </div>
                    <div class="flex-1 overflow-auto space-y-6">
                        ${games.map(game => `
                            <div class="group relative flex flex-col md:flex-row gap-6 p-4 rounded-[2.5rem] bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 hover:border-indigo-500/30 transition-all shadow-sm">
                                <div class="w-full md:w-64 h-40 rounded-[1.8rem] overflow-hidden shrink-0"><img src="${game.image}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"></div>
                                <div class="flex-1 flex flex-col justify-between py-2">
                                    <div>
                                        <div class="flex items-center gap-3 mb-2">
                                            <span class="px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${game.status === 'free_now' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 border-amber-500/20'}">${t[game.status]}</span>
                                            <span class="text-[10px] font-bold text-zinc-400">${game.date}</span>
                                        </div>
                                        <h4 class="text-xl font-black text-zinc-900 dark:text-white tracking-tight">${game.title}</h4>
                                        <p class="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 mt-2 leading-relaxed">${game.desc}</p>
                                    </div>
                                    <div class="flex items-center justify-between mt-4">
                                        <div class="flex flex-col"><span class="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">${t.original_price}</span><span class="text-lg font-black text-zinc-900 dark:text-white line-through decoration-zinc-500/50">${game.price}</span></div>
                                        <button class="px-6 py-2 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-black text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2"><i data-lucide="shopping-bag" size="14"></i> Get</button>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            lucide.createIcons();
        }
    },

    'update-log': {
        render: (container) => {
            const t = window.getCurrentTranslations().changelog;
            const logs = window.CMI_CHANGELOGS || [];

            let html = `
                <div class="flex flex-col gap-8 h-full">
                    <div class="text-center max-w-2xl mx-auto">
                        <h3 class="text-4xl font-black text-zinc-900 dark:text-white tracking-tighter mb-4">${t.title}</h3>
                        <p class="text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">${t.subtitle}</p>
                    </div>
                    <div class="flex-1 overflow-auto pr-2 space-y-12 py-6 no-scrollbar">
            `;

            logs.forEach((log, idx) => {
                html += `
                    <div class="relative pl-12 before:absolute before:left-4 before:top-2 before:bottom-[-48px] before:w-[2px] before:bg-zinc-200 dark:before:bg-white/5 last:before:hidden">
                        <div class="absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center border-4 border-white dark:border-zinc-950 z-10 ${log.type === 'Major' ? 'bg-blue-600 text-white' : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'}">
                            <i data-lucide="${log.type === 'Major' ? 'rocket' : (log.type === 'Update' ? 'zap' : 'check-circle-2')}" size="14"></i>
                        </div>
                        <div class="space-y-4">
                            <div class="flex items-center gap-4">
                                <span class="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter">v${log.version}</span>
                                <span class="px-2 py-1 rounded-lg bg-zinc-100 dark:bg-white/5 text-zinc-400 text-[10px] font-bold uppercase tracking-widest">${t.release_date} ${log.date}</span>
                            </div>
                            <div class="p-8 rounded-[2.5rem] bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 shadow-sm transition-all ${log.version === '6.0' ? 'border-blue-500/30' : ''}">
                                <h4 class="text-lg font-black mb-4 uppercase tracking-wider text-zinc-700 dark:text-zinc-300">${log.title[window.CMI_STATE.language]}</h4>
                                <ul class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                                    ${log.items.map(item => `
                                        <li class="flex gap-3 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed group">
                                            <div class="mt-1.5 w-1 h-1 rounded-full bg-blue-500 shrink-0 opacity-40 group-hover:opacity-100 transition-opacity"></div>
                                            ${item}
                                        </li>
                                    `).join('')}
                                </ul>
                            </div>
                        </div>
                    </div>
                `;
            });

            html += `</div></div>`;
            container.innerHTML = html;
            lucide.createIcons();
        }
    },

    'message-board': {
        render: async (container) => {
            const settings = window.CMI_SETTINGS || {};
            const boardStatus = settings['board_status'] || 'enabled';

            if (boardStatus !== 'enabled') {
                container.innerHTML = `
                    <div class="flex flex-col items-center justify-center h-full text-zinc-500">
                        <i data-lucide="lock" size="48" class="mb-4 text-zinc-300 dark:text-zinc-700"></i>
                        <h3 class="text-xl font-black uppercase tracking-widest mb-2">Message Board Closed</h3>
                        <p class="text-xs">该功能目前已关闭</p>
                    </div>
                 `;
                lucide.createIcons();
                return;
            }

            const user = window.currentUser;
            const isLoggedIn = !!user;

            container.innerHTML = `
                <div class="h-full flex flex-col max-w-2xl mx-auto">
                    <div class="flex-1 overflow-y-auto space-y-4 pr-2 mb-6 no-scrollbar" id="mb-list">
                        <div class="text-center text-zinc-400 py-10 text-xs font-black uppercase tracking-widest">
                            <i data-lucide="loader-2" class="animate-spin inline-block mr-2"></i> Loading messages...
                        </div>
                    </div>
                    ${isLoggedIn ? `
                    <div class="bg-zinc-100 dark:bg-white/5 p-4 rounded-[2rem] border border-zinc-200 dark:border-white/10 flex gap-4">
                        <input type="text" id="mb-input" class="flex-1 bg-transparent border-none outline-none font-medium px-4" placeholder="输入留言内容..." maxlength="140">
                        <button id="mb-send" class="p-4 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all"><i data-lucide="send" size="20"></i></button>
                    </div>
                    ` : `
                    <div class="bg-zinc-100 dark:bg-white/5 p-4 rounded-[2rem] border border-zinc-200 dark:border-white/10 text-center">
                        <p class="text-sm text-zinc-500">请先 <a href="javascript:void(0)" onclick="showLoginModal()" class="text-blue-500 font-bold hover:underline">登录</a> 后留言</p>
                    </div>
                    `}
                </div>
            `;

            lucide.createIcons();

            const list = container.querySelector('#mb-list');

            // 从 Firestore 加载留言
            async function loadMessages() {
                try {
                    const snapshot = await firebaseDB.collection('messages')
                        .orderBy('createdAt', 'desc')
                        .get();

                    const messages = [];
                    snapshot.forEach(doc => {
                        messages.push({ id: doc.id, ...doc.data() });
                    });

                    // 限制显示最近 50 条
                    const displayMessages = messages.slice(0, 50);

                    if (displayMessages.length === 0) {
                        list.innerHTML = `<div class="text-center text-zinc-400 py-10 text-xs font-black uppercase tracking-widest">暂无留言，快来抢沙发吧！</div>`;
                    } else {
                        list.innerHTML = displayMessages.map(m => `
                            <div class="flex flex-col gap-1 p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-white/5 shadow-sm">
                                <div class="flex items-center justify-between">
                                    <span class="text-[10px] font-black uppercase tracking-widest ${m.isAdmin ? 'text-blue-500' : 'text-zinc-500'}">${m.username || 'Anonymous'} ${m.isAdmin ? '<i data-lucide="badge-check" size="10" class="inline"></i>' : ''}</span>
                                    <span class="text-[9px] text-zinc-300 font-mono">${m.createdAt ? new Date(m.createdAt.toDate()).toLocaleDateString() : 'Just now'}</span>
                                </div>
                                <p class="text-sm font-medium text-zinc-700 dark:text-zinc-300 break-all">${m.content}</p>
                            </div>
                        `).join('');
                        lucide.createIcons();
                    }
                } catch (e) {
                    console.error('加载留言失败:', e);
                    list.innerHTML = `<div class="text-center text-red-400 py-10 text-xs">加载失败，请刷新重试</div>`;
                }
            }

            // 初始加载
            await loadMessages();

            // 如果已登录，绑定发送功能
            if (isLoggedIn) {
                const submitBtn = container.querySelector('#mb-send');
                const input = container.querySelector('#mb-input');

                const submitMsg = async () => {
                    const content = input.value.trim();
                    if (!content) return;

                    submitBtn.disabled = true;
                    submitBtn.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i>';
                    lucide.createIcons();

                    try {
                        // 获取用户信息
                        const userDoc = await firebaseDB.collection('users').doc(user.uid).get();
                        const userData = userDoc.exists ? userDoc.data() : {};
                        const isAdmin = userData.role === 'admin';

                        // 保存到 Firestore
                        await firebaseDB.collection('messages').add({
                            userId: user.uid,
                            username: user.displayName || user.email.split('@')[0],
                            content: content,
                            isAdmin: isAdmin,
                            createdAt: firebase.firestore.FieldValue.serverTimestamp()
                        });

                        input.value = '';

                        // 重新加载留言列表
                        await loadMessages();

                    } catch (e) {
                        console.error('发送留言失败:', e);
                        alert('发送失败: ' + e.message);
                    } finally {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = '<i data-lucide="send" size="20"></i>';
                        lucide.createIcons();
                    }
                };

                submitBtn.onclick = submitMsg;
                input.onkeydown = (e) => { if (e.key === 'Enter') submitMsg(); };
            }
        }
    },

    'digital-clock': {
        render: (container) => {
            let styleIndex = 0;
            const styles = [
                { name: 'Quantum', class: 'font-black tracking-tighter' },
                { name: 'Terminal', class: 'font-mono tracking-widest' },
                { name: 'Neon', class: 'font-black tracking-widest drop-shadow-[0_0_10px_rgba(59,130,246,0.8)] text-blue-500' },
                { name: 'Retro', class: 'font-mono text-amber-500 drop-shadow-[0_0_5px_rgba(245,158,11,0.5)]' },
                { name: 'Elegant', class: 'font-serif italic tracking-wide' },
                { name: 'Matrix', class: 'font-mono text-green-500 tracking-widest' },
                { name: 'Outline', class: 'font-black text-transparent bg-clip-text bg-gradient-to-r from-zinc-500 to-zinc-500 stroke-2 stroke-white' },
                { name: 'Gradient', class: 'font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500' },
                { name: 'Minimal', class: 'font-thin tracking-[0.2em]' },
                { name: 'Bold', class: 'font-black tracking-tight text-zinc-900 dark:text-white' },
                { name: 'Glitch', class: 'font-black tracking-tighter animate-pulse' },
                { name: 'LCD', class: 'font-mono text-red-500 tracking-widest' },
            ];

            container.innerHTML = `
                <div class="flex flex-col items-center justify-center h-full relative group">
                    <div id="clock-wrapper" class="text-center transition-all duration-300 p-8 rounded-3xl">
                        <div id="clock-display" class="text-5xl md:text-9xl tabular-nums transition-all ${styles[0].class} text-zinc-900 dark:text-white"></div>
                        <p id="clock-date" class="mt-4 font-bold text-zinc-400 uppercase tracking-widest text-lg"></p>
                    </div>
                    
                    <div class="absolute bottom-0 left-0 right-0 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex-wrap">
                        ${styles.map((s, i) => `<button data-idx="${i}" class="style-btn px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border border-zinc-200 dark:border-white/10 hover:bg-zinc-100 dark:hover:bg-white/10 ${i === 0 ? 'bg-zinc-100 dark:bg-white/10' : ''}">${s.name}</button>`).join('')}
                    </div>
                </div>
            `;

            const display = container.querySelector('#clock-display');
            const dateDisplay = container.querySelector('#clock-date');
            const btns = container.querySelectorAll('.style-btn');

            btns.forEach(btn => {
                btn.onclick = () => {
                    const idx = parseInt(btn.dataset.idx);
                    styleIndex = idx;
                    display.className = `text-5xl md:text-9xl tabular-nums transition-all ${styles[idx].class}`;
                    if (!styles[idx].class.includes('text-')) {
                        display.classList.add('text-zinc-900', 'dark:text-white');
                    }
                    btns.forEach(b => b.classList.remove('bg-zinc-100', 'dark:bg-white/10'));
                    btn.classList.add('bg-zinc-100', 'dark:bg-white/10');
                };
            });

            const update = () => {
                if (!document.contains(container)) return;
                const now = new Date();
                display.innerText = now.toLocaleTimeString([], { hour12: false });
                dateDisplay.innerText = now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                requestAnimationFrame(update);
            };
            update();
        }
    },

    'team-introduction': {
        render: (container) => {
            const settings = window.CMI_SETTINGS || {};
            const lang = window.CMI_STATE.language;
            const intro = settings['team_intro_' + lang] || 'CMI Team...';

            container.innerHTML = `
                <div class="prose prose-zinc dark:prose-invert max-w-none text-center">
                    <div class="w-20 h-20 rounded-3xl bg-blue-600 flex items-center justify-center text-white mx-auto mb-8 shadow-2xl shadow-blue-500/20"><i data-lucide="users" size="40"></i></div>
                    <h2 class="text-4xl font-black mb-4">${lang === 'zh' ? '团队介绍' : 'About Team'}</h2>
                    <div class="space-y-6 text-lg text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed max-w-2xl mx-auto">
                        <p>${intro}</p>
                    </div>
                </div>
            `;
            lucide.createIcons();
        }
    },

    'privacy-policy': {
        render: (container) => {
            container.innerHTML = `
                <div class="prose prose-zinc dark:prose-invert max-w-none">
                    <h2 class="text-3xl font-black mb-6">隐私政策 / Privacy Policy</h2>
                    <div class="space-y-4 text-zinc-600 dark:text-zinc-400">
                        <p><strong>1. 数据本地化：</strong> CMItool 2.0 采用纯前端架构。您在站内使用的所有工具（如 JSON 格式化、密码生成、图片 Base64 转换等）均在您的浏览器本地运行。您的原始数据绝不会被上传至任何服务器。</p>
                        <p><strong>2. 零存储策略：</strong> 我们不设立数据库，不记录您的任何个人信息、输入记录或搜索偏好。所有的处理结果仅存在于您的内存中，页面刷新后即消失。</p>
                    </div>
                </div>
            `;
        }
    }
};
