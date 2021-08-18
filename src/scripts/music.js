
export const audio = () => {
    var audio = document.querySelector('.audio');
    var audioButton = document.querySelector('.fa-volume-up')
    var muteIcon = document.querySelector('.fa-volume-mute')
    var count = 0;

    muteIcon.addEventListener('click', () => {
        if (count === 0) {
            count = 1;
            audio.play();
            muteIcon.classList.add('audio-hide');
            audioButton.classList.remove('audio-hide');
            // audioButton.innerHTML = 'Sound Off'
        } else {
            count = 0;
            audio.pause();
            audioButton.classList.add('audio-hide');
            muteIcon.classList.remove('audio-hide');
            // audioButton.innerHTML = 'Sound On'
        }
    })

    audioButton.addEventListener('click', () => {
        if (count === 0) {
            count = 1;
            audio.play();
            muteIcon.classList.add('audio-hide');
            audioButton.classList.remove('audio-hide');
            // audioButton.innerHTML = 'Sound Off'
        } else {
            count = 0;
            audio.pause();
            audioButton.classList.add('audio-hide');
            muteIcon.classList.remove('audio-hide');
            // audioButton.innerHTML = 'Sound On'
        }
    })
}