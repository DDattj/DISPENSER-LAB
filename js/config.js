const firebaseConfig = {
  apiKey: "AIzaSyAOAgQnvj4zs3bQM2dyoH69AgXk8WANOsA",
  authDomain: "designprojectsian.firebaseapp.com",
  databaseURL: "https://designprojectsian-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "designprojectsian",
  storageBucket: "designprojectsian.firebasestorage.app",
  messagingSenderId: "80013229347",
  appId: "1:80013229347:web:be1d2657e04d2c2fabe096"
};

let firebaseReady = false;
let db, storage, auth;

try {
  firebase.initializeApp(firebaseConfig);
  db = firebase.firestore();
  storage = firebase.storage();
  auth = firebase.auth();
  firebaseReady = true;
} catch (e) {
  console.warn("Firebase 에러", e);
}

// Quill 에디터 이미지 URL 직접 입력 핸들러 (스토리지 미사용)
function imageHandler() {
  let url = prompt("이미지 링크(URL)를 붙여넣으세요:\n(GitHub Issues 주소 또는 Google Drive 공유 링크)");
  if (url && url.trim().length > 0) {
    url = fixImageUrl(url.trim()); // 구글 드라이브 주소 자동 변환
    const range = quill.getSelection();
    quill.insertEmbed(range.index, 'image', url);
  }
}

// 구글 드라이브 주소 자동 변환 함수
function fixImageUrl(url) {
  if (!url) return "";
  if (url.includes('drive.google.com')) {
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      return `https://drive.google.com/uc?export=view&id=${match[1]}`;
    }
  }
  return url;
}

// Quill 에디터 생성
var quill = new Quill('#editor-container', {
  theme: 'snow',
  placeholder: '새로운 포트폴리오 내용을 작성해보세요...',
  modules: {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'align': [] }],
        ['link', 'image', 'video'],
        ['clean']
      ],
      handlers: { image: imageHandler }
    }
  }
});

// Flatpickr 달력 초기화
flatpickr("#inputTime", {
  mode: "range", locale: "ko", dateFormat: "Y.m.d", rangeSeparator: " - "   
});
