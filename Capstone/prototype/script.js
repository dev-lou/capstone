/* ============================================
   RescueMind AI — Prototype Script
   Simulates the 3-screen UI flow with hardcoded responses
   ============================================ */

// --- Sample hardcoded responses to simulate AI ---
const SAMPLE_RESPONSES = [
  {
    category: "Flood / Drainage",
    urgency: "high",
    urgencyLabel: "🔴 URGENT",
    urgencyClass: "high",
    confidence: "94.2%",
    office: "City Engineering / DPWH",
    explanation: "Salamat sa iyong report! Na-receive namin ang iyong ulat tungkol sa baha na hanggang tuhod ang taas ng tubig. Ito ay marked as URGENT at iruruta sa City Engineering at DPWH para sa agarang aksyon. Manatiling alerto at makipag-ugnayan sa inyong barangay captain para sa updates.",
    offline: false
  },
  {
    category: "Garbage / Waste",
    urgency: "medium",
    urgencyLabel: "🟡 MEDIUM",
    urgencyClass: "medium",
    confidence: "87.5%",
    office: "Barangay / CENRO",
    explanation: "Salamat sa pag-report ng problema sa basura sa inyong lugar. Ito ay naka-classify bilang medium urgency at iruruta sa inyong Barangay at CENRO para sa scheduling ng cleanup. Pakitiyak na nasa tamang lalagyan ang inyong basura habang naghihintay.",
    offline: false
  },
  {
    category: "Noise Complaint",
    urgency: "low",
    urgencyLabel: "🟢 LOW",
    urgencyClass: "low",
    confidence: "76.8%",
    office: "Barangay / PNP",
    explanation: "Na-receive namin ang inyong reklamo tungkol sa ingay. Ito ay naka-classify bilang low priority at iruruta sa Barangay at PNP para sa proper coordination. Kung emergency, tumawag sa 911.",
    offline: false
  }
];

// --- Offline fallback ---
const OFFLINE_MESSAGE = "Paumanhin, hindi makakuha ng karagdagang paliwanag dahil walang koneksyon sa internet. Ang iyong report ay na-classify gamit ang aming offline AI. Makipag-ugnayan sa inyong barangay para sa follow-up.";

let currentTimeout = null;

// --- Character Counter ---
document.addEventListener('DOMContentLoaded', function() {
  const textarea = document.getElementById('complaint-input');
  const charCount = document.getElementById('char-count');

  textarea.addEventListener('input', function() {
    const len = this.value.length;
    charCount.textContent = `${len} / 500`;
    if (len > 500) {
      this.value = this.value.substring(0, 500);
      charCount.textContent = `500 / 500`;
    }
  });
});

// --- Submit Report ---
function submitReport() {
  const textarea = document.getElementById('complaint-input');
  const text = textarea.value.trim();

  if (!text) {
    textarea.focus();
    textarea.style.borderColor = '#dc2626';
    setTimeout(() => { textarea.style.borderColor = ''; }, 2000);
    return;
  }

  if (text.length < 10) {
    alert('Mangyaring magbigay ng mas detalyadong paglalarawan (hindi bababa sa 10 character).');
    textarea.focus();
    return;
  }

  // Switch to loading screen
  showScreen('screen-loading');
  animateSteps();

  // Simulate AI processing delay (1.5-3 seconds)
  const delay = 1500 + Math.random() * 1500;
  currentTimeout = setTimeout(function() {
    const response = getRandomResponse();
    showResult(response);
  }, delay);
}

// --- Animate loading steps ---
function animateSteps() {
  const steps = [
    document.getElementById('step-1'),
    document.getElementById('step-2'),
    document.getElementById('step-3')
  ];

  // Reset
  steps.forEach(step => {
    step.classList.remove('active', 'done');
    step.querySelector('.step-icon').textContent = '⬜';
  });

  // Step 1 after 300ms
  setTimeout(() => {
    steps[0].classList.add('active');
    steps[0].querySelector('.step-icon').textContent = '📝';
  }, 300);

  // Step 2 after 800ms
  setTimeout(() => {
    steps[0].classList.remove('active');
    steps[0].classList.add('done');
    steps[0].querySelector('.step-icon').textContent = '✅';
    steps[1].classList.add('active');
    steps[1].querySelector('.step-icon').textContent = '🔍';
  }, 800);

  // Step 3 after 1400ms
  setTimeout(() => {
    steps[1].classList.remove('active');
    steps[1].classList.add('done');
    steps[1].querySelector('.step-icon').textContent = '✅';
    steps[2].classList.add('active');
    steps[2].querySelector('.step-icon').textContent = '💬';
  }, 1400);
}

// --- Get random sample response ---
function getRandomResponse() {
  const index = Math.floor(Math.random() * SAMPLE_RESPONSES.length);
  return SAMPLE_RESPONSES[index];
}

// --- Show Result ---
function showResult(response) {
  // Populate result card
  const badge = document.getElementById('urgency-badge');
  badge.textContent = response.urgencyLabel;
  badge.className = 'urgency-badge ' + response.urgencyClass;

  document.getElementById('confidence').textContent = response.confidence + ' kumpiyansa';
  document.getElementById('result-category').textContent = response.category;
  document.getElementById('result-office').querySelector('.office-value').textContent = response.office;
  document.getElementById('result-explanation').innerHTML = '<p>' + response.explanation + '</p>';

  // Set timestamp
  const now = new Date();
  const timestamp = now.toLocaleString('fil-PH', {
    timeZone: 'Asia/Manila',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  document.getElementById('result-timestamp').textContent = 'Na-classify noong: ' + timestamp;

  // Show/hide offline fallback
  const fallbackCard = document.getElementById('fallback-card');
  fallbackCard.style.display = response.offline ? 'block' : 'none';

  // Switch to result screen
  showScreen('screen-result');
}

// --- Reset Form ---
function resetForm() {
  if (currentTimeout) {
    clearTimeout(currentTimeout);
    currentTimeout = null;
  }

  const textarea = document.getElementById('complaint-input');
  textarea.value = '';
  document.getElementById('char-count').textContent = '0 / 500';
  showScreen('screen-input');
}

// --- Screen Switcher ---
function showScreen(screenId) {
  document.querySelectorAll('.screen').forEach(screen => {
    screen.classList.remove('active');
  });
  document.getElementById(screenId).classList.add('active');
}

// --- Keyboard shortcut: Ctrl+Enter to submit ---
document.addEventListener('keydown', function(e) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    const inputScreen = document.getElementById('screen-input');
    if (inputScreen.classList.contains('active')) {
      submitReport();
    }
  }
});
