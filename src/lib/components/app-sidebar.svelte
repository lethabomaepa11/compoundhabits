<script lang="ts" module>
	// sample data
	const data = {
		navMain: [
			{
				title: 'Pinned',
				icon: PinIcon,
				url: '#',
				items: [
					{
						title: 'Finance',
						url: '/finance',
						isActive: false
					},
					{
						title: 'Relationship',
						url: '/relationship',
						isActive: false
					}
				]
			},
			{
				title: 'All',
				url: '#',
				items: [
					{
						title: 'Fitness',
						url: '/fitness',
						isActive: false
					},
					{
						title: 'Studies',
						url: '/studies',
						isActive: true
					}
				]
			}
		]
	};
</script>

<script lang="ts">
	import { page } from '$app/state';

	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import { PinIcon } from '@lucide/svelte';
	import type { ComponentProps } from 'svelte';

	let { ref = $bindable(null), ...restProps }: ComponentProps<typeof Sidebar.Root> = $props();
</script>

<Sidebar.Root {...restProps} bind:ref>
	<Sidebar.Header>
		<h1 class="mx-2 mt-3 text-lg font-semibold">Habits</h1>
	</Sidebar.Header>
	<Sidebar.Content>
		<!-- We create a Sidebar.Group for each parent. -->
		{#each data.navMain as group (group.title)}
			<Sidebar.Group>
				<Sidebar.GroupLabel>{group.title}</Sidebar.GroupLabel>
				<Sidebar.GroupContent>
					<Sidebar.Menu>
						{#each group.items as item (item.title)}
							<Sidebar.MenuItem>
								<Sidebar.MenuButton isActive={page.url.pathname.includes(item.url)}>
									{#snippet child({ props })}
										<a href="/habit{item.url}" {...props}>{item.title}</a>
									{/snippet}
								</Sidebar.MenuButton>
							</Sidebar.MenuItem>
						{/each}
					</Sidebar.Menu>
				</Sidebar.GroupContent>
			</Sidebar.Group>
		{/each}
	</Sidebar.Content>
	<Sidebar.Rail />
</Sidebar.Root>
