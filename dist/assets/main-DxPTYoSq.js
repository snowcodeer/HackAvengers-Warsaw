import"./modulepreload-polyfill-B5Qt9EMX.js";document.addEventListener("DOMContentLoaded",()=>{S(),B(),k(),L(),I(),C(),D()});const y=[{petals:"#ff6b8a",center:"#ffeb3b"},{petals:"#ff8a65",center:"#fff176"},{petals:"#ba68c8",center:"#ffcc02"},{petals:"#64b5f6",center:"#fff59d"},{petals:"#ff7043",center:"#ffd54f"},{petals:"#ec407a",center:"#fff176"},{petals:"#7e57c2",center:"#ffeb3b"},{petals:"#f06292",center:"#fff9c4"},{petals:"#ea80fc",center:"#ffeb3b"},{petals:"#ff5252",center:"#ffeb3b"}],w=["round","star","diamond","tulip","daisy"];function k(){const s=document.getElementById("flowersContainer"),o=12;for(let n=0;n<o;n++){const e=document.createElement("div");e.className="pixel-bush";const p=3+n/o*92;e.style.left=`${p}%`;const a=40+Math.floor(Math.random()*50),r=a*(.6+Math.random()*.3),i=["#2d8a2d","#3da03d","#4db84d","#35a035"],t=i[Math.floor(Math.random()*i.length)],x=u(t,20),l=M(t,15),c=3+Math.floor(Math.random()*3);let h="";for(let d=0;d<c;d++){const $=a*(.5+Math.random()*.4),f=(d-c/2+.5)*(a*.35),g=Math.random()*10,m=d%2===0?t:l;h+=`
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
                        -${Math.floor($*.15)}px 0 0 0 ${l},
                        0 4px 0 0 ${x};
                "></div>
            `}e.innerHTML=h,e.style.width=`${a*1.5}px`,e.style.height=`${r+20}px`,e.style.animationDelay=`${.3+n*.08}s`,s.appendChild(e)}}function C(){const s=document.getElementById("snowContainer"),o=50;for(let n=0;n<o;n++)createSnowflake(s)}function L(){const s=document.getElementById("flowersContainer"),o=8;for(let n=0;n<o;n++){const e=document.createElement("div");e.className="pixel-rock";const p=5+Math.random()*88;e.style.left=`${p}%`;const a=24+Math.floor(Math.random()*40),r=a*(.5+Math.random()*.3),i=["#808080","#909090","#707070","#858585"],t=i[Math.floor(Math.random()*i.length)];e.innerHTML=`
            <div style="
                width: ${a}px;
                height: ${r}px;
                background: ${t};
                box-shadow:
                    ${Math.floor(a*.2)}px 0 0 0 ${u(t,20)},
                    -${Math.floor(a*.15)}px 0 0 0 ${M(t,15)},
                    0 4px 0 0 ${u(t,30)},
                    inset ${Math.floor(a*.2)}px ${Math.floor(r*.2)}px 0 0 ${M(t,20)};
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
        `,e.style.animationDelay=`${.5+n*.1}s`,s.appendChild(e)}}function I(){const s=document.getElementById("flowersContainer"),o=5;for(let n=0;n<o;n++){const e=document.createElement("div");e.className="pixel-bunny";const p=10+n/o*75;e.style.left=`${p}%`;const a=Math.random()>.5,r=["#f0e8e0","#e8e0d8","#d8d0c8","#f8f0e8","#e0d8d0"],i=r[Math.floor(Math.random()*r.length)],t=u(i,15),x=M(i,10);e.innerHTML=`
            <div class="bunny-body" style="
                width: 32px;
                height: 24px;
                background: ${i};
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
                    background: ${i};
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
                        background: ${i};
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
                        background: ${i};
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
                    background: ${i};
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
        `,s.appendChild(e),P(e,a)}}function P(s,o){let n=parseFloat(s.style.left),e=o;const p=s.querySelector(".bunny-body");function a(){p&&(p.style.transform=`scaleX(${e?-1:1})`)}function r(){const i=Math.random();if(i<.25)s.classList.remove("hopping"),s.classList.add("idle"),setTimeout(r,1500+Math.random()*2500);else if(i<.4)e=!e,a(),s.classList.remove("hopping"),s.classList.add("idle"),setTimeout(r,800+Math.random()*1e3);else{s.classList.remove("idle"),s.classList.add("hopping");const t=4+Math.random()*6;e?n=Math.max(5,n-t):n=Math.min(90,n+t),(n<=5||n>=90)&&setTimeout(()=>{e=!e,a()},500),s.style.left=`${n}%`,setTimeout(()=>{s.classList.remove("hopping"),setTimeout(r,400+Math.random()*1500)},500);return}}setTimeout(r,Math.random()*2e3)}function S(){const s=document.getElementById("flowersContainer"),o=[5,28,68,92];for(let n=0;n<o.length;n++)T(s,o[n],n)}function T(s,o,n){const e=document.createElement("div");e.className="pixel-tree",e.style.left=`${o}%`;const p=window.innerHeight*(1.2+Math.random()*.5),a=40+Math.floor(Math.random()*30),r=.1+n*.5,i=`
        <div class="tree-trunk" style="
            width: ${a}px;
            height: ${p*.5}px;
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
    `,t=8+Math.floor(Math.random()*5);let x="";const l=a*4;for(let c=0;c<t;c++){const h=l-c*(l/t)*.7,d=32+Math.floor(Math.random()*16),$=c%3===0?"#208020":c%3===1?"#30a030":"#48c048",f=c*28;x+=`
            <div class="tree-foliage-row" style="
                width: ${h}px;
                height: ${d}px;
                background: ${$};
                position: absolute;
                bottom: ${p*.4+f}px;
                left: 50%;
                transform: translateX(-50%);
                box-shadow: 
                    ${Math.floor(h*.15)}px 0 0 0 #1a6a1a,
                    -${Math.floor(h*.15)}px 0 0 0 #50d050,
                    0 4px 0 0 #1a5a1a;
            "></div>
        `,c%2===0&&(x+=`
                <div class="tree-snow-row" style="
                    width: ${h*.8}px;
                    height: 16px;
                    background: #f8f8f8;
                    position: absolute;
                    bottom: ${p*.4+f+d-8}px;
                    left: 50%;
                    transform: translateX(-50%);
                    box-shadow: 
                        -${Math.floor(h*.2)}px 4px 0 0 #f8f8f8,
                        ${Math.floor(h*.2)}px 4px 0 0 #f8f8f8,
                        0 4px 0 0 #d0d8e0;
                "></div>
            `)}e.innerHTML=`${i}${x}`,e.style.animationDelay=`${r}s`,s.appendChild(e)}function B(){const s=document.getElementById("flowersContainer"),o=8,n=Array.from({length:o},(a,r)=>r);H(n);const e=90/o,p=[];for(let a=0;a<o;a++){const r=5+a*e,i=Math.random()*(e*.6);p.push(r+i)}for(let a=0;a<o;a++){const r=n.indexOf(a);E(s,a,p[a],r)}}function H(s){for(let o=s.length-1;o>0;o--){const n=Math.floor(Math.random()*(o+1));[s[o],s[n]]=[s[n],s[o]]}return s}function E(s,o,n,e){const p=document.createElement("div");p.className="flower",p.style.left=`${n}%`;const r=(50+Math.random()*20)/100*window.innerHeight,i=y[Math.floor(Math.random()*y.length)],t=50+Math.floor(Math.random()*50),x=Math.floor(t*.4),l=w[Math.floor(Math.random()*w.length)],c=14+Math.floor(Math.random()*8),h=Math.random()>.5?1:-1,d=60+Math.random()*80,$=.2+e*.15,f=1+Math.random()*2,g=3+Math.random()*2,m=X(r,c,h,d),v=h*d,b=t+x*3;p.innerHTML=`
        <div class="flower-head-wrapper" style="
            width: ${b}px; 
            height: ${b}px;
            position: absolute;
            bottom: ${r-b/2}px;
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
                ${F(x,i.petals,l)}
                <div class="flower-center" style="
                    width: ${Math.floor(t*.28)}px;
                    height: ${Math.floor(t*.28)}px;
                    background: ${i.center};
                    position: absolute;
                    z-index: 5;
                    box-shadow: 
                        inset 3px 3px 0 0 ${M(i.center,30)},
                        inset -3px -3px 0 0 ${u(i.center,20)};
                "></div>
            </div>
        </div>
        <div class="flower-stem-container" style="
            height: ${r}px; 
            width: ${d*2+c+60}px;
            position: relative;
        ">
            ${m}
        </div>
    `,p.style.animationDelay=`${$}s`,p.style.setProperty("--grow-delay",`${$}s`),p.style.setProperty("--sway-amount",`${f}deg`),p.style.setProperty("--sway-duration",`${g}s`),s.appendChild(p),setTimeout(()=>{p.classList.add("sway")},($+2.2)*1e3)}function X(s,o,n,e){const p=Math.floor(s/20);let a="";const r=e+o/2+30;for(let i=0;i<p;i++){const t=i/p,x=(i+1)/p,l=Math.sin(t*Math.PI*.8)*e*n,c=Math.sin(x*Math.PI*.8)*e*n,h=20,d=i*h,$=r+l,f=Math.atan2(c-l,h)*(180/Math.PI);if(a+=`
            <div class="stem-segment" style="
                position: absolute;
                bottom: ${d}px;
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
        `,i%4===2&&i<p-2){const g=i%2===0?-1:1,m=20+Math.floor(Math.random()*12);a+=`
                <div class="pixel-leaf" style="
                    position: absolute;
                    bottom: ${d+6}px;
                    left: ${$+g*o*.8}px;
                    width: ${m}px;
                    height: ${Math.floor(m*.5)}px;
                    background: #48c048;
                    transform: translateX(${g>0?"0":"-100%"}) rotate(${g*25}deg);
                    box-shadow:
                        ${g*3}px 3px 0 0 #308030,
                        inset ${g*3}px 2px 0 0 #60d860;
                "></div>
            `}}return a}function F(s,o,n){const e=u(o,25),p=u(o,40),a=M(o,30),r=M(o,50),i=M(o,70),t=Math.floor(s*1.6),x=Math.floor(s*.45),l=Math.floor(s*.25),c=Math.floor(s*.15),h=Math.floor(s*1.4),d=Math.floor(t*.5),$=Math.floor(t*.75);let f="";switch(n){case"star":f=`
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
                        -${$}px -${$}px 0 ${l}px ${o},
                        ${$}px -${$}px 0 ${l}px ${o},
                        -${$}px ${$}px 0 ${l}px ${p},
                        ${$}px ${$}px 0 ${l}px ${p},
                        /* Main petal colors */
                        0 -${Math.floor(t*.85)}px 0 ${l}px ${o},
                        0 ${Math.floor(t*.85)}px 0 ${l}px ${o},
                        -${Math.floor(t*.85)}px 0 0 ${l}px ${a},
                        ${Math.floor(t*.85)}px 0 0 ${l}px ${o},
                        /* Inner highlights */
                        0 -${d}px 0 ${c}px ${a},
                        -${d}px 0 0 ${c}px ${r},
                        /* Pixel detail spots */
                        -${Math.floor(t*.3)}px -${Math.floor(t*.8)}px 0 3px ${i},
                        ${Math.floor(t*.3)}px -${Math.floor(t*.6)}px 0 2px ${r};
                "></div>
            `;break;case"diamond":f=`
                <div style="
                    position: absolute;
                    width: ${h}px;
                    height: ${h}px;
                    background: ${o};
                    box-shadow:
                        /* Outer dark edges */
                        0 -${t}px 0 ${x}px ${p},
                        0 ${t}px 0 ${x}px ${p},
                        -${t}px 0 0 ${x}px ${p},
                        ${t}px 0 0 ${x}px ${p},
                        /* Mid layer */
                        0 -${Math.floor(t*.8)}px 0 ${l}px ${e},
                        0 ${Math.floor(t*.8)}px 0 ${l}px ${e},
                        -${Math.floor(t*.8)}px 0 0 ${l}px ${o},
                        ${Math.floor(t*.8)}px 0 0 ${l}px ${o},
                        /* Inner bright layer */
                        0 -${d}px 0 ${l}px ${o},
                        0 ${d}px 0 ${l}px ${o},
                        -${d}px 0 0 ${l}px ${a},
                        ${d}px 0 0 ${l}px ${a},
                        /* Diagonal accents */
                        -${$}px -${$}px 0 ${c}px ${a},
                        ${$}px -${$}px 0 ${c}px ${a},
                        /* Highlight spots */
                        0 -${Math.floor(t*.5)}px 0 4px ${i},
                        -${Math.floor(t*.5)}px 0 0 3px ${r},
                        ${Math.floor(t*.4)}px -${Math.floor(t*.4)}px 0 2px ${i};
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
                        0 -${Math.floor(t*.7)}px 0 ${l}px ${a},
                        -${Math.floor(t*.6)}px -${d}px 0 ${l}px ${r},
                        ${Math.floor(t*.6)}px -${d}px 0 ${l}px ${o},
                        /* Inner cup */
                        -${Math.floor(t*.3)}px 0 0 ${l}px ${a},
                        ${Math.floor(t*.3)}px 0 0 ${l}px ${e},
                        /* Dark base */
                        -${Math.floor(t*.4)}px ${Math.floor(t*.3)}px 0 ${c}px ${p},
                        ${Math.floor(t*.4)}px ${Math.floor(t*.3)}px 0 ${c}px ${p},
                        /* Highlights */
                        0 -${Math.floor(t*.85)}px 0 4px ${i},
                        -${Math.floor(t*.5)}px -${Math.floor(t*.6)}px 0 3px ${i},
                        -${Math.floor(t*.7)}px -${Math.floor(t*.3)}px 0 2px ${r};
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
                        0 -${Math.floor(t*.7)}px 0 ${l}px ${a},
                        0 ${Math.floor(t*.7)}px 0 ${l}px ${o},
                        -${Math.floor(t*.7)}px 0 0 ${l}px ${r},
                        ${Math.floor(t*.7)}px 0 0 ${l}px ${o},
                        /* Inner diagonal accents */
                        -${d}px -${d}px 0 ${c}px ${r},
                        ${d}px -${d}px 0 ${c}px ${a},
                        /* Pixel highlights on petals */
                        0 -${Math.floor(t*.8)}px 0 4px ${i},
                        -${Math.floor(t*.8)}px 0 0 3px ${i},
                        -${Math.floor(t*.5)}px -${Math.floor(t*.5)}px 0 3px ${i},
                        ${Math.floor(t*.4)}px -${Math.floor(t*.7)}px 0 2px ${r};
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
                        0 ${t}px 0 ${x}px ${p},
                        -${t}px 0 0 ${x}px ${e},
                        ${t}px 0 0 ${x}px ${p},
                        /* Main petal colors */
                        0 -${Math.floor(t*.85)}px 0 ${l}px ${o},
                        0 ${Math.floor(t*.85)}px 0 ${l}px ${e},
                        -${Math.floor(t*.85)}px 0 0 ${l}px ${a},
                        ${Math.floor(t*.85)}px 0 0 ${l}px ${o},
                        /* Inner bright layer */
                        0 -${d}px 0 ${l}px ${a},
                        0 ${d}px 0 ${l}px ${o},
                        -${d}px 0 0 ${l}px ${r},
                        ${d}px 0 0 ${l}px ${a},
                        /* Highlight spots */
                        0 -${Math.floor(t*.6)}px 0 4px ${i},
                        -${Math.floor(t*.6)}px 0 0 4px ${i},
                        -${Math.floor(t*.3)}px -${Math.floor(t*.7)}px 0 2px ${r},
                        ${Math.floor(t*.2)}px -${Math.floor(t*.5)}px 0 2px ${i};
                "></div>
            `}return f}function M(s,o){const n=parseInt(s.replace("#",""),16),e=Math.round(2.55*o),p=Math.min(255,(n>>16)+e),a=Math.min(255,(n>>8&255)+e),r=Math.min(255,(n&255)+e);return`#${(1<<24|p<<16|a<<8|r).toString(16).slice(1)}`}function u(s,o){const n=parseInt(s.replace("#",""),16),e=Math.round(2.55*o),p=Math.max(0,(n>>16)-e),a=Math.max(0,(n>>8&255)-e),r=Math.max(0,(n&255)-e);return`#${(1<<24|p<<16|a<<8|r).toString(16).slice(1)}`}function D(){const s=document.getElementById("beginBtn"),o=document.getElementById("languageModal"),n=document.querySelectorAll(".lang-btn");s.addEventListener("click",()=>{s.style.transform="translateY(8px)",O(s),setTimeout(()=>{s.style.transform="",o.classList.add("active")},300)}),n.forEach(e=>{e.addEventListener("click",()=>{const p=e.dataset.lang,a=e.dataset.country;localStorage.setItem("selectedLanguage",p),localStorage.setItem("selectedCountry",a),window.location.href="character.html"})})}function O(s){const o=s.getBoundingClientRect(),n=o.left+o.width/2,e=o.top+o.height/2;for(let p=0;p<8;p++){const a=document.createElement("div");a.style.cssText=`position: fixed; left: ${n}px; top: ${e}px; width: 8px; height: 8px; background: white; pointer-events: none; z-index: 1000;`,document.body.appendChild(a);const r=p/8*Math.PI*2,i=60,t=Math.round(Math.cos(r)*i/8)*8,x=Math.round(Math.sin(r)*i/8)*8;let l=0;const c=setInterval(()=>{l++;const h=l/10;a.style.transform=`translate(calc(-50% + ${t*h}px), calc(-50% + ${x*h+h*h*30}px))`,a.style.opacity=1-h,l>=10&&(clearInterval(c),a.remove())},40)}}
