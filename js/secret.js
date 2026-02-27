// // secret.js
// export function createSecretController(navigateToSecret) {
//   let playStreak = 0;
//   let secretTimer = null;

//   const splash = () => {
//     const splash = document.getElementById('secret-splash');
//     const content = document.getElementById('secret-content');
//     if (!splash || !content) return;
//     splash.style.display = 'flex';
//     content.style.display = 'none';
//     clearTimeout(secretTimer);
//     secretTimer = setTimeout(() => {
//       splash.style.display = 'none';
//       content.style.display = 'flex';
//     }, 3000);
//   };

//   const reset = () => {
//     clearTimeout(secretTimer);
//     const splashEl = document.getElementById('secret-splash');
//     const content = document.getElementById('secret-content');
//     if (!splashEl || !content) return;
//     splashEl.style.display = 'flex';
//     content.style.display = 'none';
//   };

//   // Listen for view changes to start/stop secret splash
//   document.addEventListener('viewchange', (e) => {
//     if (e.detail?.id === 'secret') {
//       splash();
//     } else {
//       reset();
//     }
//   });

//   function registerButton(name) {
//     if (name === 'play') {
//       playStreak += 1;
//       if (playStreak >= 3) {
//         playStreak = 0;
//         navigateToSecret();
//         return true;
//       }
//     } else {
//       playStreak = 0;
//     }
//     return false;
//   }

//   return { registerButton };
// }
