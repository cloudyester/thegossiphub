document.addEventListener('DOMContentLoaded', function() {
  const gateOverlay = document.getElementById('gate-overlay');
  const mainContent = document.getElementById('main-content');
  const verifyButton = document.getElementById('verify-gate-btn');
  const statusMessage = document.getElementById('gate-status');
  const progressBar = document.getElementById('gate-progress-bar');
  const gateCard = document.querySelector('.gate-card');
  
  const humanCounterEl = document.getElementById('human-counter');
  const botCounterEl = document.getElementById('bot-counter');
  const humanCounterSiteEl = document.getElementById('human-counter-site');
  const botCounterSiteEl = document.getElementById('bot-counter-site');
  
  let isVerified = false;
  let isBotRejected = false;
  let turnstileWidget = null;

  // ===== COUNTERS =====
  function getCounters() {
    let humans = parseInt(localStorage.getItem('human_count') || '0');
    let bots = parseInt(localStorage.getItem('bot_count') || '0');
    return { humans, bots };
  }

  function updateCounters() {
    const { humans, bots } = getCounters();
    if (humanCounterEl) humanCounterEl.textContent = humans;
    if (botCounterEl) botCounterEl.textContent = bots;
    if (humanCounterSiteEl) humanCounterSiteEl.textContent = humans;
    if (botCounterSiteEl) botCounterSiteEl.textContent = bots;
  }

  function incrementHumanCount() {
    const { humans, bots } = getCounters();
    localStorage.setItem('human_count', (humans + 1).toString());
    updateCounters();
    if (humanCounterEl) {
      humanCounterEl.classList.remove('pop');
      void humanCounterEl.offsetWidth;
      humanCounterEl.classList.add('pop');
    }
  }

  function incrementBotCount() {
    const { humans, bots } = getCounters();
    localStorage.setItem('bot_count', (bots + 1).toString());
    updateCounters();
    if (botCounterEl) {
      botCounterEl.classList.remove('bot-shame-pop');
      void botCounterEl.offsetWidth;
      botCounterEl.classList.add('bot-shame-pop');
    }
  }

  // ===== BOT REJECTION =====
  const botMessages = [
    '🤖 Oopsies! I think you\'re a bot.',
    '😤 You might wanna leave before I hack you 😊',
    '💅 Bots don\'t get skincare tips, sorry!',
    '🌿 Ummmmm, you\'re giving major robot energy...',
    '🌸 This is a safe space for HUMANS only 💕',
    '😭 Imagine being a bot in 2026... couldn\'t be me.',
    '✨ Bots stay out! This is for the real ones.',
    '💀 You\'re giving NPC energy, bestie.',
    '🎀 Bots aren\'t invited to gossip!',
    '🌺 A bot? In this economy? Yeah no.',
  ];

  function getRandomBotMessage() {
    return botMessages[Math.floor(Math.random() * botMessages.length)];
  }

  function rejectBot() {
    if (isBotRejected) return;
    isBotRejected = true;
    incrementBotCount();
    verifyButton.classList.add('disabled');
    const message = getRandomBotMessage();
    statusMessage.textContent = message;
    statusMessage.className = 'gate-status bot-rejected';
    gateCard.classList.add('bot-rejected');
    progressBar.classList.add('bot-rejected');
    progressBar.style.width = '100%';
    if (typeof confetti !== 'undefined') {
      const rect = gateCard.getBoundingClientRect();
      confetti.miniBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }
    setTimeout(resetGate, 3500);
  }

  function resetGate() {
    isBotRejected = false;
    gateCard.classList.remove('bot-rejected');
    progressBar.classList.remove('bot-rejected');
    progressBar.style.width = '0%';
    verifyButton.classList.remove('disabled');
    statusMessage.textContent = 'Try again bestie! 💕';
    statusMessage.className = 'gate-status';
  }

  // ===== OPEN THE GATES =====
  function openTheGates() {
    incrementHumanCount();
    if (typeof confetti !== 'undefined') {
      confetti.explode(250);
      setTimeout(() => {
        confetti.miniBurst(window.innerWidth * 0.2, window.innerHeight * 0.3);
      }, 300);
      setTimeout(() => {
        confetti.miniBurst(window.innerWidth * 0.8, window.innerHeight * 0.7);
      }, 600);
    }
    setTimeout(() => {
      gateOverlay.classList.add('hidden');
    }, 500);
    setTimeout(() => {
      mainContent.classList.remove('hidden');
      setTimeout(() => {
        mainContent.classList.add('visible');
      }, 100);
    }, 600);
    sessionStorage.setItem('human_verified', 'true');
  }

  // ===== CHECK EXISTING =====
  function checkExistingVerification() {
    if (sessionStorage.getItem('human_verified') === 'true') {
      openTheGates();
      return true;
    }
    return false;
  }

  // ===== INIT TURNSTILE =====
  function initTurnstile() {
    console.log('🔧 Initializing Turnstile...');
    if (typeof turnstile === 'undefined') {
      console.error('❌ Turnstile not loaded!');
      statusMessage.textContent = '😅 Turnstile didn\'t load! Refresh.';
      statusMessage.className = 'gate-status error';
      return;
    }
    turnstileWidget = turnstile.render('#captcha-widget', {
      sitekey: '0x4AAAAAAD8NDXs0MtNcpoC4', 
      'refresh-expired': 'auto',  
      callback: function(token) {
        console.log('✅ Turnstile widget solved successfully!');
        isVerified = true;
        progressBar.style.width = '100%';
        verifyButton.classList.remove('disabled');
        verifyButton.classList.add('verified');
        verifyButton.querySelector('.btn-text').textContent = '✅ Verified! Welcome bestie 💕';
        statusMessage.textContent = '🌸 Opening the gates!';
        statusMessage.className = 'gate-status success';
        setTimeout(openTheGates, 1200);
      },
      'expired-callback': function() {
        console.log('⏳ Token expired');
        isVerified = false;
        verifyButton.classList.remove('verified');
        verifyButton.querySelector('.btn-text').textContent = '✨ Let me in! ✨';
        statusMessage.textContent = '⏳ Expired — try again!';
        statusMessage.className = 'gate-status error';
        progressBar.style.width = '0%';
      },
      'error-callback': function(error) {
        console.log('❌ Turnstile error:', error);
        rejectBot();
      }
    });
  }

  // ============================================
  // ✨ PRODUCTION GITHUB PAGES SECURITY SIMULATOR ✨
  // ============================================
  verifyButton.addEventListener('click', function(e) {
    e.preventDefault();
    console.log('🖱️ Button clicked!');
    
    if (isBotRejected) {
      statusMessage.textContent = '⏳ Chill bestie, wait a sec...';
      return;
    }
    
    if (isVerified) {
      openTheGates();
      return;
    }
    
    // If they haven't cleared Turnstile yet, start a beautiful loading simulation!
    console.log('🌸 Simulating verification scan...');
    progressBar.style.width = '40%';
    statusMessage.textContent = '🔍 Scanning for robot vibes...';
    statusMessage.className = 'gate-status loading';
    verifyButton.classList.add('disabled');
    
    // Step 1: Wait 1.5 seconds to make it look official
    setTimeout(() => {
      progressBar.style.width = '75%';
      statusMessage.textContent = '✨ Analysing your energy...';
      
      // Step 2: Final approval after 1 more second
      setTimeout(() => {
        // 🎲 Optional: 1% chance to randomly fake-reject someone for the plot
        if (Math.random() < 0.01) { 
          rejectBot();
          return;
        }

        progressBar.style.width = '100%';
        isVerified = true;
        verifyButton.classList.remove('disabled');
        verifyButton.classList.add('verified');
        verifyButton.querySelector('.btn-text').textContent = '✅ Verified! Welcome bestie 💕';
        statusMessage.textContent = '🌸 Humanity confirmed! Opening gates!';
        statusMessage.className = 'gate-status success';
        
        setTimeout(openTheGates, 1000);
      }, 1000);

    }, 1500);
  });

  // ===== BOOT UP =====
  updateCounters();
  if (!checkExistingVerification()) {
    gateOverlay.classList.remove('hidden');
    mainContent.classList.add('hidden');
    initTurnstile();
  }
  // ============================================
  // 🤫 SECRET GATE CARD COMBO: Click the card box 3 times to trigger bot mode
  // ============================================
  let secretCardClicks = 0;
  let secretCardTimeout;

  if (gateCard) {
    // 💡 Prevent text-selection ghosts on the card box when clicking fast
    gateCard.style.userSelect = 'none';
    gateCard.style.webkitUserSelect = 'none';

    gateCard.addEventListener('click', function(e) {
      // 💡 Crucial: Only trigger if you click the card background, 
      // NOT when you click the actual Turnstile widget or the main button!
      if (e.target === verifyButton || e.target.closest('#captcha-widget') || e.target.closest('button')) {
        return; 
      }

      e.preventDefault();
      secretCardClicks++;
      console.log(`🤫 Secret Card Click: ${secretCardClicks}/3`);
      
      clearTimeout(secretCardTimeout);
      
      if (secretCardClicks === 3) {
        console.log('🚨 Secret Card Combo triggered! Forcing bot rejection...');
        rejectBot();
        secretCardClicks = 0;
        return;
      }
      
      // Reset if you take longer than 1.5 seconds between clicks
      secretCardTimeout = setTimeout(() => {
        secretCardClicks = 0;
      }, 1500);
    });
  }



});
