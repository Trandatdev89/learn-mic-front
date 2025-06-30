<template>
    <div class="audio-recorder">
        <h2>🎙️ Ghi âm Audio</h2>

        <div class="controls">
            <button @click="startRecording" :disabled="isRecording">Bắt đầu ghi</button>
            <button @click="stopRecording" :disabled="!isRecording">Dừng ghi</button>
        </div>

        <div v-if="audioUrl" class="playback">
            <h3>Phát lại:</h3>
            <audio :src="audioUrl" controls></audio>
        </div>

        <p>Text Display: {{ textTranscript }}</p>
    </div>
</template>

<script setup lang="ts">
import { BASE_URL } from '@/constant/BaseURL'
import axios from 'axios'
import { ref } from 'vue'

const mediaRecorder = ref<MediaRecorder | null>(null)
const audioChunks = ref<Blob[]>([])
const audioUrl = ref<string>('')
const isRecording = ref<boolean>(false);
const textTranscript = ref<string>('');

const startRecording = async () => {
    if (!mediaRecorder.value || mediaRecorder.value.state === 'inactive') {
        const stream: MediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder.value = new MediaRecorder(stream, { mimeType: "audio/webm", audioBitsPerSecond: 128000 });


        collectBitAudio(mediaRecorder.value);
        handleStopAction(mediaRecorder.value);


        mediaRecorder.value.start();
        isRecording.value = true;
    }
}


const collectBitAudio = (mediaRecorder: MediaRecorder) => {
    mediaRecorder.ondataavailable = (dataBlob: BlobEvent) => {
        if (dataBlob.data.size > 0) {
            audioChunks.value.push(dataBlob.data);
        }
    }
}

const handleStopAction = (mediaRecorder: MediaRecorder) => {

    mediaRecorder.onstop = async () => {
        const blobData = new Blob(audioChunks.value, { type: "audio/webm" });
        audioUrl.value = URL.createObjectURL(blobData);

        // Gui form-data xuong cho backend nua

        const formData = new FormData();
        formData.append("file", blobData, "recording.webm");

        const response = await axios.post(`${BASE_URL}/transcribe`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });

        const resultFinal = await response.data;

        textTranscript.value = resultFinal;
    }

}

const stopRecording = () => {
    if (mediaRecorder.value && mediaRecorder.value.state !== 'inactive') {
        mediaRecorder.value?.stop();
        isRecording.value = false;
    }
}


</script>

<style scoped>
.audio-recorder {
    max-width: 400px;
    margin: auto;
    padding: 1em;
    border: 2px dashed #ccc;
    border-radius: 8px;
    text-align: center;
}

.controls button {
    margin: 0.5em;
    padding: 0.6em 1.2em;
    font-size: 1rem;
}

.playback {
    margin-top: 1em;
}
</style>
