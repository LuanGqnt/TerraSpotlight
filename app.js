const API_KEY = "d123d3b5d27857f0562837ad646b4149";
const API_ENDPOINT = `http://api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=${API_KEY}`;

// FOR THE DISASTERS
document.addEventListener('DOMContentLoaded', () => {
    const navButtons = document.querySelectorAll('.disaster-btn');
    const hazardCards = document.querySelectorAll('.hazard-card');

    navButtons.forEach(button => {
        button.addEventListener('click', () => {
            const hazardType = button.getAttribute('data-hazard');

            // 1. Update button active state
            navButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // 2. Update content visibility
            hazardCards.forEach(card => card.classList.remove('active-content'));
            document.getElementById(hazardType).classList.add('active-content');
        });
    });
});