<script>
    import { onboardingData } from "$lib/onboardingStore";
    import { userStore } from "$lib/authStore";
    import { db } from "$lib/firebase";
    import { doc, setDoc } from "firebase/firestore";
    import { goto } from "$app/navigation";
    import CheckCircle2 from "lucide-svelte/icons/check-circle-2";
import ChevronLeft from "lucide-svelte/icons/chevron-left";

    async function finish() {
        if (!$userStore) return;
        await setDoc(doc(db, "user_profiles", $userStore.uid), {
            ...$onboardingData,
            onboardingComplete: true,
            lastUpdated: new Date().toISOString()
        });
        goto("/dashboard");
    }
</script>

<div class="space-y-6 glass p-8">
    <h2 class="text-xl font-bold">Lifestyle</h2>
    <div class="text-center py-8">
        <CheckCircle2 size={48} class="text-secondary mx-auto mb-2" />
        <h3 class="font-bold">Ready to finish?</h3>
    </div>

    <div class="flex justify-between">
        <button on:click={() => goto("/onboarding/step3")} class="btn btn-outline"><ChevronLeft /> Back</button>
        <button on:click={finish} class="btn btn-primary">Complete Profile</button>
    </div>
</div>
