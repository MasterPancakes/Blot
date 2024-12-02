document.addEventListener("DOMContentLoaded", function () {
  var audioPlayers = document.querySelectorAll(".audio-player");

  audioPlayers.forEach(function (player) {
    var audio = player.querySelector("audio");
    var playButton = player.querySelector(".play-button");
    var pauseButton = player.querySelector(".pause-button");
    var progressBar = player.querySelector(".progress-bar");

    playButton.addEventListener("click", function () {
      audio.play();
      playButton.style.display = "none";
      pauseButton.style.display = "inline-block";
    });

    pauseButton.addEventListener("click", function () {
      audio.pause();
      playButton.style.display = "inline-block";
      pauseButton.style.display = "none";
    });

    audio.addEventListener("timeupdate", function () {
      var progress = (audio.currentTime / audio.duration) * 100;
      progressBar.style.width = progress + "%";
    });
  });
});
