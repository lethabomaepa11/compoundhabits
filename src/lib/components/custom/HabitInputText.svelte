<script lang="ts">
	import { ArrowUp, SendHorizonal } from '@lucide/svelte';
	import Button from '../ui/button/button.svelte';
	import Textarea from '../ui/textarea/textarea.svelte';
	import { toast } from 'svelte-sonner';
	import isMobile from '$lib/hooks/isMobile';

	let inputText = $state('');

	const onSubmit = async (e: Event) => {
		e.preventDefault();
		if (inputText.length < 4) {
			toast.error('Error', {
				description: 'Text must be descriptive enough.'
			});
			return;
		}

		const response = await fetch('/api/process-flow', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ text: inputText })
		});
		toast.success('Text submitted: ');
	};

	const onKeyDown = async (e: KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey && !isMobile()) {
			await onSubmit(e);
		}
	};
</script>

<div class="absolute right-0 bottom-2 left-0 flex w-full items-center justify-center p-4">
	<div class="flex w-full items-end">
		<Textarea
			onkeydown={onKeyDown}
			class="max-h-[200px] rounded-3xl p-5 shadow"
			bind:value={inputText}
			placeholder="What did you do today?"
		/>
		<Button
			onclick={onSubmit}
			disabled={inputText.trim().length < 4}
			class="absolute right-8 mb-2 rounded-full"
			size="lg"
		>
			<ArrowUp />
		</Button>
	</div>
</div>
