<script lang="ts">
	import { goto } from '$app/navigation';
	import SEO from '$lib/components/custom/SEO.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Field from '$lib/components/ui/field/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Spinner } from '$lib/components/ui/spinner';
	import { userState } from '$lib/hooks/User.svelte';
	import { toast } from 'svelte-sonner';

	const userInput = $state({ email: '', password: '', fname: '', lname: '' });
	let form = $state({
		isLoading: false,
		errorMessage: ''
	});

	const handleSubmit = async (event: Event) => {
		event.preventDefault();
		form.isLoading = true;
		form.errorMessage = '';

		const response = await fetch('/api/auth/signup', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				email: userInput.email,
				password: userInput.password,
				fname: userInput.fname,
				lname: userInput.lname
			})
		});

		const data = await response.json();

		if (response.ok) {
			// Handle successful login (e.g., redirect, show message)
			toast.success('Account creation successful:', {
				description: data.message || 'Your account has been created.'
			});
			goto('/login', { invalidateAll: true });
		} else {
			// Handle login error (e.g., show error message)
			toast.error('Signup failed:', {
				description: data.error || 'An error occurred during signup.'
			});
			form.errorMessage = data.error || 'An error occurred during signup.';
		}
		form.isLoading = false;
	};
</script>

<SEO title="Signup" description="Create your CompoundHabits account" />

<div class="flex w-full items-center justify-center p-4">
	<form
		onsubmit={handleSubmit}
		class="w-full space-y-6 rounded-lg p-6 lg:w-2/5 lg:border lg:shadow-md"
	>
		<Field.Group>
			<Field.Set>
				<Field.Legend>Create an Account</Field.Legend>
				<Field.Description>Enter the required information</Field.Description>
				{#if form.errorMessage}
					<p class="text-red-600">{form.errorMessage}</p>
				{/if}
				<Field.Group>
					<Field.Field>
						<Field.Label for="fname">First name</Field.Label>
						<Input
							bind:value={userInput.fname}
							class="shadow-none"
							id="fname"
							placeholder="John"
							required
						/>
					</Field.Field>
					<Field.Field>
						<Field.Label for="lname">Last name</Field.Label>
						<Input
							bind:value={userInput.lname}
							class="shadow-none"
							id="lname"
							placeholder="Doe"
							required
						/>
					</Field.Field>
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
					<Button type="submit" class="w-full">Signup</Button>
				{/if}
			</Field.Field>
			<Button href="/login" variant="link" class="w-full text-center"
				>Already have an account? Login</Button
			>
		</Field.Group>
	</form>
</div>
