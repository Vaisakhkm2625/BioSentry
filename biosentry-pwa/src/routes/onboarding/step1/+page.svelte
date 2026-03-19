<script>
    import { onboarding } from "$lib/stores/onboarding.svelte";
    import { goto } from "$app/navigation";
    import { fade, slide } from "svelte/transition";
    import ChevronRight from "lucide-svelte/icons/chevron-right";
    import AlertCircle from "lucide-svelte/icons/alert-circle";
    import { isValidContact } from "$lib/validation";

    let errors = { gender: "", dob: "", contactInfo: "", location: "" };

    function next() {
        let isValid = true;
        if (!onboarding.profile.gender) {
            errors.gender = "Required";
            isValid = false;
        }
        if (!onboarding.profile.dob) {
            errors.dob = "Required";
            isValid = false;
        }
        if (!isValidContact(onboarding.profile.contactInfo)) {
            errors.contactInfo = "Invalid contact";
            isValid = false;
        }

        if (isValid) goto("/onboarding/step2");
    }
</script>

<div in:fade class="space-y-6 glass p-8">
    <h2 class="text-xl font-bold">Demographics</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label class="block">
            <span class="text-sm font-medium">Gender</span>
            <select bind:value={onboarding.profile.gender} class="input">
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
            </select>
        </label>
    </div>

    <div class="flex justify-end">
        <button on:click={next} class="btn btn-primary w-32">
            Next <ChevronRight size={20} />
        </button>
    </div>
</div>
