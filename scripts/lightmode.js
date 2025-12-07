let lightmode = localStorage.getItem('lightmode');

const themeSwitch = document.querySelector('#theme-switch');

const enableLightmode = () => {
    document.body.classList.add('light-mode');
    localStorage.setItem('lightmode', 'active');
}

const disableLightmode = () => {
    document.body.classList.remove('light-mode');
    localStorage.setItem('lightmode', 'unactive');
}

if(lightmode === 'active') enableLightmode();

themeSwitch.addEventListener('click', () => {
    lightmode = localStorage.getItem('lightmode');

    if(lightmode === 'active')
        disableLightmode();
    else
        enableLightmode();
});