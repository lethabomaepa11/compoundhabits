<script lang="ts">
	import { ArrowUp, SendHorizonal } from '@lucide/svelte';
	import Button from '../ui/button/button.svelte';
	import Textarea from '../ui/textarea/textarea.svelte';
	import { toast } from 'svelte-sonner';
	import isMobile from '$lib/hooks/isMobile';

	let inputText = $state('');

	class Habit {
		category: string;
		title: string;
		goal?: string;
		notes: string;

		constructor(category: string, title: string, notes: string, goal?: string) {
			this.category = category;
			this.title = title;
			this.goal = goal;
			this.notes = notes;
		}
	}
	const onSubmit = (e: Event) => {
		e.preventDefault();
		if (inputText.length < 4) {
			toast.error('Error', {
				description: 'Text must be descriptive enough.'
			});
			return;
		}

		toast.success('Text submitted: ');

		let newHabit;
		if (inputText.includes('study')) {
			newHabit = new Habit(
				'Studies',
				'Study daily for 30 days',
				'None',
				'Get 80% for my final exams'
			);
		}
	};

	const onKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey && !isMobile()) {
			onSubmit(e);
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
