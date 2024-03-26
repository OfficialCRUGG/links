<script lang="ts">
  import { onMount } from "svelte";
  import music from "../assets/music.svg";

  let ws: WebSocket | null = null;
  let title = "";
  let artist = "";
  let cover = "";
  let start = 0;
  let end = 0;
  let progress = "0%";
  let trackId = "";
  let state: "connecting" | "playing" | "paused" | "disconnected" =
    "connecting";

  onMount(() => {
    ws = new WebSocket("wss://api.lanyard.rest/socket");
    ws.addEventListener("message", (event: any) => {
      console.log("a");
      const message = JSON.parse(event.data);
      console.log(message);
      switch (message.op) {
        case 1: {
          console.log("b");
          ws?.send(
            JSON.stringify({
              op: 2,
              d: {
                subscribe_to_id: "228965621478588416",
              },
            })
          );
          setInterval(() => {
            ws?.send(
              JSON.stringify({
                op: 3,
              })
            );
          }, message.d.heartbeat_interval);
          break;
        }
        case 0: {
          if (message.d.spotify) {
            state = "playing";
            title = message.d.spotify.song;
            artist = message.d.spotify.artist.replace("; ", ", ");
            cover = message.d.spotify.album_art_url;
            start = message.d.spotify.timestamps.start;
            end = message.d.spotify.timestamps.end;
            trackId = message.d.spotify.track_id;
          } else {
            state = "paused";
          }
        }
      }
    });
    setInterval(() => {
      if (state === "playing") {
        progress = `${Math.round(
          ((Date.now() - start) / (end - start)) * 100
        )}%`;
      }
    }, 1000);

    ws.addEventListener("close", () => {
      state = "disconnected";
    });
  });
</script>

{#if state === "playing"}
  <a class="musicoverlay" href="https://open.spotify.com/track/{trackId}">
    <img class="icon squiggly" src={music} alt="" />
    <div class="texts">
      <span class="squiggly title">{title}</span>
      <span class="squiggly artist">{artist}</span>
    </div>
    <img class="squiggly cover" src={cover} alt="" />
    <div class="progress-outer squiggly">
      <div class="progress-inner" style="width: {progress}" />
    </div>
  </a>
{/if}

<style>
  .musicoverlay {
    position: fixed;
    bottom: 0.5rem;
    right: 0.5rem;
    display: flex;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.05);
  }
  .musicoverlay .icon {
    width: 2rem;
    height: 2rem;
    margin-left: 0.5rem;
  }
  .musicoverlay .texts {
    display: flex;
    flex-direction: column;
    margin-left: 0.5rem;
  }
  .musicoverlay .texts .title {
    font-size: 1rem;
    font-weight: bold;
    margin-bottom: -0.25rem;
  }
  .musicoverlay .texts .artist {
    font-size: 0.75rem;
    color: #666;
  }
  .musicoverlay .cover {
    height: 3.5rem;
    aspect-ratio: 1 / 1;
    margin-left: 0.5rem;
  }
  .progress-outer {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 0.15rem;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.1);
  }
  .progress-inner {
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
  }
</style>
