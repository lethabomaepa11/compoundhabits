<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import { ModeWatcher } from 'mode-watcher';
	import ThemeToggle from '$lib/components/custom/ThemeToggle.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import HabitInputText from '$lib/components/custom/HabitInputText.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { LogIn, LogOut } from '@lucide/svelte';
	import { userState } from '$lib/hooks/User.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Toaster richColors closeButton />
<ModeWatcher />

<Sidebar.Provider>
	<AppSidebar />
	<Sidebar.Inset>
		<header class="flex h-16 shrink-0 items-center gap-2 px-4">
			<Sidebar.Trigger class="-ml-1" />
			<div class="flex w-full items-center justify-between">
				<h1 class="text-xl font-extrabold tracking-tight">CompoundHabits</h1>

				<div class="flex items-center gap-2">
					{#if !userState.isLoggedIn}
						<Button href="/login" variant="default" class="ml-4">Login <LogIn /></Button>
					{:else}
						<Button href="/api/auth/logout" variant="destructive" class="ml-4"
							>Logout <LogOut />
						</Button>
					{/if}
					<ThemeToggle />
				</div>
			</div>
		</header>

		{@render children()}
		<HabitInputText />
	</Sidebar.Inset>
</Sidebar.Provider>
