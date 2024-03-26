<script lang="ts">
  import type { Link } from "../lib/types";
  import arrow from "../assets/arrow.svg";
  import dropdownOpen from "../assets/dropdown_open.svg";
  import dropdownClosed from "../assets/dropdown_closed.svg";
  import keyArrowUp from "../assets/keys/ArrowUp.svg";
  import keyArrowDown from "../assets/keys/ArrowDown.svg";
  import keyEnter from "../assets/keys/Enter.svg";

  export let links: Link[] = [];
  export let keyboardMode: boolean = false;

  $: activeLinks = links.filter((l) => !l.inactive);
  $: inactiveLinks = links.filter((l) => l.inactive);

  let index = -1;
  let showInactive = false;

  function toggleInactive() {
    showInactive = !showInactive;
    if (!showInactive && index > activeLinks.length) index = activeLinks.length;
  }

  function keydown(event: KeyboardEvent) {
    const limit = showInactive
      ? activeLinks.length + inactiveLinks.length
      : inactiveLinks.length > 0
        ? activeLinks.length
        : activeLinks.length - 1;

    switch (event.key) {
      case "ArrowDown":
        if (index === -1) return (index = 0);
        if (index >= limit) return (index = 0);
        index++;
        break;
      case "ArrowUp":
        if (index === -1) return (index = limit);
        if (index <= 0) return (index = limit);
        index--;
        break;
      case "Enter":
      case " ":
        if (index === -1) return;
        function open(link: Link) {
          window.open(formatLink(link), "_blank");
        }
        if (index < activeLinks.length) {
          open(activeLinks[index]);
        } else if (index > activeLinks.length) {
          open(inactiveLinks[index - activeLinks.length - 1]);
        } else {
          toggleInactive();
        }
        break;
    }
  }

  function formatLink(link: Link) {
    if (!link.username) return link.url;
    return link.url
      .replace(/%[@m]/, link.username.split("@")[1])
      .replace("%_", link.username.toLowerCase())
      .replace("%", link.username);
  }
</script>

<svelte:window on:keydown={keydown} />

<ul class="linklist {keyboardMode ? 'keyboardmode' : ''}">
  <li>
    <img class="key squiggly" src={keyArrowUp} alt="" />
  </li>
  {#each activeLinks as link, i}
    {@const active = index === i}
    <li class="linklistitem">
      <a
        on:mouseenter={() => (index = i)}
        href={formatLink(link)}
        target="_blank"
        rel="noopener noreferrer"
        class={(active ? "active" : "") + " squiggly"}
      >
        <img src={arrow} alt="" />
        <span>
          <span class="linktitle">{link.title}</span>
          <span class="username">({link.username})</span>
        </span>
      </a>
      <img
        class="key squiggly {!active ? 'forced-invisible' : ''}"
        src={keyEnter}
        alt=""
      />
    </li>
  {/each}
  {#if inactiveLinks.length > 0}
    <li class="inactivelist">
      <div class="inactivelistbuttonwrapper">
        <button
          class={(index === activeLinks.length ? "highlighted" : "") +
            " squiggly"}
          on:click={toggleInactive}
          on:mouseenter={() => (index = activeLinks.length)}
        >
          <img src={showInactive ? dropdownOpen : dropdownClosed} alt="" />
          <p>inactive social media</p>
        </button>
        <img
          class="key squiggly {index !== activeLinks.length
            ? 'forced-invisible'
            : ''}"
          src={keyEnter}
          alt=""
        />
      </div>
      {#if showInactive}
        {#each inactiveLinks as link, i}
          {@const actualIndex = activeLinks.length + i + 1}
          {@const active = index === actualIndex}
          <li class="linklistitem">
            <a
              on:mouseenter={() => (index = actualIndex)}
              href={formatLink(link)}
              target="_blank"
              rel="noopener noreferrer"
              class={(active ? "active" : "") + " squiggly"}
            >
              <img src={arrow} alt="" />
              <span>
                <span class="linktitle">{link.title}</span>
                <span class="username">({link.username})</span>
              </span>
            </a>
            <img
              class="key squiggly {!active ? 'forced-invisible' : ''}"
              src={keyEnter}
              alt=""
            />
          </li>
        {/each}
      {/if}
    </li>
  {/if}
  <li>
    <img class="key squiggly" src={keyArrowDown} alt="" />
  </li>
</ul>

<style>
  ul.linklist {
    list-style: none;
    padding: 0;
    margin: 0;
    margin-top: 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: start;
  }
  ul.linklist li.linklistitem {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  ul.linklist li a {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0.5rem 0;
    font-size: 1.5rem;
    padding: 0 0.5rem 0 0.2rem;
  }
  ul.linklist li a span span.linktitle {
    text-transform: lowercase;
  }
  ul.linklist li a img {
    width: 1rem;
    height: 1rem;
  }
  ul.linklist li a.active {
    background-color: rgba(173, 20, 255, 0.1);
  }
  @media (prefers-color-scheme: dark) {
    ul.linklist li a.active {
      background-color: rgba(209, 123, 255, 0.2);
    }
  }
  ul.linklist li a span.username {
    font-size: 1rem;
    color: #666;
    opacity: 0;
    user-select: none;
    pointer-events: none;
  }
  ul.linklist li a.active span.username {
    opacity: 1;
  }
  ul.linklist li a img {
    opacity: 0;
    user-select: none;
    -webkit-user-drag: none;
  }
  ul.linklist li a.active img {
    opacity: 1;
  }
  ul.linklist button {
    display: block;
    display: flex;
    align-items: center;
    background: none;
    border: none;
    font-size: 1.5rem;
    font-family: inherit;
    cursor: pointer;
    color: inherit;
  }

  ul.linklist button img {
    width: 1.5rem;
    height: 1.5rem;
    margin-right: 0.5rem;
  }
  ul.linklist .inactivelist {
    opacity: 0.5;
  }
  ul.linklist button.highlighted {
    background-color: rgba(173, 20, 255, 0.1);
  }
  ul.linklist .key {
    height: 1.5rem;
    width: 1.5rem;
    margin-top: 0.5rem;
    margin-left: 0.5rem;
    pointer-events: none;
    opacity: 0;
  }
  ul.linklist.keyboardmode .key {
    opacity: 1;
  }
  .forced-invisible {
    opacity: 0 !important;
  }
  .inactivelistbuttonwrapper {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: inherit;
  }
</style>
