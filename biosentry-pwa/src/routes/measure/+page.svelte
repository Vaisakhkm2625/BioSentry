<script>
    import { onMount, onDestroy } from "svelte";
    import Zap from "lucide-svelte/icons/zap";
    import Camera from "lucide-svelte/icons/camera";
    import CheckCircle2 from "lucide-svelte/icons/check-circle-2";
    import ChevronRight from "lucide-svelte/icons/chevron-right";
    import { fade } from "svelte/transition";
    import { goto } from "$app/navigation";
    import { deviceStore } from "$lib/deviceStore";
    import { userStore } from "$lib/authStore";
    import { getDatabase, ref, onValue } from "firebase/database";
    import { getApp } from "firebase/app";

    let isPaired = false;
    let myDevices = [];
    let rtdbUnsubscribe = null;
    let selectedDevice = null;

    function activateMonitoring() {
        goto("/measure/data");
    }

    onMount(() => {
        const unsubscribeAuth = userStore.subscribe((user) => {
            if (user && !rtdbUnsubscribe) {
                const rtdb = getDatabase(getApp());
                const devicesRef = ref(rtdb, `users/${user.uid}/devices`);
                rtdbUnsubscribe = onValue(devicesRef, (snapshot) => {
                    const data = snapshot.val();
                    if (data) {
                        myDevices = Object.values(data);
                    } else {
                        myDevices = [];
                    }
                });
            } else if (!user && rtdbUnsubscribe) {
                rtdbUnsubscribe();
                rtdbUnsubscribe = null;
                myDevices = [];
            }
        });

        return () => {
            if (rtdbUnsubscribe) rtdbUnsubscribe();
            unsubscribeAuth();
        };
    });

    onDestroy(() => {
        if (rtdbUnsubscribe) rtdbUnsubscribe();
    });
</script>

<div
    in:fade
    class="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8"
>
    <!-- Device Selection Content -->
    <div class="space-y-2">
        <h2 class="text-3xl font-extrabold tracking-tight">
            {#if isPaired}Device Selected{:else}Select a Device{/if}
        </h2>
        <p class="text-text-muted">
            {#if isPaired}Device linked and calibrated. Ready to monitor.{:else}Choose
                a device to start monitoring or pair a new one.{/if}
        </p>
    </div>

    <div class="w-full space-y-4">
        {#if myDevices.length > 0}
            <div class="grid gap-3 text-left">
                {#each myDevices as device}
                    <button
                        on:click={() => {
                            selectedDevice = device;
                            isPaired = true;
                            deviceStore.set({
                                isConnected: true,
                                deviceId: device.deviceId,
                            });
                        }}
                        class="glass p-4 rounded-xl border flex flex-col gap-2 transition-all active:scale-95 {selectedDevice?.deviceId ===
                        device.deviceId
                            ? 'border-primary bg-primary/10 shadow-[0_0_20px_rgba(var(--primary),0.2)]'
                            : 'border-white/10 hover:border-primary/50'}"
                    >
                        <div
                            class="font-bold flex items-center justify-between"
                        >
                            <div class="flex items-center gap-2">
                                <Zap
                                    size={16}
                                    class={selectedDevice?.deviceId ===
                                    device.deviceId
                                        ? "text-primary"
                                        : "text-text-muted"}
                                />
                                {device.name}
                            </div>
                            {#if selectedDevice?.deviceId === device.deviceId}
                                <CheckCircle2 size={16} class="text-primary" />
                            {/if}
                        </div>
                        <div class="text-xs text-text-muted font-mono">
                            ID: {device.deviceId}
                        </div>
                    </button>
                {/each}
            </div>
        {:else}
            <div
                class="glass p-6 text-center rounded-xl border border-white/10 text-text-muted text-sm"
            >
                No paired devices found. Please scan a QR code to pair a new
                device.
            </div>
        {/if}

        <a
            href="/scan-device"
            class="w-full h-16 glass border-dashed border-2 border-primary/50 hover:bg-primary/5 transition-all flex items-center justify-between px-6 group rounded-2xl mt-4"
        >
            <div class="flex items-center gap-4">
                <div
                    class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform"
                >
                    <Camera size={20} />
                </div>
                <div class="text-left">
                    <div class="font-bold text-lg">Pair New Device</div>
                    <div class="text-xs text-text-muted">
                        Scan QR code with camera
                    </div>
                </div>
            </div>
            <ChevronRight
                class="text-text-muted group-hover:text-primary transition-colors"
            />
        </a>

        <button
            on:click={activateMonitoring}
            disabled={!selectedDevice}
            class="btn btn-primary w-full h-16 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20 disabled:opacity-50 transition-all active:scale-95 mt-2"
        >
            {#if selectedDevice}Activate monitoring{:else}Select a device{/if}
        </button>
    </div>
</div>
