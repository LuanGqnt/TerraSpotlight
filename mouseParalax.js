
const Layer1 = document.getElementById("spotlightDiv");
const Layer2 = document.getElementById("globeAnim");
const Layer3 = document.getElementById("starsBGSmallDiv");
const Layer4 = document.getElementById("novaBG");

let currentX = 0;
let currentY = 0;
let targetX = 0;
let targetY = 0;

window.addEventListener('mousemove', (e) => {
    targetX = e.clientX - window.innerWidth / 2;
    targetY = e.clientY - window.innerHeight / 2;
});

function animate() {
    currentX += (targetX - currentX) * 0.1;
    currentY += (targetY - currentY) * 0.1;

    Layer1.style.transform = `translate(${currentX * -0.007}px, ${currentY * -0.007}px)`;
    Layer2.style.transform = `translate(${currentX * -0.003}px, ${currentY * -0.003}px)`;
    Layer3.style.transform = `translate(${currentX * -0.001}px, ${currentY * -0.001}px)`;
    Layer4.style.transform = `translate(${currentX * -0.00025}px, ${currentY * -0.00025}px)`;

    requestAnimationFrame(animate);
}
animate();
