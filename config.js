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

// Quill 에디터 이미지 직접 업로드 핸들러
function imageHandler() {
  const input = document.createElement('input');
  input.setAttribute('type', 'file');
  input.setAttribute('accept', 'image/*');
  input.click();

  input.onchange = async () => {
    const file = input.files[0];
    if (file) {
      const globalLoader = document.getElementById("globalLoader");
      const loaderText = globalLoader.querySelector('.loading-text');
      loaderText.textContent = "에디터 이미지 업로드 중...";
      globalLoader.classList.add("active");

      try {
        const fileRef = storage.ref().child(`quill_uploads/${Date.now()}_${file.name}`);
        await fileRef.put(file);
        const url = await fileRef.getDownloadURL();

        const range = quill.getSelection();
        quill.insertEmbed(range.index, 'image', url);
      } catch (e) {
        alert("이미지 첨부 실패: " + e.message);
      } finally {
        globalLoader.classList.remove("active");
        loaderText.textContent = "안전하게 저장하는 중입니다..."; 
      }
    }
  };
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
