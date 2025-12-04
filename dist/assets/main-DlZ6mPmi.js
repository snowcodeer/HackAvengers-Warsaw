import"./modulepreload-polyfill-B5Qt9EMX.js";document.addEventListener("DOMContentLoaded",()=>{console.log("DOM Content Loaded");try{P(),console.log("Trees created"),T(),console.log("Garden created"),k(),console.log("Bushes created"),B(),console.log("Rocks created"),L(),console.log("Bunnies created"),C(),console.log("Snowfall initialized"),F(),console.log("Button effects initialized")}catch(l){console.error("Error initializing:",l)}});const w=[{petals:"#ff6b8a",center:"#ffeb3b"},{petals:"#ff8a65",center:"#fff176"},{petals:"#ba68c8",center:"#ffcc02"},{petals:"#64b5f6",center:"#fff59d"},{petals:"#ff7043",center:"#ffd54f"},{petals:"#ec407a",center:"#fff176"},{petals:"#7e57c2",center:"#ffeb3b"},{petals:"#f06292",center:"#fff9c4"},{petals:"#ea80fc",center:"#ffeb3b"},{petals:"#ff5252",center:"#ffeb3b"}],y=["round","star","diamond","tulip","daisy"];function k(){const l=document.getElementById("flowersContainer"),o=12;for(let n=0;n<o;n++){const e=document.createElement("div");e.className="pixel-bush";const s=3+n/o*92;e.style.left=`${s}%`;const a=40+Math.floor(Math.random()*50),p=a*(.6+Math.random()*.3),r=["#2d8a2d","#3da03d","#4db84d","#35a035"],t=r[Math.floor(Math.random()*r.length)],x=M(t,20),i=u(t,15),d=3+Math.floor(Math.random()*3);let h="";for(let c=0;c<d;c++){const $=a*(.5+Math.random()*.4),f=(c-d/2+.5)*(a*.35),g=Math.random()*10,m=c%2===0?t:i;h+=`
                <div style="
                    position: absolute;
                    bottom: ${g}px;
                    left: 50%;
                    transform: translateX(calc(-50% + ${f}px));
                    width: ${$}px;
                    height: ${$*.7}px;
                    background: ${m};
                    box-shadow:
                        ${Math.floor($*.15)}px 0 0 0 ${x},
                        -${Math.floor($*.15)}px 0 0 0 ${i},
                        0 4px 0 0 ${x};
                "></div>
            `}e.innerHTML=h,e.style.width=`${a*1.5}px`,e.style.height=`${p+20}px`,e.style.animationDelay=`${.3+n*.08}s`,l.appendChild(e)}}function C(){const l=document.getElementById("snowContainer"),o=50;for(let n=0;n<o;n++)createSnowflake(l)}function B(){const l=document.getElementById("flowersContainer"),o=8;for(let n=0;n<o;n++){const e=document.createElement("div");e.className="pixel-rock";const s=5+Math.random()*88;e.style.left=`${s}%`;const a=24+Math.floor(Math.random()*40),p=a*(.5+Math.random()*.3),r=["#808080","#909090","#707070","#858585"],t=r[Math.floor(Math.random()*r.length)];e.innerHTML=`
            <div style="
                width: ${a}px;
                height: ${p}px;
                background: ${t};
                box-shadow:
                    ${Math.floor(a*.2)}px 0 0 0 ${M(t,20)},
                    -${Math.floor(a*.15)}px 0 0 0 ${u(t,15)},
                    0 4px 0 0 ${M(t,30)},
                    inset ${Math.floor(a*.2)}px ${Math.floor(p*.2)}px 0 0 ${u(t,20)};
            "></div>
            ${Math.random()>.5?`
                <div style="
                    position: absolute;
                    top: -6px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: ${a*.6}px;
                    height: 8px;
                    background: #f8f8f8;
                    box-shadow: 0 2px 0 0 #d0d8e0;
                "></div>
            `:""}
        `,e.style.animationDelay=`${.5+n*.1}s`,l.appendChild(e)}}function L(){const l=document.getElementById("flowersContainer"),o=5;for(let n=0;n<o;n++){const e=document.createElement("div");e.className="pixel-bunny";const s=10+n/o*75;e.style.left=`${s}%`;const a=Math.random()>.5,p=["#f0e8e0","#e8e0d8","#d8d0c8","#f8f0e8","#e0d8d0"],r=p[Math.floor(Math.random()*p.length)],t=M(r,15),x=u(r,10);e.innerHTML=`
            <div class="bunny-body" style="
                width: 32px;
                height: 24px;
                background: ${r};
                position: relative;
                box-shadow:
                    4px 0 0 0 ${t},
                    -4px 0 0 0 ${x},
                    0 4px 0 0 ${t};
                transform: scaleX(${a?-1:1});
            ">
                <!-- Head -->
                <div style="
                    position: absolute;
                    top: -12px;
                    right: -8px;
                    width: 24px;
                    height: 20px;
                    background: ${r};
                    box-shadow:
                        4px 0 0 0 ${t},
                        -4px 0 0 0 ${x},
                        0 -4px 0 0 ${x};
                ">
                    <!-- Left ear -->
                    <div style="
                        position: absolute;
                        top: -20px;
                        left: 2px;
                        width: 8px;
                        height: 20px;
                        background: ${r};
                        box-shadow: 2px 0 0 0 ${t};
                    ">
                        <div style="
                            position: absolute;
                            top: 4px;
                            left: 2px;
                            width: 4px;
                            height: 12px;
                            background: #ffb8b8;
                        "></div>
                    </div>
                    <!-- Right ear -->
                    <div style="
                        position: absolute;
                        top: -16px;
                        right: 2px;
                        width: 8px;
                        height: 16px;
                        background: ${r};
                        box-shadow: 2px 0 0 0 ${t};
                    ">
                        <div style="
                            position: absolute;
                            top: 3px;
                            left: 2px;
                            width: 4px;
                            height: 10px;
                            background: #ffb8b8;
                        "></div>
                    </div>
                    <!-- Eye -->
                    <div style="
                        position: absolute;
                        top: 6px;
                        right: 4px;
                        width: 6px;
                        height: 6px;
                        background: #303030;
                    ">
                        <div style="
                            position: absolute;
                            top: 1px;
                            left: 1px;
                            width: 2px;
                            height: 2px;
                            background: white;
                        "></div>
                    </div>
                    <!-- Nose -->
                    <div style="
                        position: absolute;
                        bottom: 2px;
                        right: -2px;
                        width: 6px;
                        height: 4px;
                        background: #ffb0b0;
                    "></div>
                </div>
                <!-- Tail -->
                <div style="
                    position: absolute;
                    top: 4px;
                    left: -10px;
                    width: 12px;
                    height: 12px;
                    background: ${x};
                    border-radius: 50%;
                "></div>
                <!-- Front leg -->
                <div style="
                    position: absolute;
                    bottom: -8px;
                    right: 4px;
                    width: 8px;
                    height: 12px;
                    background: ${r};
                    box-shadow: 2px 0 0 0 ${t};
                "></div>
                <!-- Back leg -->
                <div style="
                    position: absolute;
                    bottom: -8px;
                    left: 4px;
                    width: 10px;
                    height: 14px;
                    background: ${t};
                "></div>
            </div>
        `,l.appendChild(e),I(e,a)}}function I(l,o){let n=parseFloat(l.style.left),e=o;const s=l.querySelector(".bunny-body");function a(){s&&(s.style.transform=`scaleX(${e?-1:1})`)}function p(){const r=Math.random();if(r<.25)l.classList.remove("hopping"),l.classList.add("idle"),setTimeout(p,1500+Math.random()*2500);else if(r<.4)e=!e,a(),l.classList.remove("hopping"),l.classList.add("idle"),setTimeout(p,800+Math.random()*1e3);else{l.classList.remove("idle"),l.classList.add("hopping");const t=4+Math.random()*6;e?n=Math.max(5,n-t):n=Math.min(90,n+t),(n<=5||n>=90)&&setTimeout(()=>{e=!e,a()},500),l.style.left=`${n}%`,setTimeout(()=>{l.classList.remove("hopping"),setTimeout(p,400+Math.random()*1500)},500);return}}setTimeout(p,Math.random()*2e3)}function P(){const l=document.getElementById("flowersContainer"),o=[5,28,68,92];for(let n=0;n<o.length;n++)S(l,o[n],n)}function S(l,o,n){const e=document.createElement("div");e.className="pixel-tree",e.style.left=`${o}%`;const s=window.innerHeight*(1.2+Math.random()*.5),a=40+Math.floor(Math.random()*30),p=.1+n*.5,r=`
        <div class="tree-trunk" style="
            width: ${a}px;
            height: ${s*.5}px;
            background: #6a4420;
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            box-shadow:
                ${Math.floor(a*.2)}px 0 0 0 #4a2a10,
                -${Math.floor(a*.2)}px 0 0 0 #8a5a30,
                inset 8px 0 0 0 #8a5a30,
                inset -8px 0 0 0 #4a2a10;
        "></div>
    `,t=8+Math.floor(Math.random()*5);let x="";const i=a*4;for(let d=0;d<t;d++){const h=i-d*(i/t)*.7,c=32+Math.floor(Math.random()*16),$=d%3===0?"#208020":d%3===1?"#30a030":"#48c048",f=d*28;x+=`
            <div class="tree-foliage-row" style="
                width: ${h}px;
                height: ${c}px;
                background: ${$};
                position: absolute;
                bottom: ${s*.4+f}px;
                left: 50%;
                transform: translateX(-50%);
                box-shadow: 
                    ${Math.floor(h*.15)}px 0 0 0 #1a6a1a,
                    -${Math.floor(h*.15)}px 0 0 0 #50d050,
                    0 4px 0 0 #1a5a1a;
            "></div>
        `,d%2===0&&(x+=`
                <div class="tree-snow-row" style="
                    width: ${h*.8}px;
                    height: 16px;
                    background: #f8f8f8;
                    position: absolute;
                    bottom: ${s*.4+f+c-8}px;
                    left: 50%;
                    transform: translateX(-50%);
                    box-shadow: 
                        -${Math.floor(h*.2)}px 4px 0 0 #f8f8f8,
                        ${Math.floor(h*.2)}px 4px 0 0 #f8f8f8,
                        0 4px 0 0 #d0d8e0;
                "></div>
            `)}e.innerHTML=`${r}${x}`,e.style.animationDelay=`${p}s`,l.appendChild(e)}function T(){const l=document.getElementById("flowersContainer"),o=8,n=Array.from({length:o},(a,p)=>p);E(n);const e=90/o,s=[];for(let a=0;a<o;a++){const p=5+a*e,r=Math.random()*(e*.6);s.push(p+r)}for(let a=0;a<o;a++){const p=n.indexOf(a);H(l,a,s[a],p)}}function E(l){for(let o=l.length-1;o>0;o--){const n=Math.floor(Math.random()*(o+1));[l[o],l[n]]=[l[n],l[o]]}return l}function H(l,o,n,e){const s=document.createElement("div");s.className="flower",s.style.left=`${n}%`;const p=(50+Math.random()*20)/100*window.innerHeight,r=w[Math.floor(Math.random()*w.length)],t=50+Math.floor(Math.random()*50),x=Math.floor(t*.4),i=y[Math.floor(Math.random()*y.length)],d=14+Math.floor(Math.random()*8),h=Math.random()>.5?1:-1,c=60+Math.random()*80,$=.2+e*.15,f=1+Math.random()*2,g=3+Math.random()*2,m=D(p,d,h,c),v=h*c,b=t+x*3;s.innerHTML=`
        <div class="flower-head-wrapper" style="
            width: ${b}px; 
            height: ${b}px;
            position: absolute;
            bottom: ${p-b/2}px;
            left: 50%;
            transform: translateX(calc(-50% + ${v}px));
            z-index: 10;
            display: flex;
            align-items: center;
            justify-content: center;
        ">
            <div class="flower-head" style="
                width: ${t}px; 
                height: ${t}px;
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
            ">
                ${X(x,r.petals,i)}
                <div class="flower-center" style="
                    width: ${Math.floor(t*.28)}px;
                    height: ${Math.floor(t*.28)}px;
                    background: ${r.center};
                    position: absolute;
                    z-index: 5;
                    box-shadow: 
                        inset 3px 3px 0 0 ${u(r.center,30)},
                        inset -3px -3px 0 0 ${M(r.center,20)};
                "></div>
            </div>
        </div>
        <div class="flower-stem-container" style="
            height: ${p}px; 
            width: ${c*2+d+60}px;
            position: relative;
        ">
            ${m}
        </div>
    `,s.style.animationDelay=`${$}s`,s.style.setProperty("--grow-delay",`${$}s`),s.style.setProperty("--sway-amount",`${f}deg`),s.style.setProperty("--sway-duration",`${g}s`),l.appendChild(s),setTimeout(()=>{s.classList.add("sway")},($+2.2)*1e3)}function D(l,o,n,e){const s=Math.floor(l/20);let a="";const p=e+o/2+30;for(let r=0;r<s;r++){const t=r/s,x=(r+1)/s,i=Math.sin(t*Math.PI*.8)*e*n,d=Math.sin(x*Math.PI*.8)*e*n,h=20,c=r*h,$=p+i,f=Math.atan2(d-i,h)*(180/Math.PI);if(a+=`
            <div class="stem-segment" style="
                position: absolute;
                bottom: ${c}px;
                left: ${$}px;
                width: ${o}px;
                height: ${h+6}px;
                background: #40a040;
                transform: translateX(-50%) rotate(${f*.3}deg);
                box-shadow:
                    ${Math.floor(o*.25)}px 0 0 0 #308030,
                    -${Math.floor(o*.25)}px 0 0 0 #50c850,
                    0 4px 0 0 #308030;
            "></div>
        `,r%4===2&&r<s-2){const g=r%2===0?-1:1,m=20+Math.floor(Math.random()*12);a+=`
                <div class="pixel-leaf" style="
                    position: absolute;
                    bottom: ${c+6}px;
                    left: ${$+g*o*.8}px;
                    width: ${m}px;
                    height: ${Math.floor(m*.5)}px;
                    background: #48c048;
                    transform: translateX(${g>0?"0":"-100%"}) rotate(${g*25}deg);
                    box-shadow:
                        ${g*3}px 3px 0 0 #308030,
                        inset ${g*3}px 2px 0 0 #60d860;
                "></div>
            `}}return a}function X(l,o,n){const e=M(o,25),s=M(o,40),a=u(o,30),p=u(o,50),r=u(o,70),t=Math.floor(l*1.6),x=Math.floor(l*.45),i=Math.floor(l*.25),d=Math.floor(l*.15),h=Math.floor(l*1.4),c=Math.floor(t*.5),$=Math.floor(t*.75);let f="";switch(n){case"star":f=`
                <div style="
                    position: absolute;
                    width: ${h}px;
                    height: ${h}px;
                    background: ${o};
                    box-shadow:
                        /* Outer petals - dark edges */
                        0 -${t}px 0 ${x}px ${e},
                        0 ${t}px 0 ${x}px ${e},
                        -${t}px 0 0 ${x}px ${e},
                        ${t}px 0 0 ${x}px ${e},
                        /* Diagonal petals */
                        -${$}px -${$}px 0 ${i}px ${o},
                        ${$}px -${$}px 0 ${i}px ${o},
                        -${$}px ${$}px 0 ${i}px ${s},
                        ${$}px ${$}px 0 ${i}px ${s},
                        /* Main petal colors */
                        0 -${Math.floor(t*.85)}px 0 ${i}px ${o},
                        0 ${Math.floor(t*.85)}px 0 ${i}px ${o},
                        -${Math.floor(t*.85)}px 0 0 ${i}px ${a},
                        ${Math.floor(t*.85)}px 0 0 ${i}px ${o},
                        /* Inner highlights */
                        0 -${c}px 0 ${d}px ${a},
                        -${c}px 0 0 ${d}px ${p},
                        /* Pixel detail spots */
                        -${Math.floor(t*.3)}px -${Math.floor(t*.8)}px 0 3px ${r},
                        ${Math.floor(t*.3)}px -${Math.floor(t*.6)}px 0 2px ${p};
                "></div>
            `;break;case"diamond":f=`
                <div style="
                    position: absolute;
                    width: ${h}px;
                    height: ${h}px;
                    background: ${o};
                    box-shadow:
                        /* Outer dark edges */
                        0 -${t}px 0 ${x}px ${s},
                        0 ${t}px 0 ${x}px ${s},
                        -${t}px 0 0 ${x}px ${s},
                        ${t}px 0 0 ${x}px ${s},
                        /* Mid layer */
                        0 -${Math.floor(t*.8)}px 0 ${i}px ${e},
                        0 ${Math.floor(t*.8)}px 0 ${i}px ${e},
                        -${Math.floor(t*.8)}px 0 0 ${i}px ${o},
                        ${Math.floor(t*.8)}px 0 0 ${i}px ${o},
                        /* Inner bright layer */
                        0 -${c}px 0 ${i}px ${o},
                        0 ${c}px 0 ${i}px ${o},
                        -${c}px 0 0 ${i}px ${a},
                        ${c}px 0 0 ${i}px ${a},
                        /* Diagonal accents */
                        -${$}px -${$}px 0 ${d}px ${a},
                        ${$}px -${$}px 0 ${d}px ${a},
                        /* Highlight spots */
                        0 -${Math.floor(t*.5)}px 0 4px ${r},
                        -${Math.floor(t*.5)}px 0 0 3px ${p},
                        ${Math.floor(t*.4)}px -${Math.floor(t*.4)}px 0 2px ${r};
                "></div>
            `;break;case"tulip":f=`
                <div style="
                    position: absolute;
                    width: ${h}px;
                    height: ${h}px;
                    background: ${o};
                    box-shadow:
                        /* Main tulip shape - outer */
                        0 -${t}px 0 ${x}px ${o},
                        -${Math.floor(t*.9)}px -${$}px 0 ${x}px ${a},
                        ${Math.floor(t*.9)}px -${$}px 0 ${x}px ${e},
                        /* Middle layer */
                        0 -${Math.floor(t*.7)}px 0 ${i}px ${a},
                        -${Math.floor(t*.6)}px -${c}px 0 ${i}px ${p},
                        ${Math.floor(t*.6)}px -${c}px 0 ${i}px ${o},
                        /* Inner cup */
                        -${Math.floor(t*.3)}px 0 0 ${i}px ${a},
                        ${Math.floor(t*.3)}px 0 0 ${i}px ${e},
                        /* Dark base */
                        -${Math.floor(t*.4)}px ${Math.floor(t*.3)}px 0 ${d}px ${s},
                        ${Math.floor(t*.4)}px ${Math.floor(t*.3)}px 0 ${d}px ${s},
                        /* Highlights */
                        0 -${Math.floor(t*.85)}px 0 4px ${r},
                        -${Math.floor(t*.5)}px -${Math.floor(t*.6)}px 0 3px ${r},
                        -${Math.floor(t*.7)}px -${Math.floor(t*.3)}px 0 2px ${p};
                "></div>
            `;break;case"daisy":f=`
                <div style="
                    position: absolute;
                    width: ${h}px;
                    height: ${h}px;
                    background: ${o};
                    box-shadow:
                        /* 8 outer petals with edges */
                        0 -${t}px 0 ${x}px ${o},
                        0 ${t}px 0 ${x}px ${e},
                        -${t}px 0 0 ${x}px ${a},
                        ${t}px 0 0 ${x}px ${e},
                        -${$}px -${$}px 0 ${x}px ${o},
                        ${$}px -${$}px 0 ${x}px ${o},
                        -${$}px ${$}px 0 ${x}px ${e},
                        ${$}px ${$}px 0 ${x}px ${e},
                        /* Inner petal layer */
                        0 -${Math.floor(t*.7)}px 0 ${i}px ${a},
                        0 ${Math.floor(t*.7)}px 0 ${i}px ${o},
                        -${Math.floor(t*.7)}px 0 0 ${i}px ${p},
                        ${Math.floor(t*.7)}px 0 0 ${i}px ${o},
                        /* Inner diagonal accents */
                        -${c}px -${c}px 0 ${d}px ${p},
                        ${c}px -${c}px 0 ${d}px ${a},
                        /* Pixel highlights on petals */
                        0 -${Math.floor(t*.8)}px 0 4px ${r},
                        -${Math.floor(t*.8)}px 0 0 3px ${r},
                        -${Math.floor(t*.5)}px -${Math.floor(t*.5)}px 0 3px ${r},
                        ${Math.floor(t*.4)}px -${Math.floor(t*.7)}px 0 2px ${p};
                "></div>
            `;break;default:f=`
                <div style="
                    position: absolute;
                    width: ${h}px;
                    height: ${h}px;
                    background: ${o};
                    box-shadow:
                        /* Outer petals with dark edges */
                        0 -${t}px 0 ${x}px ${e},
                        0 ${t}px 0 ${x}px ${s},
                        -${t}px 0 0 ${x}px ${e},
                        ${t}px 0 0 ${x}px ${s},
                        /* Main petal colors */
                        0 -${Math.floor(t*.85)}px 0 ${i}px ${o},
                        0 ${Math.floor(t*.85)}px 0 ${i}px ${e},
                        -${Math.floor(t*.85)}px 0 0 ${i}px ${a},
                        ${Math.floor(t*.85)}px 0 0 ${i}px ${o},
                        /* Inner bright layer */
                        0 -${c}px 0 ${i}px ${a},
                        0 ${c}px 0 ${i}px ${o},
                        -${c}px 0 0 ${i}px ${p},
                        ${c}px 0 0 ${i}px ${a},
                        /* Highlight spots */
                        0 -${Math.floor(t*.6)}px 0 4px ${r},
                        -${Math.floor(t*.6)}px 0 0 4px ${r},
                        -${Math.floor(t*.3)}px -${Math.floor(t*.7)}px 0 2px ${p},
                        ${Math.floor(t*.2)}px -${Math.floor(t*.5)}px 0 2px ${r};
                "></div>
            `}return f}function u(l,o){const n=parseInt(l.replace("#",""),16),e=Math.round(2.55*o),s=Math.min(255,(n>>16)+e),a=Math.min(255,(n>>8&255)+e),p=Math.min(255,(n&255)+e);return`#${(1<<24|s<<16|a<<8|p).toString(16).slice(1)}`}function M(l,o){const n=parseInt(l.replace("#",""),16),e=Math.round(2.55*o),s=Math.max(0,(n>>16)-e),a=Math.max(0,(n>>8&255)-e),p=Math.max(0,(n&255)-e);return`#${(1<<24|s<<16|a<<8|p).toString(16).slice(1)}`}function F(){console.log("initButtonEffects called");const l=document.getElementById("beginBtn");if(!l){console.error("Begin button not found!");return}console.log("Begin button found",l),document.getElementById("languageModal");const o=document.querySelectorAll(".lang-btn");document.addEventListener("click",n=>{const e=n.target.closest("#beginBtn");if(e){console.log("Delegated click on beginBtn"),n.preventDefault(),e.style.transform="translateY(8px)";try{O(e)}catch(s){console.error("Error in createPixelBurst:",s)}setTimeout(()=>{e.style.transform="",console.log("Navigating to character.html"),window.location.href="character.html"},300)}}),o.forEach(n=>{n.addEventListener("click",()=>{const e=n.dataset.lang,s=n.dataset.country;localStorage.setItem("selectedLanguage",e),localStorage.setItem("selectedCountry",s),window.location.href="character.html"})})}function O(l){const o=l.getBoundingClientRect(),n=o.left+o.width/2,e=o.top+o.height/2;for(let s=0;s<8;s++){const a=document.createElement("div");a.style.cssText=`position: fixed; left: ${n}px; top: ${e}px; width: 8px; height: 8px; background: white; pointer-events: none; z-index: 1000;`,document.body.appendChild(a);const p=s/8*Math.PI*2,r=60,t=Math.round(Math.cos(p)*r/8)*8,x=Math.round(Math.sin(p)*r/8)*8;let i=0;const d=setInterval(()=>{i++;const h=i/10;a.style.transform=`translate(calc(-50% + ${t*h}px), calc(-50% + ${x*h+h*h*30}px))`,a.style.opacity=1-h,i>=10&&(clearInterval(d),a.remove())},40)}}
