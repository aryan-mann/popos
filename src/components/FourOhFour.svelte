<script>
	import {onDestroy} from "svelte";
	import { goto } from '$app/navigation';
	const timerMaxSecs = 6;

	function goHome() {
		goto('/')
	}

	let currentTimerSecs = timerMaxSecs;
	const timerInterval = setInterval(() => {
		if (currentTimerSecs >= 1)
			currentTimerSecs -= 1;
		if (currentTimerSecs <= 0)
			goHome();
	}, 1000);
	onDestroy(() => { clearInterval(timerInterval) })
</script>

<style>
	@keyframes moveLeftRight {
		to {
			background-position: 100% center;
		}
	}
	.animated-404 {
		text-transform: uppercase;
		background-image: linear-gradient(
				-225deg,
				#40da95 0%,
				#ff1361 50%,
				#fff800 100%
		);
		background-size: 200% auto;
		color: #fff;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		animation: moveLeftRight 3s linear infinite alternate-reverse;

		font-size: 200px;
		line-height: 180px;
	}
</style>

<div class="h-96 flex flex-col justify-center items-center space-y-4">
	<div class="animated-404 my-2">404</div>
	<p class="text-2xl">Taking you back home in {currentTimerSecs} secs..</p>
</div>
