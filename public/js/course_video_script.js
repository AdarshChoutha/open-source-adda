// Variables
var video, videoControls, rangeBar_container, range_bar, progress_bar, playPauseBtn, soundBtn, toggleFullScreenBtn;

var hideVideoControlsAfter;

document.addEventListener('DOMContentLoaded', (event) => {

    video = document.getElementById('course_video');
    rangeBar_container = document.getElementById("range-bar-container");
    range_bar = document.getElementById('range-bar');
    progress_bar = document.getElementById('progress-bar');
    videoControls = document.getElementById('video-controls');
    playPauseBtn = document.getElementById("play-pause-btn");
    soundBtn = document.getElementById('sound-btn');
    toggleFullScreenBtn = document.getElementById('toggle-full-screen');

    video.currentTime = 0;
    updateRangeBar();
    updateTime();
    setPlayPauseBtn();

    video.ontimeupdate = () => {
        updateRangeBar();
        updateTime();
        setPlayPauseBtn();
    }
    video.oncontextmenu = (event) => event.preventDefault();
    video.onclick = () => togglePlayPauseVideo();
    video.ondblclick = () => {
        if (video.paused) backwardVideo(0.001);
        toggleFullScreenVideo();
    }
    video.onpause = () => {
        showVideoControls();
    }
    video.onplay = () => {
        clearTimeout(hideVideoControlsAfter);
        hideVideoControlsAfter = setTimeout(() => hideVideoControls(), 5000);
    }
    video.onmousemove = () => hideVideoControlsOnMouseOver(5000);

    rangeBar_container.onclick = (event) => {
        range_bar.style.width = event.offsetX / rangeBar_container.offsetWidth * 100 + "%";
        video.currentTime = (parseFloat(range_bar.style.width)) * video.duration / 100;
    }
    rangeBar_container.ondrag = (event) => {
        range_bar.style.width = event.offsetX / rangeBar_container.offsetWidth * 100 + "%";
        video.currentTime = (parseFloat(range_bar.style.width)) * video.duration / 100;
    }
    rangeBar_container.onmousemove = () => hideVideoControlsOnMouseOver(5000);

    playPauseBtn.onclick = () => togglePlayPauseVideo();
    playPauseBtn.onmousemove = () => hideVideoControlsOnMouseOver(5000);

    soundBtn.onclick = () => toggleMuteVideo();
    soundBtn.onmousemove = () => hideVideoControlsOnMouseOver(5000);

    toggleFullScreenBtn.onclick = () => toggleFullScreenVideo();
    toggleFullScreenBtn.onmousemove = () => hideVideoControlsOnMouseOver(5000);

})

//#region // Window Functions

window.addEventListener('keydown', (event) => {
    if (event.code == "ArrowLeft") {
        event.preventDefault();
        if (event.shiftKey) backwardVideo(30);
        else backwardVideo(10);
    }
    if (event.code == "ArrowRight") {
        event.preventDefault();
        if (event.shiftKey) forwardVideo(30);
        else forwardVideo(10);
    }
})

window.addEventListener('keypress', (event) => {
    if (event.code == "Space") {
        event.preventDefault();
        togglePlayPauseVideo();
    }
    if (event.code == "KeyF") {
        event.preventDefault();
        toggleFullScreenVideo();
    }
    if (event.code == "KeyM") {
        event.preventDefault();
        toggleMuteVideo();
        clearTimeout(hideVideoControlsAfter);
        showVideoControls();
        hideVideoControlsAfter = setTimeout(() => hideVideoControls(), 2500);
    }
    if (event.code == "Equal") {
        event.preventDefault();
        incVolumeVideo();
    }
    if (event.code == "Minus") {
        event.preventDefault();
        decVolumeVideo();
    }
})

//#endregion

//#region // Video Functions

function showVideoControls() {
    if (!videoControls.classList.contains('show')) videoControls.classList.add('show');
}

function hideVideoControls() {
    if (!video.paused && videoControls.classList.contains('show')) videoControls.classList.remove('show');
}

function hideVideoControlsOnMouseOver(timeInterval) {
    clearTimeout(hideVideoControlsAfter);
    showVideoControls();
    hideVideoControlsAfter = setTimeout(() => hideVideoControls(), timeInterval);
}

function forwardVideo(forsec) {
    let curmins = Math.floor(video.currentTime / 60);
    let cursecs = Math.floor(video.currentTime - curmins * 60);
    cursecs = cursecs + forsec;
    if (cursecs >= 60) {
        cursecs = cursecs - 60;
        curmins = curmins + 1;
    }
    if ((cursecs + curmins * 60) > video.duration) {
        video.currentTime = video.currentTime + (cursecs + curmins * 60) - video.duration;
    } else video.currentTime = (cursecs + curmins * 60)

    updateTime();
    updateRangeBar();
}

function backwardVideo(forsec) {
    let curmins = Math.floor(video.currentTime / 60);
    let cursecs = Math.floor(video.currentTime - curmins * 60);
    cursecs = cursecs - forsec;
    if (cursecs < 0) {
        cursecs = cursecs + 60;
        curmins = curmins - 1;
    }
    if ((cursecs + curmins * 60) < 0) video.currentTime = 0;
    else video.currentTime = (cursecs + curmins * 60)
    updateTime();
    updateRangeBar();
}

//#endregion

//#region //Video Control Buttons Functions

// Range Bar Functions

function updateRangeBar() {
    range_bar.style.width = (video.currentTime / video.duration * 100) + "%";
}

// Play-Pause Button Functions

