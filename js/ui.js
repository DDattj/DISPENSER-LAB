const projects = [
  { id: "demo-01", title: "쌀 수분 진정 시리즈", cat: "UI 디자인, 반응형·모바일", time: "2026.05 - 2026.06", img: "images/01.jpg", bodyText: "더미 데이터 예시 본문입니다.", grad: ["#e7d9c4", "#b8a184"] },
  { id: "demo-02", title: "넥쿨러 앱 리디자인", cat: "UX 기획, AI 활용", time: "2026.04", img: "images/02.jpg", bodyText: "더미 데이터 예시 본문입니다.", grad: ["#c9d6e0", "#7c93a8"] },
  { id: "demo-03", title: "스마트 선풍기 대시보드", cat: "디자인 시스템", time: "2026.03", img: "images/03.jpg", bodyText: "더미 데이터 예시 본문입니다.", grad: ["#dfe6d9", "#8fa382"] },
  { id: "demo-04", title: "AIR 냉감 브랜딩", cat: "UI 디자인", time: "2025.12", img: "images/04.jpg", bodyText: "더미 데이터 예시 본문입니다.", grad: ["#d6e4e8", "#7fa3ac"] }
];

const grid = document.getElementById("grid");
let currentView = 'gallery';

function render(view = currentView) {
  currentView = view;
  grid.innerHTML = "";
  grid.className = view === 'gallery' ? 'grid' : 'view-container';
  
  if (view === 'gallery') {
    projects.forEach(p => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <a href="#" class="card-thumb" data-id="${p.id}" style="${p.grad ? `background:linear-gradient(135deg, ${p.grad[0]}, ${p.grad[1]})` : "background:#e9e5db"}">
          ${p.img ? `<img src="${p.img}" alt="${p.title}" onerror="this.style.display='none';">` : ""}
        </a>
        <div class="card-bottom-area">
          <span class="card-title">${p.title}</span>
          <button class="thumb-edit-btn" onclick="openThumbUploader('${p.id}')" title="썸네일 변경">•••</button>
        </div>
      `;
      grid.appendChild(card);
    });

  } else if (view === 'category') {
    const categories = ['UX 기획', 'UI 디자인', '디자인 시스템', '협업·문제해결', 'AI 활용', '반응형·모바일'];
    const board = document.createElement('div');
    board.className = 'board-view';
    
    categories.forEach(cat => {
      const catProjects = projects.filter(p => p.cat && p.cat.includes(cat));
      if (catProjects.length > 0) {
        const col = document.createElement('div');
        col.className = 'board-column';
        col.innerHTML = `<h3 class="board-column-title">${cat} <span>${catProjects.length}</span></h3>`;
        const colContent = document.createElement('div');
        colContent.className = 'board-column-content';
        
        catProjects.forEach(p => {
          const card = document.createElement("a");
          card.className = "board-card";
          card.href = "#";
          card.dataset.id = p.id;
          card.innerHTML = `
            <div class="board-card-thumb" style="${p.grad ? `background:linear-gradient(135deg, ${p.grad[0]}, ${p.grad[1]})` : "background:#e9e5db"}">
              ${p.img ? `<img src="${p.img}" alt="${p.title}" onerror="this.style.display='none';">` : ""}
            </div>
            <div class="board-card-title">${p.title}</div>
          `;
          colContent.appendChild(card);
        });
        col.appendChild(colContent);
        board.appendChild(col);
      }
    });
    grid.appendChild(board);

  } else if (view === 'time') {
     const timeBoard = document.createElement('div');
     timeBoard.className = 'timeline-view';
     
     projects.forEach(p => {
       const row = document.createElement('div');
       row.className = 'timeline-row';
       row.innerHTML = `
         <div class="timeline-time">${p.time || '-'}</div>
         <a href="#" class="timeline-card" data-id="${p.id}">
            <div class="timeline-thumb" style="${p.grad ? `background:linear-gradient(135deg, ${p.grad[0]}, ${p.grad[1]})` : "background:#e9e5db"}">
              ${p.img ? `<img src="${p.img}" alt="${p.title}" onerror="this.style.display='none';">` : ""}
            </div>
            <div class="timeline-info">
              <div class="timeline-title">${p.title}</div>
              <div class="timeline-cat">${p.cat}</div>
            </div>
         </a>
       `;
       timeBoard.appendChild(row);
     });
     grid.appendChild(timeBoard);
  }
}
