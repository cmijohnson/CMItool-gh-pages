
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

    'admin-panel': {
        render: async (container) => {
            // 检查权限
            if (!window.currentUser || window.currentUserRole !== 'admin') {
                container.innerHTML = `
                    <div class="flex flex-col items-center justify-center h-full text-zinc-500">
                        <i data-lucide="shield-off" size="48" class="mb-4 text-red-300 dark:text-red-700"></i>
                        <h3 class="text-xl font-black uppercase tracking-widest mb-2">Access Denied</h3>
                        <p class="text-xs">您没有管理员权限</p>
                    </div>
                `;
                lucide.createIcons();
                return;
            }

            // 当前标签页
            let currentTab = 'dashboard';

            container.innerHTML = `
                <div class="max-w-6xl mx-auto">
                    <!-- Header -->
                    <div class="flex items-center gap-4 mb-8">
                        <div class="p-4 rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-500/20">
                            <i data-lucide="shield-check" size="32"></i>
                        </div>
                        <div>
                            <h2 class="text-3xl font-black text-zinc-900 dark:text-white">管理后台</h2>
                            <p class="text-sm text-zinc-500">Admin Dashboard</p>
                        </div>
                    </div>

                    <!-- Tabs -->
                    <div class="flex gap-2 mb-8 overflow-x-auto no-scrollbar pb-2">
                        <button onclick="switchAdminTab('dashboard')" class="admin-tab px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all bg-blue-600 text-white" data-tab="dashboard">
                            <i data-lucide="layout-dashboard" size="14" class="inline mr-1"></i> 仪表盘
                        </button>
                        <button onclick="switchAdminTab('users')" class="admin-tab px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all bg-zinc-100 dark:bg-white/5 text-zinc-500" data-tab="users">
                            <i data-lucide="users" size="14" class="inline mr-1"></i> 用户管理
                        </button>
                        <button onclick="switchAdminTab('tools')" class="admin-tab px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all bg-zinc-100 dark:bg-white/5 text-zinc-500" data-tab="tools">
                            <i data-lucide="wrench" size="14" class="inline mr-1"></i> 工具管理
                        </button>
                        <button onclick="switchAdminTab('messages')" class="admin-tab px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all bg-zinc-100 dark:bg-white/5 text-zinc-500" data-tab="messages">
                            <i data-lucide="message-square" size="14" class="inline mr-1"></i> 留言管理
                        </button>
                        <button onclick="switchAdminTab('changelogs')" class="admin-tab px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all bg-zinc-100 dark:bg-white/5 text-zinc-500" data-tab="changelogs">
                            <i data-lucide="history" size="14" class="inline mr-1"></i> 更新日志
                        </button>
                        <button onclick="switchAdminTab('settings')" class="admin-tab px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all bg-zinc-100 dark:bg-white/5 text-zinc-500" data-tab="settings">
                            <i data-lucide="settings" size="14" class="inline mr-1"></i> 系统设置
                        </button>
                        <button onclick="switchAdminTab('invitations')" class="admin-tab px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all bg-zinc-100 dark:bg-white/5 text-zinc-500" data-tab="invitations">
                            <i data-lucide="ticket" size="14" class="inline mr-1"></i> 邀请码
                        </button>
                    </div>

                    <!-- Tab Content -->
                    <div id="admin-tab-content">
                        <!-- 内容由 JS 动态加载 -->
                    </div>
                </div>
            `;

            lucide.createIcons();

            // 切换标签页
            window.switchAdminTab = async (tab) => {
                currentTab = tab;

                // 更新标签样式
                document.querySelectorAll('.admin-tab').forEach(btn => {
                    if (btn.dataset.tab === tab) {
                        btn.className = 'admin-tab px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all bg-blue-600 text-white';
                    } else {
                        btn.className = 'admin-tab px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all bg-zinc-100 dark:bg-white/5 text-zinc-500';
                    }
                });

                // 加载内容
                const content = document.getElementById('admin-tab-content');
                switch (tab) {
                    case 'dashboard':
                        await renderDashboard(content);
                        break;
                    case 'users':
                        await renderUsers(content);
                        break;
                    case 'tools':
                        await renderTools(content);
                        break;
                    case 'messages':
                        await renderMessages(content);
                        break;
                    case 'changelogs':
                        await renderChangelogs(content);
                        break;
                    case 'settings':
                        await renderSettings(content);
                        break;
                    case 'invitations':
                        await renderInvitations(content);
                        break;
                }
            };

            // 仪表盘
            async function renderDashboard(container) {
                container.innerHTML = `
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div class="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 shadow-sm">
                            <div class="flex items-center gap-3 mb-2">
                                <i data-lucide="users" size="20" class="text-blue-500"></i>
                                <span class="text-xs font-bold text-zinc-500 uppercase tracking-widest">用户总数</span>
                            </div>
                            <div id="stat-users" class="text-3xl font-black text-zinc-900 dark:text-white">-</div>
                        </div>
                        <div class="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 shadow-sm">
                            <div class="flex items-center gap-3 mb-2">
                                <i data-lucide="message-square" size="20" class="text-green-500"></i>
                                <span class="text-xs font-bold text-zinc-500 uppercase tracking-widest">留言总数</span>
                            </div>
                            <div id="stat-messages" class="text-3xl font-black text-zinc-900 dark:text-white">-</div>
                        </div>
                        <div class="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 shadow-sm">
                            <div class="flex items-center gap-3 mb-2">
                                <i data-lucide="wrench" size="20" class="text-purple-500"></i>
                                <span class="text-xs font-bold text-zinc-500 uppercase tracking-widest">工具总数</span>
                            </div>
                            <div id="stat-tools" class="text-3xl font-black text-zinc-900 dark:text-white">-</div>
                        </div>
                        <div class="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 shadow-sm">
                            <div class="flex items-center gap-3 mb-2">
                                <i data-lucide="ticket" size="20" class="text-orange-500"></i>
                                <span class="text-xs font-bold text-zinc-500 uppercase tracking-widest">邀请码</span>
                            </div>
                            <div id="stat-invitations" class="text-3xl font-black text-zinc-900 dark:text-white">-</div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <!-- 最近用户 -->
                        <div class="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-white/10 shadow-sm overflow-hidden">
                            <div class="p-6 border-b border-zinc-200 dark:border-white/10">
                                <h3 class="text-lg font-black text-zinc-900 dark:text-white flex items-center gap-2">
                                    <i data-lucide="users" size="20"></i> 最近注册用户
                                </h3>
                            </div>
                            <div id="recent-users" class="p-6 space-y-4">
                                <div class="text-center text-zinc-400 py-4"><i data-lucide="loader-2" class="animate-spin inline-block mr-2"></i> 加载中...</div>
                            </div>
                        </div>

                        <!-- 最近留言 -->
                        <div class="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-white/10 shadow-sm overflow-hidden">
                            <div class="p-6 border-b border-zinc-200 dark:border-white/10">
                                <h3 class="text-lg font-black text-zinc-900 dark:text-white flex items-center gap-2">
                                    <i data-lucide="message-square" size="20"></i> 最近留言
                                </h3>
                            </div>
                            <div id="recent-messages" class="p-6 space-y-4">
                                <div class="text-center text-zinc-400 py-4"><i data-lucide="loader-2" class="animate-spin inline-block mr-2"></i> 加载中...</div>
                            </div>
                        </div>
                    </div>
                `;
                lucide.createIcons();

                try {
                    // 加载统计
                    const [usersSnap, messagesSnap, toolsSnap, invitationsSnap] = await Promise.all([
                        firebaseDB.collection('users').get(),
                        firebaseDB.collection('messages').get(),
                        firebaseDB.collection('tools').get(),
                        firebaseDB.collection('invitations').get()
                    ]);

                    document.getElementById('stat-users').textContent = usersSnap.size;
                    document.getElementById('stat-messages').textContent = messagesSnap.size;
                    document.getElementById('stat-tools').textContent = toolsSnap.size;
                    document.getElementById('stat-invitations').textContent = invitationsSnap.size;

                    // 最近用户
                    const recentUsersSnap = await firebaseDB.collection('users').orderBy('createdAt', 'desc').limit(5).get();
                    const recentUsersDiv = document.getElementById('recent-users');
                    if (recentUsersSnap.empty) {
                        recentUsersDiv.innerHTML = '<div class="text-center text-zinc-400 text-sm">暂无用户</div>';
                    } else {
                        recentUsersDiv.innerHTML = '';
                        recentUsersSnap.forEach(doc => {
                            const user = doc.data();
                            recentUsersDiv.innerHTML += `
                                <div class="flex items-center gap-3">
                                    <div class="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                        ${(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <p class="text-sm font-bold truncate">${user.displayName || user.email || '-'}</p>
                                        <p class="text-xs text-zinc-400">${user.role === 'admin' ? '管理员' : '普通用户'}</p>
                                    </div>
                                </div>
                            `;
                        });
                    }

                    // 最近留言
                    const recentMsgsSnap = await firebaseDB.collection('messages').orderBy('createdAt', 'desc').limit(5).get();
                    const recentMsgsDiv = document.getElementById('recent-messages');
                    if (recentMsgsSnap.empty) {
                        recentMsgsDiv.innerHTML = '<div class="text-center text-zinc-400 text-sm">暂无留言</div>';
                    } else {
                        recentMsgsDiv.innerHTML = '';
                        recentMsgsSnap.forEach(doc => {
                            const msg = doc.data();
                            recentMsgsDiv.innerHTML += `
                                <div class="flex items-start gap-3">
                                    <div class="w-8 h-8 rounded-full bg-zinc-100 dark:bg-white/10 flex items-center justify-center text-zinc-500 text-xs font-bold flex-shrink-0">
                                        ${(msg.username || 'A').charAt(0).toUpperCase()}
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <p class="text-xs font-bold text-blue-500">${msg.username || 'Anonymous'}</p>
                                        <p class="text-sm text-zinc-700 dark:text-zinc-300 truncate">${msg.content}</p>
                                    </div>
                                </div>
                            `;
                        });
                    }
                } catch (e) {
                    console.error('加载仪表盘失败:', e);
                }
            }

            // 用户管理
            async function renderUsers(container) {
                container.innerHTML = `
                    <div class="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-white/10 shadow-sm overflow-hidden">
                        <div class="p-6 border-b border-zinc-200 dark:border-white/10">
                            <h3 class="text-lg font-black text-zinc-900 dark:text-white flex items-center gap-2">
                                <i data-lucide="users" size="20"></i> 用户管理
                            </h3>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="w-full">
                                <thead>
                                    <tr class="bg-zinc-50 dark:bg-zinc-800/50">
                                        <th class="px-6 py-3 text-left text-xs font-bold text-zinc-500 uppercase tracking-widest">用户</th>
                                        <th class="px-6 py-3 text-left text-xs font-bold text-zinc-500 uppercase tracking-widest">邮箱</th>
                                        <th class="px-6 py-3 text-left text-xs font-bold text-zinc-500 uppercase tracking-widest">角色</th>
                                        <th class="px-6 py-3 text-left text-xs font-bold text-zinc-500 uppercase tracking-widest">注册时间</th>
                                        <th class="px-6 py-3 text-left text-xs font-bold text-zinc-500 uppercase tracking-widest">操作</th>
                                    </tr>
                                </thead>
                                <tbody id="admin-users-list">
                                    <tr><td colspan="5" class="px-6 py-10 text-center text-zinc-400"><i data-lucide="loader-2" class="animate-spin inline-block mr-2"></i> 加载中...</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                `;
                lucide.createIcons();

                try {
                    const snapshot = await firebaseDB.collection('users').orderBy('createdAt', 'desc').get();
                    const tbody = document.getElementById('admin-users-list');

                    if (snapshot.empty) {
                        tbody.innerHTML = '<tr><td colspan="5" class="px-6 py-10 text-center text-zinc-400">暂无用户</td></tr>';
                        return;
                    }

                    let html = '';
                    snapshot.forEach(doc => {
                        const user = doc.data();
                        const date = user.createdAt ? new Date(user.createdAt.toDate()).toLocaleDateString() : '-';
                        const isAdmin = user.role === 'admin';
                        html += `
                            <tr class="border-b border-zinc-100 dark:border-white/5 hover:bg-zinc-50 dark:hover:bg-white/5">
                                <td class="px-6 py-4">
                                    <div class="flex items-center gap-3">
                                        <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                                            ${(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                                        </div>
                                        <span class="text-sm font-bold">${user.displayName || '-'}</span>
                                    </div>
                                </td>
                                <td class="px-6 py-4 text-sm text-zinc-500">${user.email || '-'}</td>
                                <td class="px-6 py-4">
                                    <span class="px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${isAdmin ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-zinc-100 text-zinc-500 dark:bg-white/10 dark:text-zinc-400'}">
                                        ${isAdmin ? 'Admin' : 'User'}
                                    </span>
                                </td>
                                <td class="px-6 py-4 text-sm text-zinc-400">${date}</td>
                                <td class="px-6 py-4">
                                    <button onclick="adminToggleRole('${doc.id}', '${user.role}')" class="text-xs font-bold text-blue-500 hover:text-blue-600 transition-colors">
                                        ${isAdmin ? '取消管理员' : '设为管理员'}
                                    </button>
                                </td>
                            </tr>
                        `;
                    });
                    tbody.innerHTML = html;
                } catch (e) {
                    console.error('加载用户失败:', e);
                    document.getElementById('admin-users-list').innerHTML = '<tr><td colspan="5" class="px-6 py-10 text-center text-red-400">加载失败</td></tr>';
                }
            }

            // 工具管理
            async function renderTools(container) {
                container.innerHTML = `
                    <div class="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-white/10 shadow-sm overflow-hidden">
                        <div class="p-6 border-b border-zinc-200 dark:border-white/10 flex items-center justify-between">
                            <h3 class="text-lg font-black text-zinc-900 dark:text-white flex items-center gap-2">
                                <i data-lucide="wrench" size="20"></i> 工具管理
                            </h3>
                            <button onclick="adminAddTool()" class="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors">
                                + 添加工具
                            </button>
                        </div>
                        <div id="admin-tools-list" class="p-6 space-y-4">
                            <div class="text-center text-zinc-400 py-10"><i data-lucide="loader-2" class="animate-spin inline-block mr-2"></i> 加载中...</div>
                        </div>
                    </div>

                    <!-- 添加/编辑工具模态框 -->
                    <div id="tool-modal" class="hidden fixed inset-0 z-[400] bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">
                        <div class="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-white/10">
                            <div class="p-6 border-b border-zinc-200 dark:border-white/10 flex items-center justify-between">
                                <h3 id="tool-modal-title" class="text-xl font-black">添加工具</h3>
                                <button onclick="closeToolModal()" class="p-1 text-zinc-400 hover:text-zinc-600"><i data-lucide="x"></i></button>
                            </div>
                            <div class="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                                <input type="hidden" id="tool-edit-id">
                                <div>
                                    <label class="block text-xs font-bold text-zinc-500 mb-2">工具 ID（英文，唯一）</label>
                                    <input type="text" id="tool-id" class="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none focus:border-blue-500" placeholder="my-tool">
                                </div>
                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-xs font-bold text-zinc-500 mb-2">中文名称</label>
                                        <input type="text" id="tool-name-zh" class="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none focus:border-blue-500" placeholder="我的工具">
                                    </div>
                                    <div>
                                        <label class="block text-xs font-bold text-zinc-500 mb-2">英文名称</label>
                                        <input type="text" id="tool-name-en" class="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none focus:border-blue-500" placeholder="My Tool">
                                    </div>
                                </div>
                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-xs font-bold text-zinc-500 mb-2">中文描述</label>
                                        <input type="text" id="tool-desc-zh" class="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none focus:border-blue-500" placeholder="工具描述">
                                    </div>
                                    <div>
                                        <label class="block text-xs font-bold text-zinc-500 mb-2">英文描述</label>
                                        <input type="text" id="tool-desc-en" class="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none focus:border-blue-500" placeholder="Tool description">
                                    </div>
                                </div>
                                <div class="grid grid-cols-3 gap-4">
                                    <div>
                                        <label class="block text-xs font-bold text-zinc-500 mb-2">图标</label>
                                        <input type="text" id="tool-icon" class="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none focus:border-blue-500" placeholder="star">
                                    </div>
                                    <div>
                                        <label class="block text-xs font-bold text-zinc-500 mb-2">分类</label>
                                        <select id="tool-category" class="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none focus:border-blue-500">
                                            <option value="Recommend">推荐</option>
                                            <option value="International">国际</option>
                                            <option value="SmartUJS">智慧江大</option>
                                            <option value="Tool">工具</option>
                                            <option value="Info">信息</option>
                                            <option value="External">社交</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label class="block text-xs font-bold text-zinc-500 mb-2">尺寸</label>
                                        <select id="tool-size" class="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none focus:border-blue-500">
                                            <option value="small">小</option>
                                            <option value="medium">中</option>
                                            <option value="large">大</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-zinc-500 mb-2">链接 URL（外部链接）</label>
                                    <input type="text" id="tool-url" class="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none focus:border-blue-500" placeholder="https://example.com">
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-zinc-500 mb-2">组件名称（内置工具）</label>
                                    <input type="text" id="tool-component" class="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none focus:border-blue-500" placeholder="json-formatter">
                                </div>
                            </div>
                            <div class="p-6 border-t border-zinc-200 dark:border-white/10 flex justify-end gap-4">
                                <button onclick="closeToolModal()" class="px-6 py-2 rounded-xl bg-zinc-100 dark:bg-white/5 text-zinc-900 dark:text-white text-sm font-bold hover:bg-zinc-200 dark:hover:bg-white/10 transition-colors">取消</button>
                                <button onclick="saveTool()" class="px-6 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors">保存</button>
                            </div>
                        </div>
                    </div>
                `;
                lucide.createIcons();

                await loadToolsList();

                window.loadToolsList = loadToolsList;
            }

            async function loadToolsList() {
                try {
                    const snapshot = await firebaseDB.collection('tools').orderBy('category').get();
                    const listDiv = document.getElementById('admin-tools-list');

                    if (snapshot.empty) {
                        listDiv.innerHTML = '<div class="text-center text-zinc-400 py-10">暂无工具，点击上方按钮添加</div>';
                        return;
                    }

                    let html = '';
                    snapshot.forEach(doc => {
                        const tool = doc.data();
                        html += `
                            <div class="flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10">
                                <div class="flex items-center gap-4">
                                    <div class="p-3 rounded-xl ${tool.isActive ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-zinc-100 text-zinc-400 dark:bg-white/10'}">
                                        <i data-lucide="${tool.icon || 'box'}" size="20"></i>
                                    </div>
                                    <div>
                                        <p class="font-bold text-sm">${tool.name_zh || tool.name?.zh || '-'}</p>
                                        <p class="text-xs text-zinc-400">${tool.category || '-'} · ${tool.size || '-'}</p>
                                    </div>
                                </div>
                                <div class="flex items-center gap-2">
                                    <button onclick="adminToggleToolActive('${doc.id}', ${tool.isActive})" class="px-3 py-1 rounded-lg text-[10px] font-bold ${tool.isActive ? 'bg-green-100 text-green-600' : 'bg-zinc-100 text-zinc-400'}">
                                        ${tool.isActive ? '已启用' : '已禁用'}
                                    </button>
                                    <button onclick="adminEditTool('${doc.id}')" class="p-2 rounded-lg text-zinc-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                                        <i data-lucide="edit" size="16"></i>
                                    </button>
                                    <button onclick="adminDeleteTool('${doc.id}')" class="p-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                        <i data-lucide="trash-2" size="16"></i>
                                    </button>
                                </div>
                            </div>
                        `;
                    });
                    listDiv.innerHTML = html;
                    lucide.createIcons();
                } catch (e) {
                    console.error('加载工具列表失败:', e);
                    document.getElementById('admin-tools-list').innerHTML = '<div class="text-center text-red-400 py-10">加载失败</div>';
                }
            }

            // 留言管理
            async function renderMessages(container) {
                container.innerHTML = `
                    <div class="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-white/10 shadow-sm overflow-hidden">
                        <div class="p-6 border-b border-zinc-200 dark:border-white/10 flex items-center justify-between">
                            <h3 class="text-lg font-black text-zinc-900 dark:text-white flex items-center gap-2">
                                <i data-lucide="message-square" size="20"></i> 留言管理
                            </h3>
                            <button onclick="adminDeleteAllMessages()" class="px-4 py-2 rounded-xl bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition-colors">
                                清空所有留言
                            </button>
                        </div>
                        <div id="admin-messages-list" class="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                            <div class="text-center text-zinc-400 py-10"><i data-lucide="loader-2" class="animate-spin inline-block mr-2"></i> 加载中...</div>
                        </div>
                    </div>
                `;
                lucide.createIcons();

                try {
                    const snapshot = await firebaseDB.collection('messages').orderBy('createdAt', 'desc').limit(100).get();
                    const listDiv = document.getElementById('admin-messages-list');

                    if (snapshot.empty) {
                        listDiv.innerHTML = '<div class="text-center text-zinc-400 py-10">暂无留言</div>';
                        return;
                    }

                    let html = '';
                    snapshot.forEach(doc => {
                        const msg = doc.data();
                        const date = msg.createdAt ? new Date(msg.createdAt.toDate()).toLocaleString() : '-';
                        html += `
                            <div class="flex items-start justify-between p-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10">
                                <div class="flex-1">
                                    <div class="flex items-center gap-2 mb-1">
                                        <span class="text-xs font-bold text-blue-500">${msg.username || 'Anonymous'}</span>
                                        ${msg.isAdmin ? '<span class="px-1 py-0.5 rounded text-[8px] font-bold bg-blue-100 text-blue-600">Admin</span>' : ''}
                                        <span class="text-[10px] text-zinc-400">${date}</span>
                                    </div>
                                    <p class="text-sm text-zinc-700 dark:text-zinc-300">${msg.content}</p>
                                </div>
                                <button onclick="adminDeleteMessage('${doc.id}')" class="ml-4 p-2 rounded-lg text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                    <i data-lucide="trash-2" size="16"></i>
                                </button>
                            </div>
                        `;
                    });
                    listDiv.innerHTML = html;
                    lucide.createIcons();
                } catch (e) {
                    console.error('加载留言失败:', e);
                    document.getElementById('admin-messages-list').innerHTML = '<div class="text-center text-red-400 py-10">加载失败</div>';
                }
            }

            // 更新日志管理
            async function renderChangelogs(container) {
                container.innerHTML = `
                    <div class="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-white/10 shadow-sm overflow-hidden">
                        <div class="p-6 border-b border-zinc-200 dark:border-white/10 flex items-center justify-between">
                            <h3 class="text-lg font-black text-zinc-900 dark:text-white flex items-center gap-2">
                                <i data-lucide="history" size="20"></i> 更新日志
                            </h3>
                            <button onclick="adminAddChangelog()" class="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors">
                                + 添加日志
                            </button>
                        </div>
                        <div id="admin-changelogs-list" class="p-6 space-y-4">
                            <div class="text-center text-zinc-400 py-10"><i data-lucide="loader-2" class="animate-spin inline-block mr-2"></i> 加载中...</div>
                        </div>
                    </div>

                    <!-- 添加/编辑日志模态框 -->
                    <div id="changelog-modal" class="hidden fixed inset-0 z-[400] bg-black/50 backdrop-blur-sm flex items-center justify-center px-4">
                        <div class="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl overflow-hidden border border-zinc-200 dark:border-white/10">
                            <div class="p-6 border-b border-zinc-200 dark:border-white/10 flex items-center justify-between">
                                <h3 id="changelog-modal-title" class="text-xl font-black">添加更新日志</h3>
                                <button onclick="closeChangelogModal()" class="p-1 text-zinc-400 hover:text-zinc-600"><i data-lucide="x"></i></button>
                            </div>
                            <div class="p-6 space-y-4">
                                <input type="hidden" id="changelog-edit-id">
                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-xs font-bold text-zinc-500 mb-2">版本号</label>
                                        <input type="text" id="changelog-version" class="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none focus:border-blue-500" placeholder="1.0.0">
                                    </div>
                                    <div>
                                        <label class="block text-xs font-bold text-zinc-500 mb-2">日期</label>
                                        <input type="date" id="changelog-date" class="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none focus:border-blue-500">
                                    </div>
                                </div>
                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-xs font-bold text-zinc-500 mb-2">中文标题</label>
                                        <input type="text" id="changelog-title-zh" class="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none focus:border-blue-500" placeholder="更新标题">
                                    </div>
                                    <div>
                                        <label class="block text-xs font-bold text-zinc-500 mb-2">英文标题</label>
                                        <input type="text" id="changelog-title-en" class="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none focus:border-blue-500" placeholder="Update title">
                                    </div>
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-zinc-500 mb-2">类型</label>
                                    <select id="changelog-type" class="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none focus:border-blue-500">
                                        <option value="Major">重大更新</option>
                                        <option value="Update">普通更新</option>
                                        <option value="Minor">小更新</option>
                                        <option value="History">历史版本</option>
                                    </select>
                                </div>
                                <div>
                                    <label class="block text-xs font-bold text-zinc-500 mb-2">更新内容（每行一条）</label>
                                    <textarea id="changelog-items" rows="5" class="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none focus:border-blue-500 resize-none" placeholder="新增功能 A&#10;修复问题 B&#10;优化性能 C"></textarea>
                                </div>
                            </div>
                            <div class="p-6 border-t border-zinc-200 dark:border-white/10 flex justify-end gap-4">
                                <button onclick="closeChangelogModal()" class="px-6 py-2 rounded-xl bg-zinc-100 dark:bg-white/5 text-zinc-900 dark:text-white text-sm font-bold hover:bg-zinc-200 dark:hover:bg-white/10 transition-colors">取消</button>
                                <button onclick="saveChangelog()" class="px-6 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors">保存</button>
                            </div>
                        </div>
                    </div>
                `;
                lucide.createIcons();

                await loadChangelogsList();
            }

            async function loadChangelogsList() {
                try {
                    const snapshot = await firebaseDB.collection('changelogs').orderBy('date', 'desc').get();
                    const listDiv = document.getElementById('admin-changelogs-list');

                    if (snapshot.empty) {
                        listDiv.innerHTML = '<div class="text-center text-zinc-400 py-10">暂无更新日志</div>';
                        return;
                    }

                    let html = '';
                    snapshot.forEach(doc => {
                        const log = doc.data();
                        const date = log.date || '-';
                        const typeColors = { Major: 'bg-red-100 text-red-600', Update: 'bg-blue-100 text-blue-600', Minor: 'bg-green-100 text-green-600', History: 'bg-zinc-100 text-zinc-500' };
                        html += `
                            <div class="p-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10">
                                <div class="flex items-center justify-between mb-2">
                                    <div class="flex items-center gap-3">
                                        <span class="px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${typeColors[log.type] || typeColors.Update}">${log.type || 'Update'}</span>
                                        <span class="font-bold">v${log.version || '-'}</span>
                                        <span class="text-xs text-zinc-400">${date}</span>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <button onclick="adminEditChangelog('${doc.id}')" class="p-2 rounded-lg text-zinc-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors">
                                            <i data-lucide="edit" size="16"></i>
                                        </button>
                                        <button onclick="adminDeleteChangelog('${doc.id}')" class="p-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                            <i data-lucide="trash-2" size="16"></i>
                                        </button>
                                    </div>
                                </div>
                                <p class="text-sm font-bold mb-1">${log.title_zh || log.title?.zh || '-'}</p>
                                <div class="text-xs text-zinc-500 space-y-1">
                                    ${(log.items || log.items_json || []).map(item => `<p>• ${item}</p>`).join('')}
                                </div>
                            </div>
                        `;
                    });
                    listDiv.innerHTML = html;
                    lucide.createIcons();
                } catch (e) {
                    console.error('加载更新日志失败:', e);
                    document.getElementById('admin-changelogs-list').innerHTML = '<div class="text-center text-red-400 py-10">加载失败</div>';
                }
            }

            // 系统设置
            async function renderSettings(container) {
                container.innerHTML = `
                    <div class="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-white/10 shadow-sm overflow-hidden">
                        <div class="p-6 border-b border-zinc-200 dark:border-white/10">
                            <h3 class="text-lg font-black text-zinc-900 dark:text-white flex items-center gap-2">
                                <i data-lucide="settings" size="20"></i> 系统设置
                            </h3>
                        </div>
                        <div class="p-6 space-y-6">
                            <div>
                                <label class="block text-xs font-bold text-zinc-500 mb-2">站点状态</label>
                                <select id="setting-site-status" class="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none focus:border-blue-500">
                                    <option value="online">在线</option>
                                    <option value="offline">维护模式</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-zinc-500 mb-2">留言板状态</label>
                                <select id="setting-board-status" class="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none focus:border-blue-500">
                                    <option value="enabled">开放</option>
                                    <option value="disabled">关闭</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-zinc-500 mb-2">注册邀请码</label>
                                <select id="setting-require-invite-code" class="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none focus:border-blue-500">
                                    <option value="false">不需要</option>
                                    <option value="true">需要邀请码</option>
                                </select>
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-zinc-500 mb-2">团队简介（中文）</label>
                                <textarea id="setting-team-intro-zh" rows="3" class="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none focus:border-blue-500 resize-none"></textarea>
                            </div>
                            <div>
                                <label class="block text-xs font-bold text-zinc-500 mb-2">团队简介（英文）</label>
                                <textarea id="setting-team-intro-en" rows="3" class="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10 outline-none focus:border-blue-500 resize-none"></textarea>
                            </div>
                            <button onclick="saveSettings()" class="px-6 py-3 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors">
                                保存设置
                            </button>
                        </div>
                    </div>
                `;

                // 加载当前设置
                try {
                    const settingsDoc = await firebaseDB.collection('settings').doc('site').get();
                    if (settingsDoc.exists) {
                        const settings = settingsDoc.data();
                        document.getElementById('setting-site-status').value = settings.site_status || 'online';
                        document.getElementById('setting-board-status').value = settings.board_status || 'enabled';
                        document.getElementById('setting-require-invite-code').value = settings.require_invite_code || 'false';
                        document.getElementById('setting-team-intro-zh').value = settings.team_intro_zh || '';
                        document.getElementById('setting-team-intro-en').value = settings.team_intro_en || '';
                    }
                } catch (e) {
                    console.error('加载设置失败:', e);
                }
            }

            // 邀请码管理
            async function renderInvitations(container) {
                container.innerHTML = `
                    <div class="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-white/10 shadow-sm overflow-hidden">
                        <div class="p-6 border-b border-zinc-200 dark:border-white/10 flex items-center justify-between">
                            <h3 class="text-lg font-black text-zinc-900 dark:text-white flex items-center gap-2">
                                <i data-lucide="ticket" size="20"></i> 邀请码管理
                            </h3>
                            <button onclick="adminGenerateInvitations()" class="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors">
                                生成邀请码
                            </button>
                        </div>
                        <div id="admin-invitations-list" class="p-6 space-y-4">
                            <div class="text-center text-zinc-400 py-10"><i data-lucide="loader-2" class="animate-spin inline-block mr-2"></i> 加载中...</div>
                        </div>
                    </div>
                `;
                lucide.createIcons();

                await loadInvitationsList();
            }

            async function loadInvitationsList() {
                try {
                    const snapshot = await firebaseDB.collection('invitations').orderBy('createdAt', 'desc').get();
                    const listDiv = document.getElementById('admin-invitations-list');

                    if (snapshot.empty) {
                        listDiv.innerHTML = '<div class="text-center text-zinc-400 py-10">暂无邀请码，点击上方按钮生成</div>';
                        return;
                    }

                    let html = '';
                    snapshot.forEach(doc => {
                        const inv = doc.data();
                        const date = inv.createdAt ? new Date(inv.createdAt.toDate()).toLocaleString() : '-';
                        const isUsed = inv.isUsed;
                        html += `
                            <div class="flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10">
                                <div class="flex items-center gap-4">
                                    <div class="p-3 rounded-xl ${isUsed ? 'bg-zinc-100 text-zinc-400' : 'bg-green-100 text-green-600'}">
                                        <i data-lucide="ticket" size="20"></i>
                                    </div>
                                    <div>
                                        <p class="font-mono font-bold text-sm">${doc.id}</p>
                                        <p class="text-xs text-zinc-400">${isUsed ? `已被 ${inv.usedBy || '未知用户'} 使用` : '未使用'} · ${date}</p>
                                    </div>
                                </div>
                                <button onclick="adminDeleteInvitation('${doc.id}')" class="p-2 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                    <i data-lucide="trash-2" size="16"></i>
                                </button>
                            </div>
                        `;
                    });
                    listDiv.innerHTML = html;
                    lucide.createIcons();
                } catch (e) {
                    console.error('加载邀请码失败:', e);
                    document.getElementById('admin-invitations-list').innerHTML = '<div class="text-center text-red-400 py-10">加载失败</div>';
                }
            }

            // ========== 全局函数 ==========

            // 用户管理
            window.adminToggleRole = async (userId, currentRole) => {
                const newRole = currentRole === 'admin' ? 'user' : 'admin';
                if (!confirm(`确定要将该用户${newRole === 'admin' ? '设为管理员' : '取消管理员'}吗？`)) return;
                try {
                    await firebaseDB.collection('users').doc(userId).update({ role: newRole });
                    alert('角色更新成功！');
                    await renderUsers(document.getElementById('admin-tab-content'));
                } catch (e) {
                    alert('更新失败: ' + e.message);
                }
            };

            // 留言管理
            window.adminDeleteMessage = async (messageId) => {
                if (!confirm('确定要删除这条留言吗？')) return;
                try {
                    await firebaseDB.collection('messages').doc(messageId).delete();
                    alert('删除成功！');
                    await renderMessages(document.getElementById('admin-tab-content'));
                } catch (e) {
                    alert('删除失败: ' + e.message);
                }
            };

            window.adminDeleteAllMessages = async () => {
                if (!confirm('确定要清空所有留言吗？此操作不可恢复！')) return;
                try {
                    const snapshot = await firebaseDB.collection('messages').get();
                    const batch = firebaseDB.batch();
                    snapshot.forEach(doc => batch.delete(doc.ref));
                    await batch.commit();
                    alert('所有留言已清空！');
                    await renderMessages(document.getElementById('admin-tab-content'));
                } catch (e) {
                    alert('清空失败: ' + e.message);
                }
            };

            // 工具管理
            window.adminAddTool = () => {
                document.getElementById('tool-modal-title').textContent = '添加工具';
                document.getElementById('tool-edit-id').value = '';
                document.getElementById('tool-id').value = '';
                document.getElementById('tool-id').disabled = false;
                document.getElementById('tool-name-zh').value = '';
                document.getElementById('tool-name-en').value = '';
                document.getElementById('tool-desc-zh').value = '';
                document.getElementById('tool-desc-en').value = '';
                document.getElementById('tool-icon').value = '';
                document.getElementById('tool-category').value = 'Tool';
                document.getElementById('tool-size').value = 'small';
                document.getElementById('tool-url').value = '';
                document.getElementById('tool-component').value = '';
                document.getElementById('tool-modal').classList.remove('hidden');
                lucide.createIcons();
            };

            window.adminEditTool = async (toolId) => {
                try {
                    const doc = await firebaseDB.collection('tools').doc(toolId).get();
                    if (!doc.exists) { alert('工具不存在'); return; }
                    const tool = doc.data();

                    document.getElementById('tool-modal-title').textContent = '编辑工具';
                    document.getElementById('tool-edit-id').value = toolId;
                    document.getElementById('tool-id').value = toolId;
                    document.getElementById('tool-id').disabled = true;
                    document.getElementById('tool-name-zh').value = tool.name_zh || tool.name?.zh || '';
                    document.getElementById('tool-name-en').value = tool.name_en || tool.name?.en || '';
                    document.getElementById('tool-desc-zh').value = tool.desc_zh || tool.description?.zh || '';
                    document.getElementById('tool-desc-en').value = tool.desc_en || tool.description?.en || '';
                    document.getElementById('tool-icon').value = tool.icon || '';
                    document.getElementById('tool-category').value = tool.category || 'Tool';
                    document.getElementById('tool-size').value = tool.size || 'small';
                    document.getElementById('tool-url').value = tool.url || '';
                    document.getElementById('tool-component').value = tool.component || '';
                    document.getElementById('tool-modal').classList.remove('hidden');
                    lucide.createIcons();
                } catch (e) {
                    alert('加载工具失败: ' + e.message);
                }
            };

            window.closeToolModal = () => {
                document.getElementById('tool-modal').classList.add('hidden');
            };

            window.saveTool = async () => {
                const editId = document.getElementById('tool-edit-id').value;
                const toolId = document.getElementById('tool-id').value.trim();
                const nameZh = document.getElementById('tool-name-zh').value.trim();
                const nameEn = document.getElementById('tool-name-en').value.trim();
                const descZh = document.getElementById('tool-desc-zh').value.trim();
                const descEn = document.getElementById('tool-desc-en').value.trim();
                const icon = document.getElementById('tool-icon').value.trim();
                const category = document.getElementById('tool-category').value;
                const size = document.getElementById('tool-size').value;
                const url = document.getElementById('tool-url').value.trim();
                const component = document.getElementById('tool-component').value.trim();

                if (!toolId || !nameZh) {
                    alert('请填写工具 ID 和中文名称');
                    return;
                }

                const toolData = {
                    name_zh: nameZh,
                    name_en: nameEn,
                    name: { zh: nameZh, en: nameEn },
                    desc_zh: descZh,
                    desc_en: descEn,
                    description: { zh: descZh, en: descEn },
                    icon: icon || 'box',
                    category,
                    size,
                    url: url || null,
                    component: component || null,
                    isActive: true,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                };

                try {
                    if (editId) {
                        await firebaseDB.collection('tools').doc(editId).update(toolData);
                        alert('工具更新成功！');
                    } else {
                        // 检查 ID 是否已存在
                        const existing = await firebaseDB.collection('tools').doc(toolId).get();
                        if (existing.exists) {
                            alert('工具 ID 已存在，请使用其他 ID');
                            return;
                        }
                        toolData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
                        await firebaseDB.collection('tools').doc(toolId).set(toolData);
                        alert('工具添加成功！');
                    }
                    closeToolModal();
                    await loadToolsList();
                } catch (e) {
                    alert('保存失败: ' + e.message);
                }
            };

            window.adminToggleToolActive = async (toolId, currentActive) => {
                try {
                    await firebaseDB.collection('tools').doc(toolId).update({ isActive: !currentActive });
                    await loadToolsList();
                } catch (e) {
                    alert('更新失败: ' + e.message);
                }
            };

            window.adminDeleteTool = async (toolId) => {
                if (!confirm('确定要删除这个工具吗？')) return;
                try {
                    await firebaseDB.collection('tools').doc(toolId).delete();
                    alert('删除成功！');
                    await loadToolsList();
                } catch (e) {
                    alert('删除失败: ' + e.message);
                }
            };

            // 更新日志管理
            window.adminAddChangelog = () => {
                document.getElementById('changelog-modal-title').textContent = '添加更新日志';
                document.getElementById('changelog-edit-id').value = '';
                document.getElementById('changelog-version').value = '';
                document.getElementById('changelog-date').value = new Date().toISOString().split('T')[0];
                document.getElementById('changelog-title-zh').value = '';
                document.getElementById('changelog-title-en').value = '';
                document.getElementById('changelog-type').value = 'Update';
                document.getElementById('changelog-items').value = '';
                document.getElementById('changelog-modal').classList.remove('hidden');
                lucide.createIcons();
            };

            window.adminEditChangelog = async (logId) => {
                try {
                    const doc = await firebaseDB.collection('changelogs').doc(logId).get();
                    if (!doc.exists) { alert('日志不存在'); return; }
                    const log = doc.data();

                    document.getElementById('changelog-modal-title').textContent = '编辑更新日志';
                    document.getElementById('changelog-edit-id').value = logId;
                    document.getElementById('changelog-version').value = log.version || '';
                    document.getElementById('changelog-date').value = log.date || '';
                    document.getElementById('changelog-title-zh').value = log.title_zh || log.title?.zh || '';
                    document.getElementById('changelog-title-en').value = log.title_en || log.title?.en || '';
                    document.getElementById('changelog-type').value = log.type || 'Update';
                    document.getElementById('changelog-items').value = (log.items || log.items_json || []).join('\n');
                    document.getElementById('changelog-modal').classList.remove('hidden');
                    lucide.createIcons();
                } catch (e) {
                    alert('加载日志失败: ' + e.message);
                }
            };

            window.closeChangelogModal = () => {
                document.getElementById('changelog-modal').classList.add('hidden');
            };

            window.saveChangelog = async () => {
                const editId = document.getElementById('changelog-edit-id').value;
                const version = document.getElementById('changelog-version').value.trim();
                const date = document.getElementById('changelog-date').value;
                const titleZh = document.getElementById('changelog-title-zh').value.trim();
                const titleEn = document.getElementById('changelog-title-en').value.trim();
                const type = document.getElementById('changelog-type').value;
                const itemsText = document.getElementById('changelog-items').value.trim();
                const items = itemsText ? itemsText.split('\n').filter(i => i.trim()) : [];

                if (!version || !date || !titleZh) {
                    alert('请填写版本号、日期和中文标题');
                    return;
                }

                const logData = {
                    version,
                    date,
                    title_zh: titleZh,
                    title_en: titleEn,
                    title: { zh: titleZh, en: titleEn },
                    type,
                    items,
                    items_json: items,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                };

                try {
                    if (editId) {
                        await firebaseDB.collection('changelogs').doc(editId).update(logData);
                        alert('日志更新成功！');
                    } else {
                        logData.createdAt = firebase.firestore.FieldValue.serverTimestamp();
                        await firebaseDB.collection('changelogs').add(logData);
                        alert('日志添加成功！');
                    }
                    closeChangelogModal();
                    await loadChangelogsList();
                } catch (e) {
                    alert('保存失败: ' + e.message);
                }
            };

            window.adminDeleteChangelog = async (logId) => {
                if (!confirm('确定要删除这条更新日志吗？')) return;
                try {
                    await firebaseDB.collection('changelogs').doc(logId).delete();
                    alert('删除成功！');
                    await loadChangelogsList();
                } catch (e) {
                    alert('删除失败: ' + e.message);
                }
            };

            // 系统设置
            window.saveSettings = async () => {
                const siteStatus = document.getElementById('setting-site-status').value;
                const boardStatus = document.getElementById('setting-board-status').value;
                const requireInviteCode = document.getElementById('setting-require-invite-code').value;
                const teamIntroZh = document.getElementById('setting-team-intro-zh').value;
                const teamIntroEn = document.getElementById('setting-team-intro-en').value;

                try {
                    await firebaseDB.collection('settings').doc('site').set({
                        site_status: siteStatus,
                        board_status: boardStatus,
                        require_invite_code: requireInviteCode,
                        team_intro_zh: teamIntroZh,
                        team_intro_en: teamIntroEn,
                        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                    }, { merge: true });

                    // 更新全局设置
                    window.CMI_SETTINGS = {
                        ...window.CMI_SETTINGS,
                        site_status: siteStatus,
                        board_status: boardStatus,
                        require_invite_code: requireInviteCode,
                        team_intro_zh: teamIntroZh,
                        team_intro_en: teamIntroEn
                    };

                    alert('设置保存成功！');

                    // 如果切换到维护模式，刷新页面
                    if (siteStatus === 'offline') {
                        if (confirm('已切换到维护模式，是否刷新页面查看效果？')) {
                            window.location.reload();
                        }
                    }
                } catch (e) {
                    alert('保存失败: ' + e.message);
                }
            };

            // 邀请码管理
            window.adminGenerateInvitations = async () => {
                const count = prompt('请输入要生成的邀请码数量（1-50）：', '10');
                if (!count) return;

                const num = parseInt(count);
                if (isNaN(num) || num < 1 || num > 50) {
                    alert('请输入 1-50 之间的数字');
                    return;
                }

                try {
                    const batch = firebaseDB.batch();
                    for (let i = 0; i < num; i++) {
                        const code = generateInviteCode();
                        const ref = firebaseDB.collection('invitations').doc(code);
                        batch.set(ref, {
                            isUsed: false,
                            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                            createdBy: window.currentUser.uid
                        });
                    }
                    await batch.commit();
                    alert(`成功生成 ${num} 个邀请码！`);
                    await loadInvitationsList();
                } catch (e) {
                    alert('生成失败: ' + e.message);
                }
            };

            window.adminDeleteInvitation = async (code) => {
                if (!confirm('确定要删除这个邀请码吗？')) return;
                try {
                    await firebaseDB.collection('invitations').doc(code).delete();
                    alert('删除成功！');
                    await loadInvitationsList();
                } catch (e) {
                    alert('删除失败: ' + e.message);
                }
            };

            function generateInviteCode() {
                const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
                let code = '';
                for (let i = 0; i < 8; i++) {
                    code += chars.charAt(Math.floor(Math.random() * chars.length));
                }
                return code;
            }

            // 初始加载仪表盘
            await renderDashboard(document.getElementById('admin-tab-content'));
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
