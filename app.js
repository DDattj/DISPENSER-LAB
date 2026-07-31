let editingProjectId = null;
let activeProjectData = null;

// 초기 화면 렌더링
render();

// 탭 전환 이벤트
document.getElementById("tabBar").addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  document.querySelectorAll("#tabBar button").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  render(btn.dataset.view);
});

// 프로젝트 상세 보기 모달
const projectModal = document.getElementById('projectModal');
const closeProjectBtn = document.getElementById('closeProjectBtn');
const modalProjectTitle = document.getElementById('modalProjectTitle');
const modalProjectBadges = document.getElementById('modalProjectBadges');
const modalProjectCover = document.getElementById('modalProjectCover');
const modalProjectContent = document.getElementById('modalProjectContent');

grid.addEventListener('click', (e) => {
  const card = e.target.closest('a[data-id]');
  if (!card) return; 
  
  e.preventDefault(); 
  const pId = card.dataset.id;
  const p = projects.find(item => item.id === pId);
  if (!p) return;

  activeProjectData = p;

  modalProjectTitle.textContent = p.title;
  
  if (p.img) {
    modalProjectCover.src = p.img;
    modalProjectCover.style.display = 'block';
  } else {
    modalProjectCover.style.display = 'none';
  }

  modalProjectBadges.innerHTML = ''; 
  const cats = (p.cat || '').split(',').map(c => c.trim());
  cats.forEach(c => {
    if (c && c !== "카테고리 미지정") {
      const span = document.createElement('span');
      span.className = 'badge cat-badge';
      span.textContent = c;
      modalProjectBadges.appendChild(span);
    }
  });

  if (p.time && p.time !== "작업시간 미지정") {
    const timeSpan = document.createElement('span');
    timeSpan.className = 'badge time-badge';
    timeSpan.textContent = `⏱ ${p.time}`;
    modalProjectBadges.appendChild(timeSpan);
  }

  if (p.bodyText && p.bodyText.trim() !== '') {
    modalProjectContent.innerHTML = p.bodyText;
  } else {
    modalProjectContent.innerHTML = `<p style="color:var(--ink-soft); text-align:center; padding:40px 0;">작성된 본문 내용이 없습니다.</p>`;
  }

  projectModal.classList.add('active');
  document.body.classList.add('modal-open');
});

const closeProjectModal = () => {
  projectModal.classList.remove('active');
  document.body.classList.remove('modal-open');
  activeProjectData = null;
};
closeProjectBtn.addEventListener('click', closeProjectModal);
projectModal.addEventListener('click', (e) => {
  if (e.target === projectModal) closeProjectModal();
});

// 카테고리 다중 선택 태그 칩
const categoryTags = document.querySelectorAll('.tag-chip');
categoryTags.forEach(tag => {
  tag.addEventListener('click', () => {
    tag.classList.toggle('selected');
  });
});

const fabBtn = document.getElementById("fabBtn");
const modalOverlayUpload = document.getElementById("modalOverlay");
const cancelBtn = document.getElementById("cancelBtn");

fabBtn.addEventListener("click", () => { 
  editingProjectId = null;
  resetUploadForm();
  modalOverlayUpload.classList.add("open"); 
});

cancelBtn.addEventListener("click", () => { 
  modalOverlayUpload.classList.remove("open"); 
  document.getElementById("statusMsg").textContent = ""; 
});

modalOverlayUpload.addEventListener("click", (e) => {
  if (e.target === modalOverlayUpload) { 
    modalOverlayUpload.classList.remove("open"); 
    document.getElementById("statusMsg").textContent = ""; 
  }
});

function resetUploadForm() {
  document.getElementById("inputHeaderImage").value = "";
  document.getElementById("inputTitle").value = "";
  document.getElementById("inputTime").value = "";
  quill.root.innerHTML = ""; 
  document.getElementById('headerImgPreview').style.display = 'none';
  document.getElementById('headerImgPreview').src = '';
  document.getElementById('btnHeaderImg').style.display = 'block';
  categoryTags.forEach(tag => tag.classList.remove('selected'));
  document.getElementById("statusMsg").textContent = "";
}

