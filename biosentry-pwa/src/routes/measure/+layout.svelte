<script>
    import { page } from "$app/stores";
    import { fade } from "svelte/transition";
    import ArrowLeft from "lucide-svelte/icons/arrow-left";
    import PhoneCall from "lucide-svelte/icons/phone-call";
    import { goto } from "$app/navigation";
    import { selectedMedicationStore } from "$lib/medicationStore";
    import { showEmergencyPopup } from "$lib/measureStore";

    $: pathname = $page.url.pathname;

    function getTitle() {
        if (pathname === "/measure") return "Select Device";
        if (pathname === "/measure/data") return "Vitals Data";
        if (pathname === "/measure/camera") return "Camera Monitoring";
        if (pathname === "/measure/select") return "Select Medication";
        return "";
    }

    function handleBack() {
        if (pathname === "/measure") goto("/measure/select");
        else if (pathname === "/measure/data") goto("/measure");
        else if (pathname === "/measure/camera") goto("/measure/data");
        else goto("/dashboard");
    }

    $: title = getTitle();
    // hide header for specific stages
    $: hideHeader = [
        "/measure/thankyou",
        "/measure/risk",
        "/measure/confirmation",
    ].includes(pathname);
</script>

<div in:fade class="max-w-md mx-auto space-y-6 pb-24">
    <!-- Header (Hidden in summary stages) -->
    {#if !hideHeader}
        <div class="flex items-center justify-between py-4">
            <div class="flex items-center gap-4">
                <button
                    on:click={handleBack}
                    class="p-2 glass hover:bg-surface transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <h1 class="text-xl font-bold">{title}</h1>
            </div>

            {#if $selectedMedicationStore}
                <div
                    class="glass px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary border-primary/20"
                >
                    {$selectedMedicationStore.name}
                </div>
            {/if}
        </div>
    {/if}

    <slot />

    <!-- Emergency Popup (Persistent overlay for high vitals) -->
    {#if $showEmergencyPopup}
        <div
            class="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[100] p-6"
            transition:fade
        >
            <div
                class="glass max-w-sm w-full p-8 text-center border-red-500 shadow-[0_0_50px_rgba(239,68,68,0.3)]"
            >
                <div
                    class="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                    <PhoneCall class="text-red-500" size={40} />
                </div>
                <h2 class="text-3xl font-bold text-red-500 mb-2">
                    High Severity!
                </h2>
                <p class="text-text-muted mb-8 text-lg">
                    Metrics indicate an adverse reaction. Emergency contact has
                    been alerted.
                </p>
                <div class="space-y-3">
                    <button
                        class="w-full bg-red-500 hover:bg-red-600 text-white font-bold h-16 rounded-2xl text-xl shadow-lg shadow-red-500/30"
                    >
                        CALL 911 / 112
                    </button>
                    <button
                        on:click={() => ($showEmergencyPopup = false)}
                        class="w-full glass h-14 rounded-2xl font-bold text-text-muted"
                    >
                        Dismiss Alert
                    </button>
                </div>
            </div>
        </div>
    {/if}
</div>

<style>
    /* Add any local styles here */
    :global(body) {
        overflow-x: hidden;
    }
</style>
