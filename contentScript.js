// contentScript.js

function showJobPopup(job) {
  // Remove any existing popup
  const oldPopup = document.getElementById('job-app-popup');
  if (oldPopup) oldPopup.remove();

  const popup = document.createElement('div');
  popup.id = 'job-app-popup';
  popup.style.position = 'fixed';
  popup.style.bottom = '30px';
  popup.style.right = '30px';
  popup.style.zIndex = '9999';
//  popup.style.background = 'rgba(34,34,34,0.85)';
  popup.style.borderRadius = '50%';
  popup.style.width = '70px';
  popup.style.height = '70px';
  popup.style.display = 'flex';
  popup.style.alignItems = 'center';
  popup.style.justifyContent = 'center';
  popup.style.boxShadow = '0 2px 12px rgba(0,0,0,0.25)';
  popup.style.pointerEvents = 'none';
  popup.style.animation = 'jobAppPopIn 0.4s cubic-bezier(.68,-0.55,.27,1.55)';

  popup.innerHTML = `
    <svg width="70" height="70" viewBox="0 0 70 70">
      <circle cx="35" cy="35" r="35" fill="#FFFFFF" opacity="1"/>
      <circle id="j-dot" cx="38" cy="22" r="3.8" fill="#0462f9" style="opacity:0"/>
      <path id="j-stem"
        d="M38 32 v16 a6 6 0 1 1 -12 0"
        stroke="#0462f9"
        stroke-width="5"
        fill="none"
        stroke-linecap="round"
        style="stroke-dasharray:44; stroke-dashoffset:44; opacity:0"/>
    </svg>
  `;

  document.body.appendChild(popup);

  // Animate the dot bounce
  setTimeout(() => {
    const dot = popup.querySelector('#j-dot');
    if (dot) {
      dot.style.opacity = '1';
      dot.style.animation = 'dotBounce 0.7s cubic-bezier(.68,-0.55,.27,1.55)';
    }
  }, 100);

  // Animate the stem/curve draw after the dot bounce
  setTimeout(() => {
    const stem = popup.querySelector('#j-stem');
    if (stem) {
      stem.style.opacity = '1';
      stem.style.animation = 'jDraw 0.7s cubic-bezier(.68,-0.55,.27,1) forwards';
    }
  }, 100);

  // Fade out and remove popup
  setTimeout(() => {
    popup.style.transition = 'opacity 0.6s';
    popup.style.opacity = '0';
    setTimeout(() => popup.remove(), 600);
  }, 1500);
}

// Add animation CSS
const style = document.getElementById('job-app-popup-style') || document.createElement('style');
style.id = 'job-app-popup-style';
style.textContent = `
@keyframes jobAppPopIn {
  0% { transform: scale(0.7); opacity: 1; }
  80% { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}
@keyframes dotBounce {
  0%   { transform: translateY(0) scale(1); }
  30%  { transform: translateY(-4px) scale(1); }
  50%  { transform: translateY(0) scale(1); }
  70%  { transform: translateY(-2px) scale(1); }
  100% { transform: translateY(0) scale(1); }
}
@keyframes jDraw {
  0%   { stroke-dashoffset: 44; }
  100% { stroke-dashoffset: 0; }
}
`;
document.head.appendChild(style);

function sendJobApplication(job) {
  //print job details
  showJobPopup(job);
  console.log('Job Application Details:', job);
  chrome.runtime.sendMessage({ type: 'newJobApp', job });

}

// Attach extractors to specific sites
if (window.location.hostname.includes('linkedin.com')) {
  window.attachLinkedInSubmit();
} else if (window.location.hostname.includes('smartapply.indeed')) {
  //window.attachSmartApplyIndeedSubmit();
  //done from indeed.com, could be done through SmartApply but not currently
} else if (window.location.hostname.includes('indeed.com')) {
  window.attachIndeedSubmit();
} else if (window.location.hostname.includes('workday')) {
  window.attachWorkdaySubmit();
} else if (window.location.hostname.includes('monster')) {
  window.attachMonsterSubmit();
} else if (window.location.hostname.includes('glassdoor')) {
  window.attachGlassdoorSubmit();
} else if (window.location.hostname.includes('lever')) {
  window.attachLeverSubmit();
} else if (window.location.hostname.includes('greenhouse')) {
  window.attachGreenhouseSubmit();
} else if (window.location.hostname.includes('vector')) {
  window.attachVectorSubmit();
} else {
  // For other sites do not trigger on any buttons
}