// 로그인 & 관리자 권한 (imddattj@gmail.com 전용)
const loginLink = document.getElementById("loginLink");
const logoutLink = document.getElementById("logoutLink");

loginLink.addEventListener("click", async () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  try { await auth.signInWithPopup(provider); } catch (e) { alert("로그인 실패: " + e.message); }
});
logoutLink.addEventListener("click", () => { auth.signOut(); });

const ADMIN_EMAILS = ["imddattj@gmail.com"];
if (firebaseReady) {
  auth.onAuthStateChanged((user) => {
    const isAdmin = user && ADMIN_EMAILS.includes(user.email);
    if (user && !isAdmin) { alert("관리자 계정이 아닙니다."); auth.signOut(); return; }
    if (isAdmin) {
      fabBtn.style.display = "flex"; loginLink.style.display = "none"; logoutLink.style.display = "block";
      document.body.classList.add('admin-mode');
    } else {
      fabBtn.style.display = "none"; loginLink.style.display = "block"; logoutLink.style.display = "none";
      document.body.classList.remove('admin-mode');
    }
  });
}

// DB 프로젝트 불러오기
async function loadUserProjects() {
  if (!firebaseReady) return;
  try {
    const snapshot = await db.collection("projects").orderBy("createdAt", "desc").get();
    projects.length = 0;
    snapshot.forEach(doc => {
      const d = doc.data();
      projects.push({ 
        id: doc.id, 
        title: d.title, 
        cat: d.cat, 
        time: d.time, 
        img: d.imageUrl || d.headerImageUrl, 
        bodyText: d.bodyText || "", 
        grad: null 
      });
    });
    render();
  } catch (e) { console.warn("프로젝트 불러오기 실패:", e); }
}
loadUserProjects();

// 커버 이미지 미리보기
document.getElementById('inputHeaderImage').addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(event) {
      document.getElementById('btnHeaderImg').style.display = 'none';
      const img = document.getElementById('headerImgPreview');
      img.src = event.target.result;
      img.style.display = 'block';
    }
    reader.readAsDataURL(file);
  }
});

// 저장 (등록 & 수정 통합)
document.getElementById("saveBtn").addEventListener("click", async () => {
  const title = document.getElementById("inputTitle").value.trim();
  const time = document.getElementById("inputTime").value.trim() || "작업시간 미지정";
  const bodyText = quill.root.innerHTML; 
  const statusMsg = document.getElementById("statusMsg");
  
  const selectedTags = Array.from(document.querySelectorAll('.tag-chip.selected')).map(tag => tag.dataset.value);
  const cat = selectedTags.length > 0 ? selectedTags.join(', ') : "카테고리 미지정";
  const headerFile = document.getElementById('inputHeaderImage').files[0];

  if (!title) { 
    statusMsg.style.color = "red";
    statusMsg.textContent = "프로젝트 제목을 입력해주세요!"; 
    return; 
  }

  const saveBtn = document.getElementById("saveBtn");
  const globalLoader = document.getElementById("globalLoader");

  saveBtn.disabled = true; 
  globalLoader.classList.add("active"); 

  try {
    let imageUrl = activeProjectData ? (activeProjectData.img || "") : "";
    
    if (headerFile) {
      const headerRef = storage.ref().child(`uploads/${Date.now()}_header_${headerFile.name}`);
      await headerRef.put(headerFile);
      imageUrl = await headerRef.getDownloadURL();
    }
    
    if (editingProjectId) {
      const updateData = { title, cat, time, bodyText };
      if (imageUrl) {
        updateData.imageUrl = imageUrl;
        updateData.headerImageUrl = imageUrl;
      }
      await db.collection("projects").doc(editingProjectId).update(updateData);
      alert("글이 수정되었습니다.");
    } else {
      await db.collection("projects").add({ 
        title, cat, time, imageUrl, headerImageUrl: imageUrl, bodyText, createdAt: firebase.firestore.FieldValue.serverTimestamp() 
      });
      alert("새 글이 저장되었습니다.");
    }
    
    modalOverlayUpload.classList.remove("open");
    closeProjectModal();
    await loadUserProjects();
    resetUploadForm();

  } catch (e) { 
    statusMsg.style.color = "red";
    statusMsg.textContent = "저장 실패: " + e.message; 
  } finally { 
    saveBtn.disabled = false; 
    globalLoader.classList.remove("active");
  }
});

