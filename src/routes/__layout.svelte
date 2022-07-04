<script>
  import "../app.css";
  import Header from "../components/Header.svelte"
  import Footer from "../components/Footer.svelte"
</script>

<svelte:head>
  <title>Popos | Make Your Space</title>
</svelte:head>

<Header />
<div class="max-w-6xl p-8 m-auto">
  <slot />
</div>
<Footer />