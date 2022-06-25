<script>
  import "../app.css";
  import Header from "../components/header.svelte"
  import Footer from "../components/footer.svelte"
</script>

<Header />
<div class="p-8 max-w-6xl m-auto">
  <slot />
</div>
<Footer />