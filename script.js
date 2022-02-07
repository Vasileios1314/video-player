const player = document.querySelector('.player');
const video = document.querySelector('.video');
const progressRange = document.querySelector('.progress-range');
const progressBar = document.querySelector('.progress-bar');
const playBtn = document.getElementById('play-btn');
const volumeIcon = document.getElementById('volume-icon');
const volumeRange = document.querySelector('.volume-range');
const volumeBar = document.querySelector('.volume-bar');
const speed = document.querySelector('.player-speed');
const currentTime = document.querySelector('.time-elapsed');
const duration = document.querySelector('.time-duration');
const fullscreenBtn = document.querySelector('.fullscreen');

// Play & Pause ----------------------------------- //

function showPlayIcon() {
  playBtn.classList.replace('fa-pause', 'fa-play');
  playBtn.setAttribute('title', 'Play');
}

function togglePlay() {
  if (video.paused) {
    video.play();
    playBtn.classList.replace('fa-play', 'fa-pause');
    playBtn.setAttribute('title', 'Pause');
  } else {
    video.pause();
    showPlayIcon();
  }
}

// On video end, show play button icon
video.addEventListener('ended', showPlayIcon);

// Progress Bar ---------------------------------- //

// Format current time, duration
function displayTime(time) {
  const minutes = Math.floor(time / 60);
  // remeinder%
  let seconds = Math.floor(time % 60);
  // reset the value of seconds
  seconds = seconds > 9 ? seconds : `0${seconds}`;
  return `${minutes}:${seconds}`;
}

// Update progress bar as video plays
function updateProgress() {
  // change the inline style(width)---add(%) cause is css property
  progressBar.style.width = `${(video.currentTime / video.duration) * 100}%`;
  // currentTime	Sets or returns the current playback position in the audio/video (in seconds)----textContent is more secure method to change the content of an el.
  currentTime.textContent = `${displayTime(video.currentTime)} /`;
  // duration	Returns the length of the current audio/video (in seconds)
  duration.textContent = `${displayTime(video.duration)}`;
}

// Click to seek within the video
// offsetX represent px value
// offsetWidth is the total lenght(in px)
function setProgress(e) {
  const newTime = e.offsetX / progressRange.offsetWidth;
  // convert to percent, so you pass that for the style of the progress bar
  progressBar.style.width = `${newTime * 100}%`;
  // skip the video(set)
  video.currentTime = newTime * video.duration;
}

// Volume Controls --------------------------- //
// declaring a var in order to achive mute/unmute
// 1=100% volume
let lastVolume = 1;

// Mute/unmute
function toggleMute() {
  // reseting the class again like below
  volumeIcon.className = '';
  if (video.volume) {
    lastVolume = video.volume;
    video.volume = 0;
    volumeIcon.classList.add('fas', 'fa-volume-mute');
    volumeIcon.setAttribute('title', 'Unmute');
    volumeBar.style.width = 0;
  } else {
    video.volume = lastVolume;
    volumeIcon.classList.add('fas', 'fa-volume-up');
    volumeIcon.setAttribute('title', 'Mute');
    volumeBar.style.width = `${lastVolume * 100}%`;
  }
}

// Volume Bar
// volume(property)	Sets or returns the volume of the audio/video
function changeVolume(e) {
  let volume = e.offsetX / volumeRange.offsetWidth;
  // Rounding volume up or down
  if (volume < 0.1) {
    volume = 0;
  }
  if (volume > 0.9) {
    volume = 1;
  }
  volumeBar.style.width = `${volume * 100}%`;
  // change the volume of the video it self
  video.volume = volume;
  // Change icon depending on volume
  // reseting all the classes and adding a unique icon for 3 cases
  volumeIcon.className = '';
  if (volume > 0.7) {
    volumeIcon.classList.add('fas', 'fa-volume-up');
  } else if (volume < 0.7 && volume > 0) {
    volumeIcon.classList.add('fas', 'fa-volume-down');
  } else if (volume === 0) {
    volumeIcon.classList.add('fas', 'fa-volume-off');
  }
  // tracking the vol
  lastVolume = volume;
}

// Change Playback Speed -------------------- //

function changeSpeed() {
  // playbackRate	Sets or returns the speed of the audio/video playback
  video.playbackRate = speed.value;
}

// Fullscreen ------------------------------- //

/* View in fullscreen */
function openFullscreen(element) {
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) {
    /* Firefox */
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) {
    /* Chrome, Safari and Opera */
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) {
    /* IE/Edge */
    element.msRequestFullscreen();
  }
  // targeting css in order to center
  video.classList.add('video-fullscreen');
}

/* Close fullscreen */
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    /* Firefox */
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    /* Chrome, Safari and Opera */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    /* IE/Edge */
    document.msExitFullscreen();
  }
  // remove css class
  video.classList.remove('video-fullscreen');
}
// starting with it
let fullscreen = false;

// Toggle fullscreen
function toggleFullscreen() {
  if (!fullscreen) {
    openFullscreen(player);
  } else {
    closeFullscreen();
  }
  // reverse the value
  fullscreen = !fullscreen;
}

// Event Listeners-----------------------------------------
playBtn.addEventListener('click', togglePlay);
// click anywhere in the video to play or pause
video.addEventListener('click', togglePlay);
// 	Fires when the current playback position has changed
video.addEventListener('timeupdate', updateProgress);
// Fires when the browser can start playing the audio/video
video.addEventListener('canplay', updateProgress);
progressRange.addEventListener('click', setProgress);
volumeRange.addEventListener('click', changeVolume);
volumeIcon.addEventListener('click', toggleMute);
// The change event is fired for <select>
speed.addEventListener('change', changeSpeed);
fullscreenBtn.addEventListener('click', toggleFullscreen);
