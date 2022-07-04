<script lang="ts">
  import type { ComponentPropsT } from "src/types";

  export let containerProps: ComponentPropsT;
  export let bgImageUrl: string;
  export let bgColor: string;
  export let bgPosition: "top" | "center" | "bottom" = "center";
</script>
<div class="container relative" {...containerProps}>
  {#if bgImageUrl}
  <div 
    class="absolute top-0 left-0 w-full h-full bg-top rounded-lg backgroundImage" 
    style={`background: url('${bgImageUrl}'); z-index: -2; background-position: ${bgPosition}`}>
  </div>
  {/if}
  {#if bgColor}
  <div 
    class="absolute top-0 left-0 w-full h-full backgroundColor" 
    style={`background-color: ${bgColor}; z-index: -1;`}>
  </div>
  {/if}
  <slot />
</div>