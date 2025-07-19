// Injects required CSS for popup animation if not already present
function injectPopupAnimationCSS() {
  if (!document.getElementById('job-app-popup-style')) {
    const style = document.createElement('style');
    style.id = 'job-app-popup-style';
    style.textContent = `
@keyframes jobAppPopIn {
  0% { transform: scale(0.7); opacity: 0; }
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
  }
}

// Shows the animated "j" popup
export function showJobPopupAnimation() {
  injectPopupAnimationCSS();

  // Remove any existing popup
  const oldPopup = document.getElementById('job-app-popup');
  if (oldPopup) oldPopup.remove();

  // Create popup container
  const popup = document.createElement('div');
  popup.id = 'job-app-popup';
  popup.style.position = 'fixed';
  popup.style.bottom = '30px';
  popup.style.right = '30px';
  popup.style.zIndex = '9999';
  popup.style.background = 'rgba(34,34,34,0.85)';
  popup.style.borderRadius = '50%';
  popup.style.width = '70px';
  popup.style.height = '70px';
  popup.style.display = 'flex';
  popup.style.alignItems = 'center';
  popup.style.justifyContent = 'center';
  popup.style.boxShadow = '0 2px 12px rgba(0,0,0,0.25)';
  popup.style.pointerEvents = 'none';
  popup.style.animation = 'jobAppPopIn 0.4s cubic-bezier(.68,-0.55,.27,1.55)';

  // Add SVG for animated "j"
  popup.innerHTML = `
    <svg width="40" height="40" viewBox="0 0 40 40">
      <circle cx="20" cy="20" r="18" fill="#FFFFFF" opacity="1.0"/>
      <circle id="j-dot" cx="22" cy="12" r="2.2" fill="#0462f9" style="opacity:0"/>
      <path id="j-stem"
        d="M22 18 v9 a3 3 0 1 1 -6 0"
        stroke="#0462f9"
        stroke-width="3"
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
      stem.style.animation = 'jDraw 0.7s cubic-bezier(.68,-0.55,.27,1.55) forwards';
    }
  }, 600);

  // Fade out and remove popup
  setTimeout(() => {
    popup.style.transition = 'opacity 0.6s';
    popup.style.opacity = '0';
    setTimeout(() => popup.remove(), 600);
  }, 2000);
}