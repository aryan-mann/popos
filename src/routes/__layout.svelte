<script>
  import "../app.css";
  import Header from "../components/Header.svelte"
  import Footer from "../components/Footer.svelte"
</script>

<svelte:head>
  <title>Popos | Make Your Space</title>
</svelte:head>

<Header />
<div class="p-8 max-w-6xl m-auto">
  <slot />
</div>
<Footer />