let isActive = false;
const mainWrapper = document.getElementById('mainWrapper');
const claw = document.getElementById('claw');

// [1] 마우스 추적 (활성화 상태일 때만)
document.addEventListener('mousemove', (e) => {
    if (!isActive) return;

    const width = window.innerWidth;
    const mouseX = e.clientX;
    
    // 마우스 위치를 퍼센트로 변환
    let xPercent = (mouseX / width) * 100;
    
    // 집게 이동 범위 제한 (기계 밖으로 나가지 않게)
    if (xPercent < 32) xPercent = 32;
    if (xPercent > 68) xPercent = 68;

    claw.style.left = `${xPercent}%`;
});


// [2] 기계 활성화 (줌인)
function activateMachine() {
    if (isActive) return;
    mainWrapper.classList.add('active');
    isActive = true;
}

// [3] 아이템 선택 및 애니메이션
function selectItem(event, id, element) {
    if (!isActive) return; 
    event.stopPropagation();
    
    const data = db[id];
    
    // 1. 집게 내려오는 동작
    claw.classList.add('claw-action');
    
    // 2. 아이템 떨어지는 동작 (시간차 실행)
    setTimeout(() => { element.classList.add('dropping'); }, 300);
    
    // 3. 모달 열기 및 집게 복귀
    setTimeout(() => { 
        openModal(data); 
        claw.classList.remove('claw-action'); 
    }, 1200);
}

// [4] 프로젝트 데이터
const db = {
    'jaju': { title: 'JAJU Web Renewal', desc: '신세계인터내셔날 이커머스 상세페이지 및 운영 디자인. 픽셀 단위 가이드라인 구축.', skills: 'Photoshop 60%, Figma 40%' },
    'wander': { title: 'Wanderboard App', desc: '여행 기록 iOS 앱. Swift 개발과 UI 디자인을 병행한 하이브리드 프로젝트.', skills: 'Swift 50%, UI Design 50%' },
    'pengcat': { title: 'PengCat Puzzle', desc: '픽셀 아트 스타일의 웹 퍼즐 게임. 레트로 감성과 반응형 웹 구현.', skills: 'Unity 40%, Pixel Art 60%' },
    'newgame': { title: 'Project: Interactive', desc: '현재 개발 중인 게이미피케이션 프로토타입. 몰입형 UI 실험작.', skills: 'Interactive Logic 80%, UX 20%' }
};

// [5] 모달 열기/닫기
function openModal(data) {
    document.getElementById('m-title').innerText = data.title;
    document.getElementById('m-desc').innerText = data.desc;
    document.getElementById('m-skills').innerText = data.skills;
    document.getElementById('modal').classList.add('active');
}

function closeModal() {
    document.getElementById('modal').classList.remove('active');
    // 떨어진 아이템 리셋 (프로토타입용)
    document.querySelectorAll('.dropping').forEach(e => e.classList.remove('dropping'));
}