// 글 수정 버튼
document.getElementById("editProjectBtn").addEventListener("click", () => {
  if (!activeProjectData) return;
  if (activeProjectData.id.startsWith("demo-")) {
    alert("더미 데이터는 수정할 수 없습니다.");
    return;
  }

  editingProjectId = activeProjectData.id;

  document.getElementById("inputTitle").value = activeProjectData.title || "";
  document.getElementById("inputTime").value = activeProjectData.time || "";
  quill.root.innerHTML = activeProjectData.bodyText || "";

  const activeCats = (activeProjectData.cat || "").split(",").map(c => c.trim());
  categoryTags.forEach(tag => {
    if (activeCats.includes(tag.dataset.value)) {
      tag.classList.add("selected");
    } else {
      tag.classList.remove("selected");
    }
  });

  if (activeProjectData.img) {
    document.getElementById('btnHeaderImg').style.display = 'none';
    const img = document.getElementById('headerImgPreview');
    img.src = activeProjectData.img;
    img.style.display = 'block';
  } else {
    document.getElementById('btnHeaderImg').style.display = 'block';
    document.getElementById('headerImgPreview').style.display = 'none';
  }

  closeProjectModal();
  modalOverlayUpload.classList.add("open");
});

// 글 삭제 버튼
document.getElementById("deleteProjectBtn").addEventListener("click", async () => {
  if (!activeProjectData) return;
  if (activeProjectData.id.startsWith("demo-")) {
    alert("더미 데이터는 삭제할 수 없습니다.");
    return;
  }

  if (confirm(`'${activeProjectData.title}' 프로젝트를 정말 삭제하시겠습니까?`)) {
    const globalLoader = document.getElementById("globalLoader");
    globalLoader.classList.add("active");

    try {
      await db.collection("projects").doc(activeProjectData.id).delete();
      alert("성공적으로 삭제되었습니다.");
      closeProjectModal();
      await loadUserProjects();
    } catch (e) {
      alert("삭제 실패: " + e.message);
    } finally {
      globalLoader.classList.remove("active");
    }
  }
});

// 썸네일 개별 변경
function openThumbUploader(projectId) {
  if(!projectId || projectId.startsWith("demo-")) {
      alert("이 항목은 더미 데이터라 썸네일을 변경할 수 없습니다.");
      return;
  }
  
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  
  fileInput.onchange = async (e) => {
      const file = e.target.files[0];
      if(!file) return;
      
      const globalLoader = document.getElementById("globalLoader");
      globalLoader.classList.add("active");
      
      try {
          const thumbRef = storage.ref().child(`uploads/${Date.now()}_thumb_${file.name}`);
          await thumbRef.put(file);
          const newThumbUrl = await thumbRef.getDownloadURL();
          
          await db.collection("projects").doc(projectId).update({
              imageUrl: newThumbUrl,
              headerImageUrl: newThumbUrl
          });
          
          await loadUserProjects(); 
      } catch(err) {
          console.error(err);
          alert("썸네일 변경 중 오류가 발생했습니다.");
      } finally {
          globalLoader.classList.remove("active");
      }
  };
  
  fileInput.click();
}
