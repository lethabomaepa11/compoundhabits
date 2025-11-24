<script lang="ts">
	import { goto } from '$app/navigation';
	import SEO from '$lib/components/custom/SEO.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Field from '$lib/components/ui/field/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Spinner } from '$lib/components/ui/spinner/index.js';
	import { userState } from '$lib/hooks/User.svelte';
	import { toast } from 'svelte-sonner';

	const userInput = $state({ email: '', password: '' });
	let form = $state({
		isLoading: false,
		errorMessage: ''
	});

	const handleSubmit = async (event: Event) => {
		event.preventDefault();
		form.isLoading = true;
		form.errorMessage = '';

		const response = await fetch('/api/auth/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email: userInput.email,
				password: userInput.password
			})
		});

		const data = await response.json();

		if (response.ok) {
			// Handle successful login (e.g., redirect, show message)
			toast.success('Login successful:', data);
			userState.isLoggedIn = true;
			userState.user = data.data;
			goto('/', { invalidateAll: true });
		} else {
			// Handle login error (e.g., show error message)
			toast.error('Login failed:', {
				description: data.error || 'An error occurred during login.'
			});
			form.errorMessage = data.error || 'An error occurred during login.';
		}
		form.isLoading = false;
	};
</script>

<SEO title="Login" description="Login to your CompoundHabits account" />

<div class="flex min-h-screen w-full items-center justify-center">
	<form
		onsubmit={handleSubmit}
		class="w-full space-y-6 rounded-lg p-6 lg:w-2/5 lg:border lg:shadow-md"
	>
		<Field.Group>
			<Field.Set>
				<Field.Legend>Login to your account</Field.Legend>
				<Field.Description>Enter your email and password</Field.Description>

				{#if form.errorMessage}
					<p class="text-red-600">{form.errorMessage}</p>
				{/if}
				<Field.Group>
					<Field.Field>
						<Field.Label for="email">Email</Field.Label>
						<Input
							bind:value={userInput.email}
							class="shadow-none"
							id="email"
							placeholder="johndoe@example.com"
							required
						/>
					</Field.Field>
					<Field.Field>
						<Field.Label for="password">Password</Field.Label>
						<Input
							bind:value={userInput.password}
							type="password"
							class="shadow-none"
							id="password"
							placeholder="**********"
							required
						/>
						<Field.Description>Must be at least 6 characters</Field.Description>
					</Field.Field>
				</Field.Group>
			</Field.Set>
			<Field.Field orientation="horizontal">
				{#if form.isLoading}
					<Button type="submit" class="w-full" disabled>
						<Spinner />
						Loading...
					</Button>
				{:else}
					<Button type="submit" class="w-full">Login</Button>
				{/if}
			</Field.Field>
			<Button href="/signup" variant="link" class="w-full text-center"
				>Don't have an account? Sign up</Button
			>
		</Field.Group>
	</form>
</div>
