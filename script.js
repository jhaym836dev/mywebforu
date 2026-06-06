window.addEventListener("load", ()  =>{

    let name = document.querySelector(".name");
    let introLoader = document.querySelector(".intro-loader");

    setTimeout(() => {
        name.style.opacity = '1'
        name.style.transform = 'translateY(0)'
    },300)

    setTimeout(() => {
        introLoader.style.top = '-100%'
    }, 2000)

    // After loader hides, wire up the evasive No button
    setTimeout(initEvasiveNo, 2100)
    // wire up smooth page transition for the Yes link on the index page
    setTimeout(initYesTransition, 2100);
})

function initEvasiveNo(){
    const noBtn = document.getElementById('noBtn');
    const card = document.querySelector('.card');
    const yes = document.querySelector('.btn.yes');
    if(!noBtn || !card) return;

    // make it absolutely positioned inside the card
    noBtn.style.position = 'absolute';
    noBtn.style.zIndex = 5;

    // place initial position to the right of the yes button
    const placeInitial = () => {
        const cardRect = card.getBoundingClientRect();
        const yesRect = yes.getBoundingClientRect();
        const btnW = noBtn.offsetWidth;
        const btnH = noBtn.offsetHeight;
        const left = Math.min(card.clientWidth - btnW - 16, yesRect.right - cardRect.left + 16);
        const top = Math.max(16, yesRect.top - cardRect.top);
        noBtn.style.left = left + 'px';
        noBtn.style.top = top + 'px';
    }

    placeInitial();

    function distance(ax,ay,bx,by){
        const dx = ax-bx; const dy = ay-by; return Math.sqrt(dx*dx+dy*dy);
    }

    let lastMove = 0;
    function moveAway(cursorX, cursorY){
        const now = Date.now();
        // throttle moves to keep them smooth and not too frequent
        if(now - lastMove < 350) return;
        lastMove = now;

        const cardRect = card.getBoundingClientRect();
        const btnW = noBtn.offsetWidth;
        const btnH = noBtn.offsetHeight;

        // try a few times to find a spot far enough from the cursor
        let attempts = 0;
        let newLeft, newTop;
        do{
            newLeft = Math.floor(Math.random() * (card.clientWidth - btnW - 24)) + 12;
            newTop = Math.floor(Math.random() * (card.clientHeight - btnH - 24)) + 12;
            attempts++;
            const btnCenterX = cardRect.left + newLeft + btnW/2;
            const btnCenterY = cardRect.top + newTop + btnH/2;
            if(distance(btnCenterX, btnCenterY, cursorX, cursorY) > Math.max(120, btnW*1.2)) break;
        } while(attempts < 12);

        // apply new coordinates (CSS transitions will animate movement)
        noBtn.style.left = newLeft + 'px';
        noBtn.style.top = newTop + 'px';
    }

    // move when pointer gets near the button or when hovering over it
    card.addEventListener('mousemove', (ev) => {
        const cursorX = ev.clientX; const cursorY = ev.clientY;
        const btnRect = noBtn.getBoundingClientRect();
        const btnCenterX = btnRect.left + btnRect.width/2;
        const btnCenterY = btnRect.top + btnRect.height/2;
        if(distance(cursorX, cursorY, btnCenterX, btnCenterY) < 140){
            moveAway(cursorX, cursorY);
        }
    });

    noBtn.addEventListener('mouseenter', (ev) => {
        moveAway(ev.clientX, ev.clientY);
    });

    // touch support: when touched, jump away immediately
    noBtn.addEventListener('touchstart', (ev) => {
        const t = ev.touches[0];
        moveAway(t.clientX, t.clientY);
        ev.preventDefault();
    }, {passive:false});

    // prevent clicking
    noBtn.addEventListener('click', (ev) => {
        ev.preventDefault();
        moveAway(ev.clientX || window.innerWidth/2, ev.clientY || window.innerHeight/2);
    });

    // keep it inside after resize
    window.addEventListener('resize', () => placeInitial());
}

function initYesTransition(){
    var yesAnchor = document.querySelector('.btn.yes[href$="yes.html"]');
    if(!yesAnchor) return;
    yesAnchor.addEventListener('click', function(e){
        e.preventDefault();
        // create overlay
        var ov = document.createElement('div');
        ov.className = 'page-transition-overlay';
        ov.innerHTML = '<div class="v"></div>';
        document.body.appendChild(ov);
        // force paint then show
        void ov.offsetWidth;
        ov.classList.add('show');
        // after brief animation, follow the link
        setTimeout(function(){ location.href = yesAnchor.getAttribute('href'); }, 520);
    });
}
