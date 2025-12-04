const Layer0 = document.getElementById("textLayer");
const Layer1 = document.getElementById("spotlightDiv");
const Layer2 = document.getElementById("globeAnimDiv");
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

// SCROLL OFFSET
let scrollY = 0;

window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
});

function animate() {
    currentX += (targetX - currentX) * 0.1;
    currentY += (targetY - currentY) * 0.1;

    // add scroll parallax on the Y axis
    const s0 = scrollY * -0.08;
    const s1 = scrollY * -0.1;
    const s2 = scrollY * -0.07;
    const s3 = scrollY * -0.04;
    const s4 = scrollY * -0.02;

    Layer0.style.transform = `translate(${currentX * -0.007}px, ${currentY * -0.007 + s0}px)`;
    Layer1.style.transform = `translate(${currentX * -0.01}px,  ${currentY * -0.01  + s1}px)`;
    Layer2.style.transform = `translate(${currentX * -0.006}px, ${currentY * -0.006 + s2}px)`;
    Layer3.style.transform = `translate(${currentX * -0.003}px, ${currentY * -0.003 + s3}px)`;
    Layer4.style.transform = `translate(${currentX * -0.0005}px,${currentY * -0.0005 + s4}px)`;

    requestAnimationFrame(animate);
}
animate();

