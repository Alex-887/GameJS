let music = document.getElementById("Music");

function setMusic(){

if (music.duration > 0 && !music.paused)
    {
        music.pause();
    } else
    {
        music.play();
        music.volume = 0.3;
        if(music.loop != true){
           music.loop = true;
        }

    }

}


