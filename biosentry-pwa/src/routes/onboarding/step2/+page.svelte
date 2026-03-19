<script>
    import { onboarding } from "$lib/stores/onboarding.svelte";
    import { goto } from "$app/navigation";
    import Search from "lucide-svelte/icons/search";
    import Plus from "lucide-svelte/icons/plus";
    import X from "lucide-svelte/icons/x";
    import ChevronLeft from "lucide-svelte/icons/chevron-left";
    import ChevronRight from "lucide-svelte/icons/chevron-right";

    let conditionSearch = "";
    const suggestions = ["Diabetes", "Hypertension", "Asthma"]; // etc...

    function addCondition(c) {
        if (c && !onboarding.profile.chronicConditions.includes(c)) {
            onboarding.profile.chronicConditions = [
                ...onboarding.profile.chronicConditions,
                c,
            ];
            conditionSearch = "";
        }
    }
</script>

<div class="space-y-6 glass p-8">
    <h2 class="text-xl font-bold">Medical History</h2>

    <div class="relative">
        <div class="flex gap-2">
            <input
                bind:value={conditionSearch}
                placeholder="Search conditions..."
                class="input"
            />
            <button
                on:click={() => addCondition(conditionSearch)}
                class="btn btn-secondary"><Plus /></button
            >
        </div>
    </div>

    <div class="flex justify-between">
        <button
            on:click={() => goto("/onboarding/step2")}
            class="btn btn-outline"><ChevronLeft /> Back</button
        >
        <button
            on:click={() => goto("/onboarding/step4")}
            class="btn btn-primary">Next <ChevronRight /></button
        >
    </div>
</div>
