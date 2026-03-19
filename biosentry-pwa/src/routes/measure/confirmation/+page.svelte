<script>
    import { scale } from "svelte/transition";
    import { goto } from "$app/navigation";
    import { startVitalsFetch } from "$lib/measureStore";

    function confirmSessionEnd(isOver) {
        if (isOver) {
            goto("/measure/thankyou");
        } else {
            startVitalsFetch();
            goto("/measure/data");
        }
    }
</script>

<div
    in:scale
    class="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-12"
>
    <h2 class="text-4xl font-black tracking-tight">Is today's session over?</h2>
    <div class="grid grid-cols-2 gap-4 w-full px-4">
        <button
            on:click={() => confirmSessionEnd(true)}
            class="glass h-20 text-2xl font-bold border-primary/20 hover:bg-primary/10 transition-all"
            >Yes</button
        >
        <button
            on:click={() => confirmSessionEnd(false)}
            class="glass h-20 text-2xl font-bold border-white/10 hover:bg-white/10 transition-all"
            >No</button
        >
    </div>
    <button
        on:click={() => goto("/measure/risk")}
        class="glass p-4 px-8 rounded-full border-green-500/30 bg-green-500/5 text-green-400 font-bold hover:bg-green-500/10 transition-all active:scale-95"
    >
        Overall session completed!
    </button>
</div>
