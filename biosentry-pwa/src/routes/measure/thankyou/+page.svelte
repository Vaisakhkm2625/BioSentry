<script>
    import { onMount } from "svelte";
    import { fade, scale } from "svelte/transition";
    import CheckCircle2 from "lucide-svelte/icons/check-circle-2";
    import { goto } from "$app/navigation";

    onMount(() => {
        const timer = setTimeout(() => {
            goto("/measure/risk");
        }, 2000);
        return () => clearTimeout(timer);
    });
</script>

<div
    in:fade
    out:fade
    class="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8"
>
    <h2 class="text-5xl font-black">Thank you!</h2>
    <div
        class="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.2)]"
    >
        <div in:scale={{ delay: 200 }}>
            <CheckCircle2 size={64} class="text-green-500" />
        </div>
    </div>
    <p class="text-2xl text-text-muted italic font-medium">Have a great day!</p>
</div>
