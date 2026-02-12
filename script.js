let isActive = false;
const mainWrapper = document.getElementById('mainWrapper');
const claw = document.getElementById('claw');

// 마우스 추적
document.addEventListener('mousemove', (e) => {
    if (!isActive) return;
    const width = window.innerWidth;
    const xPercent = (e.clientX / width) * 100;
    // 범위 제한
    if (xPercent > 30 && xPercent < 70) {
        claw.style.left = `${xPercent}%`;
    }
});

// 활성화 (줌인)
function activateMachine() {
    if (isActive) return;
    mainWrapper.classList.add('active');
    isActive = true;
}

// 아이템 선택
function selectItem(event, id, element) {
    if (!isActive) return;
    event.stopPropagation();
    
    // 집게 모션
    claw.classList.add('claw-action');
    setTimeout(() => { element.classList.add('dropping'); }, 300);
    setTimeout(() => { 
        document.getElementById('modal').classList.add('active');
        claw.classList.remove('claw-action'); 
    }, 1000);
}

// 모달 닫기
function closeModal() {
    document.getElementById('modal').classList.remove('active');
    document.querySelectorAll('.dropping').forEach(e => e.classList.remove('dropping'));
}
