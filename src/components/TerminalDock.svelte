<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { skillGroups, slugify } from '../lib/skills';
  import { shortHash } from '../lib/hash';

  type Branch = 'main' | 'skills' | 'work' | 'honors' | 'education';
  type Entry = { file: string; message: string; content: string };

  interface ProjectItem { id: string; title: string; commit: string; body: string }
  interface AwardItem { id: string; title: string; commit: string; body: string }
  interface EduItem { id: string; degree: string; commit: string; details: string; body: string }

  let { projects, awards, educationList }: {
    projects: ProjectItem[];
    awards: AwardItem[];
    educationList: EduItem[];
  } = $props();

  const BRANCHES: Branch[] = ['main', 'skills', 'work', 'honors', 'education'];

  let mounted = $state(false);
  let commandInput = $state('');
  let terminalHistory = $state<{ text: string; type?: 'dim' | 'err' | 'hl' }[]>([]);
  let currentBranch = $state<Branch>('main');
  let mainEntries = $state<Entry[]>([{ file: '', message: 'git init', content: 'initialized empty repository' }]);

  let dockBtn: HTMLButtonElement | undefined = $state();
  let panelEl: HTMLDivElement | undefined = $state();
  let historyEl: HTMLDivElement | undefined = $state();
  let inputEl: HTMLInputElement | undefined = $state();

  const branchEntries = $derived<Record<Branch, Entry[]>>({
    main: mainEntries,
    skills: skillGroups.map(g => ({
      file: `${slugify(g.title)}.txt`,
      message: g.commit,
      content: g.skills.join(', '),
    })),
    work: projects.map(p => ({
      file: `${p.id}.md`,
      message: p.commit,
      content: p.body?.trim() || '(no description)',
    })),
    honors: awards.map(a => ({
      file: `${a.id}.md`,
      message: a.commit,
      content: a.body?.trim() || '(no description)',
    })),
    education: educationList.map(e => ({
      file: `${e.id}.md`,
      message: e.commit,
      content: e.body?.trim() || e.details,
    })),
  });

  const allTagged = $derived(
    (Object.entries(branchEntries) as [Branch, Entry[]][]).flatMap(([branch, entries]) =>
      entries.map(e => ({ branch, ...e, hash: shortHash(e.message) }))
    )
  );

  onMount(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('.gitline'));
    const entries: Entry[] = [{ file: '', message: 'git init', content: 'initialized empty repository' }];
    sections.forEach(sec => {
      const msg = sec.dataset.commit;
      if (msg) entries.push({ file: sec.id, message: msg, content: '' });
    });
    mainEntries = entries;

    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && mounted) requestClose();
    }
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  });

  function push(text: string, type?: 'dim' | 'err' | 'hl') {
    terminalHistory.push({ text, type });
  }

  async function scrollToBottom() {
    await tick();
    if (historyEl) historyEl.scrollTop = historyEl.scrollHeight;
  }

  function reducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  // ---- explicit corner-accurate box animation ----
  type Box = { left: number; top: number; width: number; height: number; radius: number };
  let animId = 0;

  function backOut(t: number, overshoot = 1.7) {
    const c1 = overshoot, c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  }

  function applyBox(el: HTMLElement, b: Box) {
    el.style.left = `${b.left}px`;
    el.style.top = `${b.top}px`;
    el.style.width = `${b.width}px`;
    el.style.height = `${b.height}px`;
    el.style.borderRadius = `${b.radius}px`;
  }

  function animateBox(el: HTMLElement, from: Box, to: Box, duration: number, overshoot: number, onDone?: () => void) {
    const myId = ++animId; // lets a new animation cancel a stale one mid-flight
    const start = performance.now();
    function frame(now: number) {
      if (myId !== animId) return;
      const t = Math.min(1, (now - start) / duration);
      const eased = backOut(t, overshoot);
      applyBox(el, {
        left:   from.left   + (to.left   - from.left)   * eased,
        top:    from.top    + (to.top    - from.top)    * eased,
        width:  from.width  + (to.width  - from.width)  * eased,
        height: from.height + (to.height - from.height) * eased,
        radius: from.radius + (to.radius - from.radius) * eased,
      });
      if (t < 1) requestAnimationFrame(frame);
      else onDone?.();
    }
    requestAnimationFrame(frame);
  }

  function pillBox(rect: DOMRect): Box {
    return { left: rect.left, top: rect.top, width: rect.width, height: rect.height, radius: rect.height / 2 };
  }

  function panelTargetBox(): Box {
    const vw = window.innerWidth, vh = window.innerHeight;
    const width = Math.min(680, vw * 0.92);
    const height = Math.min(480, vh * 0.65);
    return { left: (vw - width) / 2, top: vh - 90 - height, width, height, radius: 16 };
  }

  async function openTerminal() {
    if (mounted || !dockBtn) return;
    const fromBox = pillBox(dockBtn.getBoundingClientRect());

    mounted = true;
    if (terminalHistory.length === 0) {
      push("welcome — interactive shell for Gabriel Paiva's portfolio.", 'dim');
      push("type 'help' to see available commands.", 'dim');
    }
    await tick();
    if (!panelEl) return;

    panelEl.style.position = 'fixed';
    applyBox(panelEl, fromBox); // paint at the pill's exact size before animating, no flash

    if (reducedMotion()) {
      applyBox(panelEl, panelTargetBox());
    } else {
      animateBox(panelEl, fromBox, panelTargetBox(), 420, 1.7);
    }

    await scrollToBottom();
    inputEl?.focus();
  }

  function requestClose() {
    if (!mounted || !panelEl || !dockBtn) { mounted = false; return; }

    const toBox = pillBox(dockBtn.getBoundingClientRect());
    const fromBox: Box = {
      left: panelEl.offsetLeft, top: panelEl.offsetTop,
      width: panelEl.offsetWidth, height: panelEl.offsetHeight,
      radius: 16,
    };

    const finish = () => { mounted = false; };

    if (reducedMotion()) finish();
    else animateBox(panelEl, fromBox, toBox, 320, 1.4, finish);
  }

  async function executeCommand(e: KeyboardEvent) {
    if (e.key !== 'Enter') return;
    const cmd = commandInput.trim();
    push(`> ${cmd}`);
    commandInput = '';
    if (!cmd) { await scrollToBottom(); return; }
    const parts = cmd.split(/\s+/);
    const entries = branchEntries[currentBranch];

    if (cmd === 'help') {
      [
        'help', 'git branch', 'git checkout <branch>', 'git log', 'git log --oneline',
        'git show <hash>', 'ls', 'cat <file>', 'cat README.md', 'contact', 'clear'
      ].forEach(c => push(`  ${c}`, 'dim'));
      push(`(currently on branch '${currentBranch}')`, 'dim');

    } else if (cmd === 'git branch') {
      BRANCHES.forEach(b => push(`${b === currentBranch ? '* ' : '  '}${b}`));

    } else if (parts[0] === 'git' && parts[1] === 'checkout') {
      const target = parts[2] as Branch;
      if (BRANCHES.includes(target)) {
        currentBranch = target;
        push(`Switched to branch '${target}'`);
      } else {
        push(`error: pathspec '${parts[2] ?? ''}' did not match any file(s) known to git`, 'err');
      }

    } else if (cmd === 'git log') {
      if (entries.length === 0) push('(nothing here yet)', 'dim');
      entries.forEach(en => {
        push(`commit ${shortHash(en.message)}`, 'hl');
        push(`    ${en.message}`);
      });

    } else if (cmd === 'git log --oneline') {
      entries.forEach(en => push(`${shortHash(en.message)} ${en.message}`));

    } else if (parts[0] === 'git' && parts[1] === 'show') {
      const found = allTagged.find(en => en.hash === parts[2]);
      if (found) {
        push(`commit ${found.hash} (${found.branch})`, 'hl');
        push(found.message);
        if (found.content) push(found.content, 'dim');
      } else {
        push(`fatal: bad object '${parts[2] ?? ''}'`, 'err');
      }

    } else if (cmd === 'ls') {
      if (currentBranch === 'main') push('README.md');
      else if (entries.length === 0) push('(empty)');
      else push(entries.map(en => en.file).join('  '));

    } else if (parts[0] === 'cat' && parts[1] === 'README.md') {
      push('# Gabriel Paiva', 'hl');
      push('BSc Student in Web Information Systems and Technologies @ ESMAD / Politécnico do Porto.');
      push('Focus: Backend Systems, REST APIs, and Self-Hosted Infrastructure.');

    } else if (parts[0] === 'cat') {
      const file = parts[1];
      const found = entries.find(en => en.file === file);
      if (found) push(found.content || '(empty file)');
      else push(`cat: ${file ?? ''}: No such file or directory`, 'err');

    } else if (cmd === 'contact') {
      push('email: mr.sousapaiva@gmail.com');
      push('github: https://github.com/Gabriel-S-Paiva');

    } else if (cmd === 'clear') {
      terminalHistory = [];

    } else {
      push(`command not found: ${cmd} — type 'help'`, 'err');
    }

    await scrollToBottom();
  }
