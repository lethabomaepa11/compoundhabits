<script lang="ts">
	import { page } from '$app/state';

	let {
		title,
		description,
		img = 'https://colearnspace.netlify.app/site/branding/ColearnSpace-icon2.png',
		langs = ['en-ZA', 'en-US']
	} = $props();

	const iso15924to31661 = (lang: string) => {
		if (lang === 'zh_hans') return 'zh-cn';
		if (lang === 'zh_hant') return 'zh-tw';
		return lang;
	};

	title += ' - CompoundHabits';
	description = description || 'Build better habits with CompoundHabits.';
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="descriptionription" content={description} />

	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:descriptionription" content={description} />
	<meta name="twitter:image" content={img} />
	<meta name="twitter:image:alt" content={title} />

	<meta property="og:title" content={title} />
	<meta property="og:descriptionription" content={description} />
	<meta property="og:image" content={img} />

	<link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />
	<link rel="canonical" href={page.url.pathname} />

	{#each langs as lang}
		<link
			rel="alternate"
			hreflang={iso15924to31661(lang)}
			href={`https://chabits.titanisys.co.za/${page.url.pathname}?lang=${lang}`}
		/>
	{/each}
</svelte:head>