function setPlayPauseBtn() {
    const playPauseBtnIcon = document.querySelector("#play-pause-btn .fas");
    if (video.paused) {
        playPauseBtnIcon.classList.remove("fa-pause");
        playPauseBtnIcon.classList.add("fa-play");
    } else {
        playPauseBtnIcon.classList.remove("fa-play");
        playPauseBtnIcon.classList.add("fa-pause");
    } if (video.ended) {
        document.querySelector("#play-pause-btn .fas").classList.remove("fa-pause")
        document.querySelector("#play-pause-btn .fas").classList.add("fa-play")
    }
}

function togglePlayPauseVideo() {
    if (video.paused) video.play();
    else video.pause();
    setPlayPauseBtn();
}

// Time Button Functions

function updateTime() {
    let curmins = Math.floor(video.currentTime / 60);
    let cursecs = Math.floor(video.currentTime - curmins * 60);
    let durmins = Math.floor(video.duration / 60);
    let dursecs = Math.floor(video.duration - durmins * 60);
    if (cursecs < 10) cursecs = "0" + cursecs;
    if (dursecs < 10) dursecs = "0" + dursecs;
    if (curmins < 10) curmins = "0" + curmins;
    if (durmins < 10) durmins = "0" + durmins;
    document.getElementById('time-div').innerHTML = `${curmins}:${cursecs} / ${durmins}:${dursecs}`;
    if (video.currentTime == 0) document.getElementById('time-div').innerHTML = `00:00 / 00:00`;
}

// Volume Button Functions

function toggleMuteVideo() {
    if (video.muted) {
        video.muted = false;
        setVolumeIconVideo();
    } else {
        video.muted = true;
        if (document.querySelector("#sound-btn .fas").classList.contains("fa-volume-up"))
            document.querySelector("#sound-btn .fas").classList.remove("fa-volume-up")
        if (document.querySelector("#sound-btn .fas").classList.contains("fa-volume-down"))
            document.querySelector("#sound-btn .fas").classList.remove("fa-volume-down")
        if (!document.querySelector("#sound-btn .fas").classList.contains("fa-volume-mute"))
            document.querySelector("#sound-btn .fas").classList.add("fa-volume-mute")
    }
}

function setVolumeIconVideo() {
    if (0.6 < video.volume && video.volume <= 1) {
        if (!document.querySelector("#sound-btn .fas").classList.contains("fa-volume-up"))
            document.querySelector("#sound-btn .fas").classList.add("fa-volume-up")
        if (document.querySelector("#sound-btn .fas").classList.contains("fa-volume-down"))
            document.querySelector("#sound-btn .fas").classList.remove("fa-volume-down")
    }
    if (0.1 < video.volume && video.volume <= 0.6) {
        if (document.querySelector("#sound-btn .fas").classList.contains("fa-volume-up"))
            document.querySelector("#sound-btn .fas").classList.remove("fa-volume-up")
        if (!document.querySelector("#sound-btn .fas").classList.contains("fa-volume-down"))
            document.querySelector("#sound-btn .fas").classList.add("fa-volume-down")
    }
    if (document.querySelector("#sound-btn .fas").classList.contains("fa-volume-mute"))
        document.querySelector("#sound-btn .fas").classList.remove("fa-volume-mute")
    if (video.volume == 1.3877787807814457e-16) {
        video.muted = true;
        if (document.querySelector("#sound-btn .fas").classList.contains("fa-volume-up"))
            document.querySelector("#sound-btn .fas").classList.remove("fa-volume-up")
        if (document.querySelector("#sound-btn .fas").classList.contains("fa-volume-down"))
            document.querySelector("#sound-btn .fas").classList.remove("fa-volume-down")
        if (!document.querySelector("#sound-btn .fas").classList.contains("fa-volume-mute"))
            document.querySelector("#sound-btn .fas").classList.add("fa-volume-mute")
    }
}

function incVolumeVideo() {
    video.muted = false;
    if (document.querySelector("#sound-btn .fas").classList.contains("fa-volume-mute"))
        document.querySelector("#sound-btn .fas").classList.remove("fa-volume-mute")
    if (video.volume < 1) video.volume = video.volume + 0.1;
    setVolumeIconVideo();
}

function decVolumeVideo() {
    video.muted = false;
    if (document.querySelector("#sound-btn .fas").classList.contains("fa-volume-mute"))
        document.querySelector("#sound-btn .fas").classList.remove("fa-volume-mute")
    if (video.volume > 0.1) video.volume = video.volume - 0.1;
    setVolumeIconVideo();
}

// Full Screen Button Functions

function toggleFullScreenVideo() {
    if (document.fullscreenElement === null) openFullscreen();
    else if (document.fullscreenElement.id == "video_container") closeFullscreen();
}

/* View in fullscreen */
function openFullscreen() {
    const tfs_i = document.querySelector("#toggle-full-screen .fas");

    if (video_container.requestFullscreen) video_container.requestFullscreen();
    else if (video_container.webkitRequestFullscreen) video_container.webkitRequestFullscreen(); /* Safari */
    else if (video_container.msRequestFullscreen) video_container.msRequestFullscreen(); /* IE11 */

    if (tfs_i.classList.contains("fa-expand")) tfs_i.classList.remove("fa-expand");
    if (!tfs_i.classList.contains("fa-compress")) tfs_i.classList.add("fa-compress");
}

/* Close fullscreen */
function closeFullscreen() {
    const tfs_i = document.querySelector("#toggle-full-screen .fas");

    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen(); /* Safari */
    else if (document.msExitFullscreen) document.msExitFullscreen(); /* IE11 */

    if (!tfs_i.classList.contains("fa-expand")) tfs_i.classList.add("fa-expand");
    if (tfs_i.classList.contains("fa-compress")) tfs_i.classList.remove("fa-compress");
}

//#endregion
