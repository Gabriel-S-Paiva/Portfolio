<script lang="ts">
  let isOpen = $state(false);
  let commandInput = $state('');
  let terminalHistory = $state<{ text: string; type?: 'dim' | 'err' | 'hl' }[]>([]);

  const commits = [
    { hash:'f9a8b7c', branch:'main', date:'2026-06', msg:'award: 1st Place Best WebPII Project Award for Project SAM', desc:'Recognized for backend system architecture, dual-database integration (MySQL+MongoDB), and JWT security.' },
    { hash:'e8d7c6b', branch:'main', date:'2026-05', msg:'award: 1st Place TeamGreen4All Hackathon', desc:'Organized by SAS P.PORTO (4BEST initiative).' },
    { hash:'a1b2c3d', branch:'cloud/main', date:'2026-04', msg:'ci: add govulncheck, pnpm audit and Dependabot to Owned Cloud', desc:'GitHub Actions workflow with 67% test coverage on Go storage layer.' },
    { hash:'9c8b7a6', branch:'cloud/backend', date:'2026-03', msg:'feat: chunked two-phase upload + quota reservation', desc:'Go backend with chunk upload handling and strict storage limits.' },
    { hash:'6a7b8c9', branch:'cloud/infra', date:'2026-02', msg:'deploy: Caddy single-origin reverse proxy for LAN HTTP', desc:'HttpOnly cookie session support configured for local homelab server.' },
    { hash:'0f9e8d7', branch:'education', date:'2024-09', msg:'esmad: start BSc in Web Information Systems and Technologies', desc:'Focusing on web systems engineering and software architecture.' },
  ];

  const skills = {
    languages: ['JavaScript (ES6+)','TypeScript','Go','Python','SQL (MySQL)','PHP','HTML5/CSS3'],
    backend: ['Node.js','Express','REST APIs','WebSockets','SQLite','MySQL','MongoDB','JWT'],
    devops: ['Docker','Docker Compose','Caddy','GitHub Actions (CI/CD)','go test','Vitest','Git'],
    frontend: ['SvelteKit 5','Vue.js','Three.js','Tailwind CSS','Figma'],
  };

  function openTerminal() {
    isOpen = true;
    if (terminalHistory.length === 0) {
      terminalHistory.push(
        { text: "welcome — interactive shell for Gabriel Paiva's portfolio.", type: 'dim' },
        { text: "type 'help' to see available commands.", type: 'dim' }
      );
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') isOpen = false;
  }

  function executeCommand(e: KeyboardEvent) {
    if (e.key !== 'Enter') return;
    const cmd = commandInput.trim();
    terminalHistory.push({ text: `> ${cmd}` });
    commandInput = '';

    if (!cmd) return;
    const parts = cmd.split(/\s+/);

    if (cmd === 'help') {
      ['help', 'git log', 'git log --oneline', 'git branch', 'git show <hash>', 'cat skills.json', 'cat README.md', 'awards', 'contact', 'clear']
        .forEach(c => terminalHistory.push({ text: `  ${c}`, type: 'dim' }));
    } else if (cmd === 'git log') {
      commits.forEach(c => {
        terminalHistory.push({ text: `commit ${c.hash} (${c.branch})`, type: 'hl' });
        terminalHistory.push({ text: `Date: ${c.date}` });
        terminalHistory.push({ text: `    ${c.msg}` });
        terminalHistory.push({ text: `    ${c.desc}`, type: 'dim' });
      });
    } else if (cmd === 'git log --oneline') {
      commits.forEach(c => terminalHistory.push({ text: `${c.hash} ${c.msg}` }));
    } else if (cmd === 'git branch') {
      [...new Set(commits.map(c => c.branch))].forEach(b => terminalHistory.push({ text: `  ${b}` }));
    } else if (parts[0] === 'git' && parts[1] === 'show') {
      const c = commits.find(x => x.hash === parts[2]);
      if (c) {
        terminalHistory.push({ text: `commit ${c.hash}`, type: 'hl' });
        terminalHistory.push({ text: c.msg });
        terminalHistory.push({ text: c.desc, type: 'dim' });
      } else {
        terminalHistory.push({ text: `fatal: bad object '${parts[2] || ''}'`, type: 'err' });
      }
    } else if (cmd === 'cat skills.json') {
      Object.entries(skills).forEach(([k, v]) => {
        terminalHistory.push({ text: `"${k}": [${v.join(', ')}]` });
      });
    } else if (cmd === 'cat README.md') {
      terminalHistory.push({ text: '# Gabriel Paiva', type: 'hl' });
      terminalHistory.push({ text: 'BSc Student in Web Information Systems and Technologies @ ESMAD / Politécnico do Porto.' });
      terminalHistory.push({ text: 'Focus: Backend Systems, REST APIs, and Self-Hosted Infrastructure.' });
    } else if (cmd === 'awards') {
      terminalHistory.push({ text: '1st Place — Best WebPII Project Award (ESMAD, 2026)' });
      terminalHistory.push({ text: '1st Place — TeamGreen4All Hackathon (SAS P.PORTO, 2026)' });
      terminalHistory.push({ text: 'Invited Speaker — ESMAD Seminar (2026)' });
      terminalHistory.push({ text: '1st Place — 3.ª Edição Concurso madJS (ESMAD, 2025)' });
      terminalHistory.push({ text: '1st Place — ESMAD Best Project Award (2024/25)' });
    } else if (cmd === 'contact') {
      terminalHistory.push({ text: 'email: mr.sousapaiva@gmail.com' });
      terminalHistory.push({ text: 'github: https://github.com/Gabriel-S-Paiva' });
    } else if (cmd === 'clear') {
      terminalHistory = [];
    } else {
      terminalHistory.push({ text: `command not found: ${cmd} — type 'help'`, type: 'err' });
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- Dock Bar -->
<div class="fixed bottom-5 left-1/2 -translate-x-1/2 w-[min(480px,90vw)] z-40">
  <button 
    onclick={openTerminal}
    class="w-full flex items-center gap-2.5 bg-[var(--surface-2)] border border-[var(--line)] rounded-full px-4 py-3 cursor-pointer shadow-lg hover:border-[#3a4150] transition-colors"
  >
    <span class="text-[var(--green)] font-[family-name:var(--font-mono)] text-sm">›</span>
    <input readonly placeholder="try: git log --oneline" class="bg-transparent border-none outline-none text-[var(--text)] font-[family-name:var(--font-mono)] text-[13.5px] w-full cursor-pointer placeholder:text-[var(--dimmer)]" />
  </button>
</div>

<!-- Modal Overlay -->
{#if isOpen}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_interactive_supports_focus -->
  <div 
    role="button"
    tabindex="-1"
    onclick={(e) => { if (e.target === e.currentTarget) isOpen = false; }}
    class="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end justify-center pb-[90px] w-full cursor-default"
  >
    <div class="w-[min(680px,92vw)] h-[min(480px,65vh)] bg-[var(--surface-2)] border border-[var(--line)] rounded-xl flex flex-col shadow-2xl overflow-hidden cursor-auto">
      <div class="flex justify-between items-center px-4 py-2.5 border-b border-[var(--line)] font-[family-name:var(--font-mono)] text-xs text-[var(--dimmer)]">
        <span>gabrielpaiva/portfolio — terminal</span>
        <button type="button" onclick={() => isOpen = false} class="text-[var(--dim)] hover:text-[var(--text)] cursor-pointer bg-transparent border-none">esc ✕</button>
      </div>

      <div class="flex-1 overflow-y-auto p-4 font-[family-name:var(--font-mono)] text-xs leading-relaxed">
        {#each terminalHistory as line}
          <div class={line.type === 'dim' ? 'text-[var(--dim)]' : line.type === 'err' ? 'text-[#e88a8a]' : line.type === 'hl' ? 'text-[var(--green)]' : 'text-[var(--text)]'}>
            {line.text}
          </div>
        {/each}
      </div>

      <div class="flex items-center gap-2 px-4 py-2.5 border-t border-[var(--line)]">
        <span class="text-[var(--green)] font-[family-name:var(--font-mono)]">›</span>
        <input 
          bind:value={commandInput}
          onkeydown={executeCommand}
          placeholder="type 'help'" 
          autocomplete="off" 
          spellcheck="false" 
          class="flex-1 bg-transparent border-none outline-none text-[var(--text)] font-[family-name:var(--font-mono)] text-xs"
        />
      </div>
    </div>
  </div>
{/if}