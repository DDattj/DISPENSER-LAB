let isActive = false;
const wrapper = document.getElementById('mainWrapper');
const claw = document.getElementById('claw');

// 마우스 추적
document.addEventListener('mousemove', (e) => {
    if (!isActive) return;
    const xPct = (e.clientX / window.innerWidth) * 100;
    // 기계 범위 내로 제한
    if (xPct > 35 && xPct < 65) {
        claw.style.left = `${xPct}%`;
    }
});

function activateMachine() {
    if (isActive) return;
    wrapper.classList.add('active');
    isActive = true;
}

function selectItem(e, id, el) {
    if (!isActive) return;
    e.stopPropagation();

    // 집게 움직임
    claw.classList.add('claw-action');
    
    setTimeout(() => {
        el.classList.add('dropping');
    }, 400);

    setTimeout(() => {
        document.getElementById('m-title').innerText = id.toUpperCase();
        document.getElementById('modal').classList.add('active');
        claw.classList.remove('claw-action');
    }, 1000);
}

function closeModal() {
    document.getElementById('modal').classList.remove('active');
    document.querySelectorAll('.dropping').forEach(el => el.classList.remove('dropping'));
}
