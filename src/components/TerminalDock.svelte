<script lang="ts">
  import { onMount } from 'svelte';
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

  let isOpen = $state(false);
  let commandInput = $state('');
  let terminalHistory = $state<{ text: string; type?: 'dim' | 'err' | 'hl' }[]>([]);
  let currentBranch = $state<Branch>('main');
  let mainEntries = $state<Entry[]>([{ file: '', message: 'git init', content: 'initialized empty repository' }]);

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
    // main's log is read live from the DOM GitGraph already annotated — same source, never drifts
    const sections = Array.from(document.querySelectorAll<HTMLElement>('.gitline'));
    const entries: Entry[] = [{ file: '', message: 'git init', content: 'initialized empty repository' }];
    sections.forEach(sec => {
      const msg = sec.dataset.commit;
      if (msg) entries.push({ file: sec.id, message: msg, content: '' });
    });
    mainEntries = entries;
  });

  function push(text: string, type?: 'dim' | 'err' | 'hl') {
    terminalHistory.push({ text, type });
  }

  function openTerminal() {
    isOpen = true;
    if (terminalHistory.length === 0) {
      push("welcome — interactive shell for Gabriel Paiva's portfolio.", 'dim');
      push("type 'help' to see available commands.", 'dim');
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') isOpen = false;
  }

  function executeCommand(e: KeyboardEvent) {
    if (e.key !== 'Enter') return;
    const cmd = commandInput.trim();
    push(`> ${cmd}`);
    commandInput = '';
    if (!cmd) return;
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
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="fixed bottom-5 left-1/2 -translate-x-1/2 w-[min(480px,90vw)] z-40">
  <button
    onclick={openTerminal}
    class="w-full flex items-center gap-2.5 bg-[var(--surface-2)] border border-[var(--line)] rounded-full px-4 py-3 cursor-pointer shadow-lg hover:border-[#3a4150] transition-colors"
  >
    <span class="text-[var(--green)] font-[family-name:var(--font-mono)] text-sm">›</span>
    <input readonly placeholder="try: git checkout skills" class="bg-transparent border-none outline-none text-[var(--text)] font-[family-name:var(--font-mono)] text-[13.5px] w-full cursor-pointer placeholder:text-[var(--dimmer)]" />
  </button>
</div>

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
        <span>gabrielpaiva/portfolio — terminal · ({currentBranch})</span>
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