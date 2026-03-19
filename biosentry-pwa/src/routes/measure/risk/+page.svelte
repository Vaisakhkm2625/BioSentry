<script>
    import { fade, scale } from "svelte/transition";
    import History from "lucide-svelte/icons/history";
    import PhoneCall from "lucide-svelte/icons/phone-call";
    import X from "lucide-svelte/icons/x";
    import { goto } from "$app/navigation";
    import { severity } from "$lib/measureStore";

    let showRiskAlert = true;

    function finish() {
        goto("/dashboard");
    }
</script>

<div in:fade class="space-y-6 pt-6 px-2 pb-24 h-screen">
    <!-- Title & Line -->
    <div class="space-y-4 relative">
        <button
            class="absolute top-0 right-0 p-2 text-text-muted hover:text-primary transition-colors"
            on:click={() => goto("/dashboard")}
        >
            <History size={24} />
        </button>
        <h2 class="text-3xl font-bold tracking-tight text-white">
            ADR Risk Prediction
        </h2>
        <div class="h-[1px] w-full bg-white/20"></div>
    </div>

    <!-- Radio Options style selection -->
    <div class="space-y-4 py-4">
        {#each ["Low", "Medium", "High"] as level}
            <div
                class="flex items-center gap-4 transition-opacity {$severity ===
                level
                    ? 'opacity-100'
                    : 'opacity-40'}"
            >
                <div
                    class="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center relative"
                >
                    {#if $severity === level}
                        <div
                            class="w-5 h-5 bg-white rounded-full flex items-center justify-center"
                        >
                            <div
                                in:scale
                                class="w-2 h-2 bg-black rounded-full"
                            ></div>
                        </div>
                    {/if}
                </div>
                <span class="text-2xl font-bold">{level}</span>
            </div>
        {/each}
    </div>

    <!-- Alert Box (matching wireframe) -->
    {#if $severity === "High" && showRiskAlert}
        <div
            in:scale
            class="bg-white rounded-[40px] p-8 space-y-6 relative text-black shadow-2xl"
        >
            <button
                on:click={() => (showRiskAlert = false)}
                class="absolute top-6 right-8 text-black/40 hover:text-black transition-colors"
            >
                <X size={28} />
            </button>

            <div class="text-center space-y-2 pt-2">
                <h3 class="text-3xl font-black">High ADR Risk</h3>
                <p class="text-xl font-medium">Please consult a doctor!</p>
            </div>

            <button
                on:click={() => (showRiskAlert = false)}
                class="w-40 bg-zinc-200 hover:bg-zinc-300 text-black font-bold h-14 rounded-2xl mx-auto block text-xl border border-black/10 shadow-sm"
            >
                OK
            </button>
        </div>
    {/if}

    <!-- Bottom Buttons (matching wireframe) -->
    <div class="pt-8 grid grid-cols-2 gap-4">
        <button
            class="bg-zinc-100 hover:bg-zinc-200 text-black font-bold h-16 rounded-2xl flex items-center justify-center gap-2 text-lg border border-zinc-300 shadow-sm"
        >
            <PhoneCall size={20} /> Emergency Call
        </button>
        <button
            class="bg-zinc-100 hover:bg-zinc-200 text-black font-bold h-16 rounded-2xl flex items-center justify-center text-lg border border-zinc-300 shadow-sm"
        >
            Report ADR
        </button>
    </div>

    <button
        on:click={finish}
        class="w-full text-text-muted hover:text-white transition-colors py-4 font-medium"
    >
        Return to Home
    </button>
</div>
