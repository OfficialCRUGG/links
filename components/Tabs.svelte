<script lang="ts">
  import underline from "../assets/underline.svg";
  import keyArrowLeft from "../assets/keys/ArrowLeft.svg";
  import keyArrowRight from "../assets/keys/ArrowRight.svg";

  export let tab: string = "en";
  export let keyboardMode: boolean = false;

  const tabs = [
    { id: "en", label: "English" },
    { id: "de", label: "German" },
  ];

  function keydown(event: KeyboardEvent) {
    if (event.key === "ArrowRight") {
      const index = tabs.findIndex((t) => t.id === tab);
      tab = tabs[(index + 1) % tabs.length].id;
    } else if (event.key === "ArrowLeft") {
      const index = tabs.findIndex((t) => t.id === tab);
      tab = tabs[(index - 1 + tabs.length) % tabs.length].id;
    }
  }
</script>

<svelte:window on:keydown={keydown} />

<nav class="tabs {keyboardMode ? 'keyboardmode' : ''}">
  <img class="key squiggly" src={keyArrowLeft} alt="" />
  {#each tabs as { id, label }, i}
    <a
      href={`#${id}`}
      class={(tab === id ? "active" : "") + " squiggly"}
      on:click={() => (tab = id)}
    >
      <span>
        {label}
      </span>
      <img class="underline" src={underline} alt="" />
    </a>
  {/each}
  <img class="key squiggly" src={keyArrowRight} alt="" />
</nav>

<style>
  nav.tabs {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin: 0.5rem 0;
  }
  nav.tabs a {
    position: relative;
    font-size: 1.5rem;
    text-transform: lowercase;
  }
  nav.tabs a img.underline {
    position: absolute;
    width: 100%;
    left: 0;
    bottom: -0.25rem;
    opacity: 0;
  }
  nav.tabs a:hover img.underline {
    opacity: 0.25;
  }
  nav.tabs a.active img.underline {
    opacity: 1;
  }
  nav.tabs .key {
    width: 1.5rem;
    height: 1.5rem;
    pointer-events: none;
    opacity: 0;
  }
  nav.tabs.keyboardmode .key {
    opacity: 1;
  }
</style>
