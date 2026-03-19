// $lib/onboarding.svelte.js
import { isValidContact } from "$lib/validation";

class OnboardingStore {
    step = $state(1);
    totalSteps = 4;
    
    profile = $state({
        gender: "",
        dob: "",
        contactInfo: "",
        location: "",
        weight: null,
        height: null,
        bloodGroup: "",
        chronicConditions: [],
        vaccinations: [],
        pastMedications: [],
        smoking: false,
        alcohol: false,
        drugUse: false,
    });

    errors = $state({});

    validateStep() {
        this.errors = {};
        if (this.step === 1) {
            if (!this.profile.gender) this.errors.gender = "Required";
            if (!this.profile.dob) this.errors.dob = "Required";
            if (!this.profile.location) this.errors.location = "Required";
            if (!isValidContact(this.profile.contactInfo)) {
                this.errors.contactInfo = "Invalid contact info";
            }
        } else if (this.step === 2) {
            if (!this.profile.weight || this.profile.weight <= 0) this.errors.weight = "Invalid weight";
            if (!this.profile.height || this.profile.height <= 0) this.errors.height = "Invalid height";
            if (!this.profile.bloodGroup) this.errors.bloodGroup = "Required";
        }
        return Object.keys(this.errors).length === 0;
    }

    next() {
        if (this.validateStep() && this.step < this.totalSteps) this.step++;
    }

    prev() {
        if (this.step > 1) this.step--;
    }
}

export const onboarding = new OnboardingStore();
