<script lang="ts">
  import { onMount } from "svelte";
  import Tabs from "./components/Tabs.svelte";
  import Linklist from "./components/Linklist.svelte";
  import { links } from "./lib/links";
  import type { Language } from "./lib/types";
  import MusicOverlay from "./components/MusicOverlay.svelte";

  let tab: Language = "en";
  let keyboardMode = false;

  $: filteredLinks = links.filter((l) => l.language === tab);

  onMount(() => {
    const url = new URL(window.location.href);
    const hash = url.hash;
    if (hash === "#de") tab = "de";

    console.log(`
                       _     
                      | |    
   ___ _ __ __ _   ___| |__  
  / __| '__/ _\` | / __| '_ \\ 
 | (__| | | (_| |_\\__ \\ | | |
  \\___|_|  \\__, (_)___/_| |_|
            __/ |  hey  👋      
           |___/    there!


    you can find the source code here:
  https://github.com/OfficialCRUGG/links
    `);
  });
</script>

<svelte:window
  on:keydown={() => (keyboardMode = true)}
  on:mousemove={() => (keyboardMode = false)}
/>

<div id="contents">
  <h1 class="squiggly">CRUGG's Links</h1>
  <Tabs bind:keyboardMode bind:tab />
  <Linklist bind:keyboardMode links={filteredLinks} />
</div>
<MusicOverlay />

<svg
  xmlns="http://www.w3.org/2000/svg"
  version="1.1"
  style="position:absolute;display:hidden;pointer-events:none;"
>
  <defs>
    <filter id="squiggly-0">
      <feTurbulence
        id="turbulence"
        baseFrequency="0.02"
        numOctaves="3"
        result="noise"
        seed="0"
      />
      <feDisplacementMap
        id="displacement"
        in="SourceGraphic"
        in2="noise"
        scale="2"
      />
    </filter>
    <filter id="squiggly-1">
      <feTurbulence
        id="turbulence"
        baseFrequency="0.02"
        numOctaves="3"
        result="noise"
        seed="1"
      />
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" />
    </filter>

    <filter id="squiggly-2">
      <feTurbulence
        id="turbulence"
        baseFrequency="0.02"
        numOctaves="3"
        result="noise"
        seed="2"
      />
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
    </filter>
    <filter id="squiggly-3">
      <feTurbulence
        id="turbulence"
        baseFrequency="0.02"
        numOctaves="3"
        result="noise"
        seed="3"
      />
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" />
    </filter>

    <filter id="squiggly-4">
      <feTurbulence
        id="turbulence"
        baseFrequency="0.02"
        numOctaves="3"
        result="noise"
        seed="4"
      />
      <feDisplacementMap in="SourceGraphic" in2="noise" scale="1" />
    </filter>
  </defs>
</svg>

<style>
  h1 {
    font-size: 3rem;
    font-weight: bold;
    text-align: center;
  }
</style>
