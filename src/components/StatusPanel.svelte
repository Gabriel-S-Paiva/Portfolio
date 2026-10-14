<script lang="ts">
  import { onMount } from 'svelte';
  import { formatAgo, isStale, parseStatus, type StatusPayload } from '../lib/status';

  // Link to the infra write-up. Leave undefined while the post is unpublished: no link is rendered.
  let { href = undefined }: { href?: string } = $props();

  const POLL_MS = 30_000;

  let data = $state<StatusPayload | null>(null);
  let lastSeen = $state<number | null>(null); // generatedAt of the last valid file, in Unix seconds
  let unavailable = $state(false);
  let loaded = $state(false);
  let now = $state(Date.now());

  // Dev only: ?status=ok|down|stale|fail picks a fixture so every state can be exercised.
  function devUrl(): { url: string; fresh: boolean } {
    const mode = new URLSearchParams(location.search).get('status') ?? 'ok';
    if (mode === 'down') return { url: '/status/fixtures/down.json', fresh: true };
    if (mode === 'stale') return { url: '/status/fixtures/stale.json', fresh: false };
    if (mode === 'fail') return { url: '/status/does-not-exist.json', fresh: false };
    return { url: '/status/status.json', fresh: true };
  }

  async function load() {
    try {
      let url = '/status/status.json';
      let fresh = false;
      if (import.meta.env.DEV) ({ url, fresh } = devUrl());
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) throw new Error(String(res.status));
      const parsed = parseStatus(await res.json());
      if (!parsed) throw new Error('bad shape');
      if (fresh) parsed.generatedAt = Math.floor(Date.now() / 1000); // fixtures would always look stale otherwise
      lastSeen = parsed.generatedAt;
      now = Date.now();
      if (isStale(parsed.generatedAt, now)) {
        data = null;
        unavailable = true;
      } else {
        data = parsed;
        unavailable = false;
      }
    } catch {
      data = null;
      unavailable = true;
    }
    loaded = true;
  }

  onMount(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    const start = () => {
      if (timer) return;
      load();
      timer = setInterval(load, POLL_MS);
    };
    const stop = () => {
      if (timer) clearInterval(timer);
      timer = undefined;
    };
    const onVisibility = () => (document.hidden ? stop() : start());
    if (!document.hidden) start();
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      stop();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  });

  const upSince = (s: number) => formatAgo(s);
  const allUp = $derived(data ? data.services.every((s) => s.state === 'up') : false);
</script>

<aside
  aria-label="Home server status"
  class="w-full max-w-[380px] bg-[var(--surface)] border border-[var(--line)] rounded-xl font-[family-name:var(--font-mono)] t-caption"
>
  <div class="flex items-center justify-between gap-3 px-4 py-3 border-b border-[var(--line)]">
    {#if href}
      <a {href} class="text-[var(--text)] no-underline hover:text-[var(--brass)] transition-colors">$ docker compose ps ↗</a>
    {:else}
      <span class="text-[var(--text)]">$ docker compose ps</span>
    {/if}
    {#if data}
      <span class="inline-flex items-center gap-1.5 {allUp ? 'text-[var(--green)]' : 'text-[var(--red)]'}">
        <span class="size-1.5 rounded-full bg-current"></span>{allUp ? 'live' : 'degraded'}
      </span>
    {/if}
  </div>

  <div class="px-4 py-3" aria-live="polite">
    {#if !loaded}
      <p class="text-[var(--dimmer)]">checking…</p>
    {:else if unavailable || !data}
      <p class="text-[var(--dim)]">
        status unavailable{#if lastSeen !== null}, last seen {formatAgo(now / 1000 - lastSeen)} ago{/if}
      </p>
    {:else}
      <ul class="space-y-1.5">
        {#each data.services as s (s.name)}
          <li class="flex items-center gap-2.5">
            <span
              class="size-2 rounded-full shrink-0 transition-colors duration-500 motion-reduce:transition-none {s.state === 'up' ? 'bg-[var(--green)]' : 'bg-[var(--red)]'}"
              role="img"
              aria-label={s.state}
            ></span>
            <span class="text-[var(--text)]">{s.name}</span>
            <span class="ml-auto text-[var(--dimmer)]">{s.state === 'up' ? s.uptime : 'down'}</span>
          </li>
        {/each}
      </ul>
      <dl class="mt-3 pt-3 border-t border-[var(--line)] grid grid-cols-3 gap-2 text-[var(--dim)]">
        <div><dt class="text-[var(--dimmer)]">load</dt><dd>{data.host.load1.toFixed(2)}</dd></div>
        <div><dt class="text-[var(--dimmer)]">mem</dt><dd>{data.host.mem_used_pct}%</dd></div>
        <div><dt class="text-[var(--dimmer)]">uptime</dt><dd>{upSince(data.host.uptime_s)}</dd></div>
      </dl>
    {/if}
  </div>
</aside>