</script>

<div class="fixed bottom-5 left-1/2 -translate-x-1/2 w-[min(480px,90vw)] z-40">
  <button
    bind:this={dockBtn}
    onclick={openTerminal}
    class="w-full h-12 flex items-center gap-2.5 bg-[var(--surface-2)] border border-[var(--line)] rounded-full px-4 cursor-pointer shadow-lg hover:border-[#3a4150] transition-colors"
  >
    <span class="text-[var(--green)] font-[family-name:var(--font-mono)] text-sm">›</span>
    <input readonly placeholder="try: git checkout skills" class="bg-transparent border-none outline-none text-[var(--text)] font-[family-name:var(--font-mono)] text-[13.5px] w-full cursor-pointer placeholder:text-[var(--dimmer)]" />
  </button>
</div>

{#if mounted}
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_interactive_supports_focus -->
  <div
    role="button"
    tabindex="-1"
    onclick={(e) => { if (e.target === e.currentTarget) requestClose(); }}
    class="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 cursor-default"
  >
    <div
      bind:this={panelEl}
      role="dialog"
      aria-modal="true"
      aria-label="Portfolio terminal"
      class="bg-[var(--surface-2)] border border-[var(--line)] flex flex-col shadow-2xl overflow-hidden cursor-auto"
    >
      <div class="flex justify-between items-center px-4 py-2.5 border-b border-[var(--line)] font-[family-name:var(--font-mono)] text-xs text-[var(--dimmer)]">
        <span>gabrielpaiva/portfolio — terminal · ({currentBranch})</span>
        <button type="button" onclick={requestClose} class="text-[var(--dim)] hover:text-[var(--text)] cursor-pointer bg-transparent border-none">esc ✕</button>
      </div>

      <div bind:this={historyEl} class="flex-1 overflow-y-auto p-4 font-[family-name:var(--font-mono)] text-xs leading-relaxed">
        {#each terminalHistory as line}
          <div class={line.type === 'dim' ? 'text-[var(--dim)]' : line.type === 'err' ? 'text-[#e88a8a]' : line.type === 'hl' ? 'text-[var(--green)]' : 'text-[var(--text)]'}>
            {line.text}
          </div>
        {/each}
      </div>

      <div class="flex items-center gap-2 px-4 py-2.5 border-t border-[var(--line)]">
        <span class="text-[var(--green)] font-[family-name:var(--font-mono)]">›</span>
        <input
          bind:this={inputEl}
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