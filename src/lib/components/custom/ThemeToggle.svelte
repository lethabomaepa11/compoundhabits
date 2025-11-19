<script>
	import { mode, toggleMode } from "mode-watcher";
	import Button from "../ui/button/button.svelte";
    import {Moon, Sun} from "@lucide/svelte";
</script>

<Button onclick={toggleMode} variant="outline">
    {#if mode.current === "light"}
        <Moon/>
    {:else}
        <Sun/>
    {/if}
    <span class="sr-only">Toggle Theme</span>
</Button>