<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from '$lib/components/ui/sonner';
	import { userState } from '$lib/hooks/User.svelte';

	let { children, data } = $props();

	userState.isLoggedIn = data.isLoggedIn;
	userState.user = data.profile;
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Toaster richColors closeButton />
<ModeWatcher />

{@render children()}
