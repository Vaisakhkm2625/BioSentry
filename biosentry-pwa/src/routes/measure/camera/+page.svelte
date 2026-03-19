<script>
    import { onMount, onDestroy } from "svelte";
    import { fade } from "svelte/transition";
    import Circle from "lucide-svelte/icons/circle";
    import Activity from "lucide-svelte/icons/activity";
    import { goto } from "$app/navigation";
    import { stopVitalsFetch } from "$lib/measureStore";

    let videoElement;
    let stream;
    let isRecording = false;
    let recordingTime = 6;
    let recordingInterval;

    async function startCameraMonitoring() {
        try {
            stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user" },
            });
            if (videoElement) videoElement.srcObject = stream;

            isRecording = true;
            recordingTime = 6;
            recordingInterval = setInterval(() => {
                recordingTime--;
                if (recordingTime <= 0) {
                    stopRecording();
                }
            }, 1000);
        } catch (err) {
            console.error("Camera access denied", err);
        }
    }

    function stopRecording() {
        isRecording = false;
        clearInterval(recordingInterval);
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
        }
    }

    function handleEndSession() {
        stopRecording();
        stopVitalsFetch();
        goto("/measure/confirmation");
    }

    onMount(() => {
        startCameraMonitoring();
    });

    onDestroy(() => {
        stopRecording();
    });
</script>

<div in:fade class="space-y-6">
    <div
        class="glass aspect-[3/4] rounded-3xl overflow-hidden relative border-white/20"
    >
        <!-- Video Feed -->
        <video
            bind:this={videoElement}
            autoplay
            playsinline
            muted
            class="w-full h-full object-cover grayscale brightness-110"
        ></video>

        <!-- Overlay -->
        <div
            class="absolute inset-0 pointer-events-none p-6 flex flex-col justify-between"
        >
            <div class="flex justify-between items-start">
                {#if isRecording}
                    <div
                        class="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2 animate-pulse"
                    >
                        <Circle size={10} fill="currentColor" /> REC
                    </div>
                    <div
                        class="glass px-3 py-1 text-xs font-bold border-white/40"
                    >
                        00:0{recordingTime}s
                    </div>
                {:else}
                    <div
                        class="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold"
                    >
                        CAPTURE COMPLETE
                    </div>
                {/if}
            </div>

            <div class="space-y-2 text-center">
                <div
                    class="bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/10"
                >
                    <p class="text-sm font-medium">
                        Keep your face and upper body visible
                    </p>
                    <p class="text-[10px] text-white/60">
                        Detecting: stress, symptom, shivering, body posture
                    </p>
                </div>
            </div>
        </div>
    </div>

    <div class="glass p-6 space-y-4">
        <div class="flex items-center gap-4">
            <div
                class="w-12 h-12 rounded-xl bg-surface flex items-center justify-center"
            >
                <Activity class="text-primary" />
            </div>
            <div>
                <div class="font-bold">Vision AI Active</div>
                <div class="text-xs text-text-muted">
                    Analyzing micro-symptoms in real-time
                </div>
            </div>
        </div>

        <button
            on:click={handleEndSession}
            class="w-full h-16 rounded-2xl bg-white text-black font-bold text-lg hover:bg-white/90 transition-all active:scale-95"
        >
            End Session
        </button>
    </div>
</div>
