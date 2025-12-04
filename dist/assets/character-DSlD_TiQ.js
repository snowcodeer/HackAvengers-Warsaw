import"./modulepreload-polyfill-B5Qt9EMX.js";document.addEventListener("DOMContentLoaded",()=>{I(),E(),L(),B()});const t={name:"",bodyType:0,skinColor:"#ffd5b5",hairStyle:0,hairColor:"#2c1810",eyeColor:"#4a90d9",outfit:0,outfitColor:"#e74c3c",pantsColor:"#3a3a5a",accessory:0,hat:0,facialHair:0},w=["Normal","Athletic","Slim","Stocky"],$=["Spiky","Mohawk","Flat Top","Long","Short","Ponytail","Bald","Curly","Afro","Pigtails","Buzz Cut","Side Part","Wavy","Slick Back"],C=["Adventurer","T-Shirt","Striped","Hoodie","Suit","Overalls","Tank Top","Uniform","Sweater","Jacket","Polo","V-Neck","Vest","Lab Coat"],X=["None","Glasses","Sunglasses","Round Glasses","Eye Patch","Monocle","Bandana","Scarf","Necklace","Bow Tie","Tie"],S=["None","Cap","Beanie","Top Hat","Cowboy","Hard Hat","Crown","Headphones","Police Cap","Beret","Bandana","Wizard Hat","Viking Helmet"],H=["None","Stubble","Beard","Goatee","Mustache","Full Beard","Handlebar"];function E(){document.getElementById("characterName").addEventListener("input",e=>{t.name=e.target.value}),document.querySelectorAll(".nav-btn").forEach(e=>{e.addEventListener("click",()=>{const a=e.dataset.target,o=e.classList.contains("next");switch(a){case"bodyType":t.bodyType=v(t.bodyType,w.length,o),document.getElementById("bodyTypeValue").textContent=w[t.bodyType];break;case"hairStyle":t.hairStyle=v(t.hairStyle,$.length,o),document.getElementById("hairStyleValue").textContent=$[t.hairStyle];break;case"outfit":t.outfit=v(t.outfit,C.length,o),document.getElementById("outfitValue").textContent=C[t.outfit];break;case"accessory":t.accessory=v(t.accessory,X.length,o),document.getElementById("accessoryValue").textContent=X[t.accessory];break;case"hat":t.hat=v(t.hat,S.length,o),document.getElementById("hatValue").textContent=S[t.hat];break;case"facialHair":t.facialHair=v(t.facialHair,H.length,o),document.getElementById("facialHairValue").textContent=H[t.facialHair];break}B()})}),m("skinColors","skinColor"),m("hairColors","hairColor"),m("eyeColors","eyeColor"),m("outfitColors","outfitColor"),m("pantsColors","pantsColor")}function v(e,a,o){return o?(e+1)%a:(e-1+a)%a}function m(e,a){const o=document.getElementById(e);o.querySelectorAll(".color-btn").forEach(d=>{d.addEventListener("click",()=>{o.querySelectorAll(".color-btn").forEach(b=>b.classList.remove("active")),d.classList.add("active"),t[a]=d.dataset.color,B()})})}function B(){const e=document.getElementById("characterPreview"),a=$[t.hairStyle],o=w[t.bodyType],d=C[t.outfit],b=X[t.accessory],u=S[t.hat],f=H[t.facialHair];let l="";switch(a){case"Spiky":l=`
                <div style="position: absolute; bottom: 125px; left: 50%; transform: translateX(-50%); width: 52px; height: 20px; background: ${t.hairColor}; box-shadow: -8px -8px 0 0 ${t.hairColor}, 8px -8px 0 0 ${t.hairColor}, 0 -16px 0 0 ${t.hairColor}, -16px 0 0 0 ${t.hairColor}, 16px 0 0 0 ${t.hairColor};"></div>
            `;break;case"Mohawk":l=`
                <div style="position: absolute; bottom: 125px; left: 50%; transform: translateX(-50%); width: 12px; height: 32px; background: ${t.hairColor};"></div>
                <div style="position: absolute; bottom: 145px; left: 50%; transform: translateX(-50%); width: 8px; height: 20px; background: ${t.hairColor};"></div>
            `;break;case"Flat Top":l=`
                <div style="position: absolute; bottom: 125px; left: 50%; transform: translateX(-50%); width: 50px; height: 16px; background: ${t.hairColor};"></div>
            `;break;case"Long":l=`
                <div style="position: absolute; bottom: 90px; left: 50%; transform: translateX(-50%); width: 56px; height: 60px; background: ${t.hairColor}; border-radius: 8px 8px 0 0;"></div>
            `;break;case"Short":l=`
                <div style="position: absolute; bottom: 125px; left: 50%; transform: translateX(-50%); width: 48px; height: 16px; background: ${t.hairColor}; border-radius: 8px 8px 0 0;"></div>
            `;break;case"Ponytail":l=`
                <div style="position: absolute; bottom: 125px; left: 50%; transform: translateX(-50%); width: 48px; height: 16px; background: ${t.hairColor}; border-radius: 8px 8px 0 0;"></div>
                <div style="position: absolute; bottom: 80px; right: 20px; width: 12px; height: 45px; background: ${t.hairColor}; border-radius: 0 0 6px 6px;"></div>
            `;break;case"Bald":l="";break;case"Curly":l=`
                <div style="position: absolute; bottom: 122px; left: 50%; transform: translateX(-50%); width: 54px; height: 24px; background: ${t.hairColor}; border-radius: 50%; box-shadow: -6px 0 0 0 ${t.hairColor}, 6px 0 0 0 ${t.hairColor}, 0 -6px 0 0 ${t.hairColor};"></div>
            `;break;case"Afro":l=`
                <div style="position: absolute; bottom: 100px; left: 50%; transform: translateX(-50%); width: 60px; height: 50px; background: ${t.hairColor}; border-radius: 50%;"></div>
            `;break;case"Pigtails":l=`
                <div style="position: absolute; bottom: 125px; left: 50%; transform: translateX(-50%); width: 48px; height: 14px; background: ${t.hairColor};"></div>
                <div style="position: absolute; bottom: 100px; left: 20px; width: 14px; height: 30px; background: ${t.hairColor}; border-radius: 0 0 7px 7px;"></div>
                <div style="position: absolute; bottom: 100px; right: 20px; width: 14px; height: 30px; background: ${t.hairColor}; border-radius: 0 0 7px 7px;"></div>
            `;break;case"Buzz Cut":l=`
                <div style="position: absolute; bottom: 125px; left: 50%; transform: translateX(-50%); width: 46px; height: 10px; background: ${t.hairColor};"></div>
            `;break;case"Side Part":l=`
                <div style="position: absolute; bottom: 125px; left: calc(50% - 5px); transform: translateX(-50%); width: 52px; height: 18px; background: ${t.hairColor}; border-radius: 8px 0 0 0;"></div>
            `;break;case"Wavy":l=`
                <div style="position: absolute; bottom: 120px; left: 50%; transform: translateX(-50%); width: 50px; height: 28px; background: ${t.hairColor}; border-radius: 12px 12px 0 0;"></div>
                <div style="position: absolute; bottom: 100px; left: 24px; width: 12px; height: 35px; background: ${t.hairColor}; border-radius: 0 0 8px 8px;"></div>
                <div style="position: absolute; bottom: 100px; right: 24px; width: 12px; height: 35px; background: ${t.hairColor}; border-radius: 0 0 8px 8px;"></div>
            `;break;case"Slick Back":l=`
                <div style="position: absolute; bottom: 118px; left: 50%; transform: translateX(-50%); width: 48px; height: 24px; background: ${t.hairColor}; border-radius: 50% 50% 0 0;"></div>
            `;break}let x="";switch(b){case"Glasses":x=`
                <div style="position: absolute; bottom: 105px; left: calc(50% - 20px); width: 40px; height: 12px; border: 3px solid #333; background: transparent; border-radius: 2px;"></div>
            `;break;case"Sunglasses":x=`
                <div style="position: absolute; bottom: 104px; left: calc(50% - 18px); width: 14px; height: 10px; background: #111; border-radius: 2px;"></div>
                <div style="position: absolute; bottom: 104px; left: calc(50% + 4px); width: 14px; height: 10px; background: #111; border-radius: 2px;"></div>
                <div style="position: absolute; bottom: 108px; left: calc(50% - 4px); width: 8px; height: 3px; background: #333;"></div>
            `;break;case"Round Glasses":x=`
                <div style="position: absolute; bottom: 103px; left: calc(50% - 18px); width: 14px; height: 14px; border: 3px solid #daa520; border-radius: 50%; background: transparent;"></div>
                <div style="position: absolute; bottom: 103px; left: calc(50% + 4px); width: 14px; height: 14px; border: 3px solid #daa520; border-radius: 50%; background: transparent;"></div>
            `;break;case"Eye Patch":x=`
                <div style="position: absolute; bottom: 103px; left: calc(50% - 18px); width: 16px; height: 14px; background: #222;"></div>
                <div style="position: absolute; bottom: 110px; left: calc(50% - 22px); width: 60px; height: 3px; background: #333; transform: rotate(-10deg);"></div>
            `;break;case"Monocle":x=`
                <div style="position: absolute; bottom: 102px; left: calc(50% + 2px); width: 16px; height: 16px; border: 3px solid #daa520; border-radius: 50%; background: transparent;"></div>
                <div style="position: absolute; bottom: 88px; left: calc(50% + 14px); width: 2px; height: 20px; background: #daa520;"></div>
            `;break;case"Bandana":x=`
                <div style="position: absolute; bottom: 118px; left: 50%; transform: translateX(-50%); width: 50px; height: 10px; background: #c0392b;"></div>
                <div style="position: absolute; bottom: 108px; right: 22px; width: 8px; height: 16px; background: #c0392b; transform: rotate(20deg);"></div>
            `;break;case"Scarf":x=`
                <div style="position: absolute; bottom: 78px; left: 50%; transform: translateX(-50%); width: 52px; height: 12px; background: #e74c3c; box-shadow: 0 4px 0 0 #c0392b;"></div>
                <div style="position: absolute; bottom: 55px; left: calc(50% + 10px); width: 10px; height: 28px; background: #e74c3c; border-radius: 0 0 4px 4px;"></div>
            `;break;case"Necklace":x=`
                <div style="position: absolute; bottom: 75px; left: 50%; transform: translateX(-50%); width: 30px; height: 6px; background: #f1c40f; border-radius: 0 0 15px 15px;"></div>
                <div style="position: absolute; bottom: 70px; left: 50%; transform: translateX(-50%); width: 8px; height: 8px; background: #e74c3c; border-radius: 50%;"></div>
            `;break;case"Bow Tie":x=`
                <div style="position: absolute; bottom: 80px; left: 50%; transform: translateX(-50%); width: 24px; height: 10px; background: #c0392b;"></div>
                <div style="position: absolute; bottom: 82px; left: 50%; transform: translateX(-50%); width: 6px; height: 6px; background: #a02320;"></div>
            `;break;case"Tie":x=`
                <div style="position: absolute; bottom: 78px; left: 50%; transform: translateX(-50%); width: 8px; height: 6px; background: #c0392b;"></div>
                <div style="position: absolute; bottom: 45px; left: 50%; transform: translateX(-50%); width: 10px; height: 35px; background: #c0392b; clip-path: polygon(50% 100%, 0% 0%, 100% 0%);"></div>
            `;break}let n="";switch(u){case"Cap":n=`
                <div style="position: absolute; bottom: 128px; left: 50%; transform: translateX(-50%); width: 50px; height: 18px; background: #2c3e50; border-radius: 20px 20px 0 0;"></div>
                <div style="position: absolute; bottom: 126px; left: calc(50% - 5px); width: 36px; height: 8px; background: #2c3e50;"></div>
            `;break;case"Beanie":n=`
                <div style="position: absolute; bottom: 124px; left: 50%; transform: translateX(-50%); width: 52px; height: 28px; background: #8e44ad; border-radius: 10px 10px 0 0;"></div>
                <div style="position: absolute; bottom: 148px; left: 50%; transform: translateX(-50%); width: 12px; height: 12px; background: #8e44ad; border-radius: 50%;"></div>
            `;break;case"Top Hat":n=`
                <div style="position: absolute; bottom: 125px; left: 50%; transform: translateX(-50%); width: 56px; height: 10px; background: #1a1a1a;"></div>
                <div style="position: absolute; bottom: 133px; left: 50%; transform: translateX(-50%); width: 40px; height: 35px; background: #1a1a1a;"></div>
                <div style="position: absolute; bottom: 135px; left: 50%; transform: translateX(-50%); width: 42px; height: 6px; background: #c0392b;"></div>
            `;break;case"Cowboy":n=`
                <div style="position: absolute; bottom: 124px; left: 50%; transform: translateX(-50%); width: 64px; height: 12px; background: #8b6914; border-radius: 50%;"></div>
                <div style="position: absolute; bottom: 132px; left: 50%; transform: translateX(-50%); width: 44px; height: 24px; background: #8b6914; border-radius: 50% 50% 0 0;"></div>
            `;break;case"Hard Hat":n=`
                <div style="position: absolute; bottom: 124px; left: 50%; transform: translateX(-50%); width: 54px; height: 26px; background: #f39c12; border-radius: 50% 50% 0 0;"></div>
                <div style="position: absolute; bottom: 124px; left: 50%; transform: translateX(-50%); width: 58px; height: 8px; background: #e67e22;"></div>
            `;break;case"Crown":n=`
                <div style="position: absolute; bottom: 125px; left: 50%; transform: translateX(-50%); width: 50px; height: 12px; background: #f1c40f;"></div>
                <div style="position: absolute; bottom: 135px; left: calc(50% - 20px); width: 10px; height: 18px; background: #f1c40f;"></div>
                <div style="position: absolute; bottom: 135px; left: 50%; transform: translateX(-50%); width: 10px; height: 22px; background: #f1c40f;"></div>
                <div style="position: absolute; bottom: 135px; left: calc(50% + 10px); width: 10px; height: 18px; background: #f1c40f;"></div>
                <div style="position: absolute; bottom: 150px; left: 50%; transform: translateX(-50%); width: 6px; height: 6px; background: #e74c3c; border-radius: 50%;"></div>
            `;break;case"Headphones":n=`
                <div style="position: absolute; bottom: 130px; left: 50%; transform: translateX(-50%); width: 54px; height: 8px; background: #333; border-radius: 20px 20px 0 0;"></div>
                <div style="position: absolute; bottom: 100px; left: 22px; width: 14px; height: 20px; background: #333; border-radius: 4px;"></div>
                <div style="position: absolute; bottom: 100px; right: 22px; width: 14px; height: 20px; background: #333; border-radius: 4px;"></div>
            `;break;case"Police Cap":n=`
                <div style="position: absolute; bottom: 124px; left: 50%; transform: translateX(-50%); width: 52px; height: 20px; background: #2c3e50;"></div>
                <div style="position: absolute; bottom: 124px; left: calc(50% - 5px); width: 35px; height: 10px; background: #2c3e50;"></div>
                <div style="position: absolute; bottom: 130px; left: 50%; transform: translateX(-50%); width: 14px; height: 10px; background: #f1c40f;"></div>
            `;break;case"Beret":n=`
                <div style="position: absolute; bottom: 124px; left: calc(50% - 5px); width: 52px; height: 20px; background: #c0392b; border-radius: 50% 50% 0 50%;"></div>
                <div style="position: absolute; bottom: 138px; left: calc(50% + 10px); width: 8px; height: 8px; background: #c0392b; border-radius: 50%;"></div>
            `;break;case"Bandana":n=`
                <div style="position: absolute; bottom: 122px; left: 50%; transform: translateX(-50%); width: 52px; height: 14px; background: #e74c3c;"></div>
                <div style="position: absolute; bottom: 108px; right: 20px; width: 10px; height: 20px; background: #e74c3c; transform: rotate(15deg);"></div>
            `;break;case"Wizard Hat":n=`
                <div style="position: absolute; bottom: 124px; left: 50%; transform: translateX(-50%); width: 56px; height: 10px; background: #4a148c;"></div>
                <div style="position: absolute; bottom: 132px; left: 50%; transform: translateX(-50%); width: 40px; height: 45px; background: #4a148c; clip-path: polygon(50% 0%, 0% 100%, 100% 100%);"></div>
                <div style="position: absolute; bottom: 160px; left: 50%; transform: translateX(-50%); width: 8px; height: 8px; background: #f1c40f; border-radius: 50%;"></div>
            `;break;case"Viking Helmet":n=`
                <div style="position: absolute; bottom: 120px; left: 50%; transform: translateX(-50%); width: 54px; height: 28px; background: #95a5a6; border-radius: 50% 50% 0 0;"></div>
                <div style="position: absolute; bottom: 140px; left: 16px; width: 8px; height: 25px; background: #f5f5dc; border-radius: 50% 50% 0 0; transform: rotate(-20deg);"></div>
                <div style="position: absolute; bottom: 140px; right: 16px; width: 8px; height: 25px; background: #f5f5dc; border-radius: 50% 50% 0 0; transform: rotate(20deg);"></div>
            `;break}let i=48,r=56;switch(o){case"Athletic":i=52,r=58;break;case"Slim":i=40,r=60;break;case"Stocky":i=56,r=50;break}let p="";const s=c(t.outfitColor,20),M=k(t.outfitColor,15);switch(d){case"Striped":p=`
                <div style="position: absolute; bottom: 28px; left: 50%; transform: translateX(-50%); width: ${i}px; height: ${r}px; background: repeating-linear-gradient(0deg, ${t.outfitColor} 0px, ${t.outfitColor} 8px, #fff 8px, #fff 16px); box-shadow: 4px 0 0 0 ${s};"></div>
            `;break;case"Hoodie":p=`
                <div style="position: absolute; bottom: 28px; left: 50%; transform: translateX(-50%); width: ${i}px; height: ${r}px; background: ${t.outfitColor}; box-shadow: 4px 0 0 0 ${s};"></div>
                <div style="position: absolute; bottom: 78px; left: 50%; transform: translateX(-50%); width: 20px; height: 10px; background: ${s}; border-radius: 0 0 10px 10px;"></div>
                <div style="position: absolute; bottom: 45px; left: 50%; transform: translateX(-50%); width: 20px; height: 20px; background: ${s};"></div>
            `;break;case"Suit":p=`
                <div style="position: absolute; bottom: 28px; left: 50%; transform: translateX(-50%); width: ${i}px; height: ${r}px; background: #2c3e50; box-shadow: 4px 0 0 0 #1a252f;"></div>
                <div style="position: absolute; bottom: 60px; left: 50%; transform: translateX(-50%); width: 8px; height: 24px; background: #fff;"></div>
                <div style="position: absolute; bottom: 72px; left: 50%; transform: translateX(-50%); width: 10px; height: 12px; background: #c0392b;"></div>
            `;break;case"Overalls":p=`
                <div style="position: absolute; bottom: 28px; left: 50%; transform: translateX(-50%); width: ${i}px; height: ${r}px; background: #3498db; box-shadow: 4px 0 0 0 #2980b9;"></div>
                <div style="position: absolute; bottom: 70px; left: calc(50% - 14px); width: 8px; height: 20px; background: #3498db;"></div>
                <div style="position: absolute; bottom: 70px; left: calc(50% + 6px); width: 8px; height: 20px; background: #3498db;"></div>
                <div style="position: absolute; bottom: 50px; left: 50%; transform: translateX(-50%); width: 16px; height: 16px; background: #2980b9;"></div>
            `;break;case"Tank Top":p=`
                <div style="position: absolute; bottom: 28px; left: 50%; transform: translateX(-50%); width: ${i-8}px; height: ${r}px; background: ${t.outfitColor}; box-shadow: 4px 0 0 0 ${s};"></div>
            `;break;case"Uniform":p=`
                <div style="position: absolute; bottom: 28px; left: 50%; transform: translateX(-50%); width: ${i}px; height: ${r}px; background: #2c3e50; box-shadow: 4px 0 0 0 #1a252f;"></div>
                <div style="position: absolute; bottom: 70px; left: calc(50% - 12px); width: 6px; height: 6px; background: #f1c40f; border-radius: 50%;"></div>
                <div style="position: absolute; bottom: 60px; left: calc(50% - 12px); width: 6px; height: 6px; background: #f1c40f; border-radius: 50%;"></div>
                <div style="position: absolute; bottom: 70px; left: calc(50% + 6px); width: 6px; height: 6px; background: #f1c40f; border-radius: 50%;"></div>
                <div style="position: absolute; bottom: 60px; left: calc(50% + 6px); width: 6px; height: 6px; background: #f1c40f; border-radius: 50%;"></div>
                <div style="position: absolute; bottom: 74px; left: calc(50% - 6px); width: 12px; height: 8px; background: #34495e;"></div>
            `;break;case"Sweater":p=`
                <div style="position: absolute; bottom: 28px; left: 50%; transform: translateX(-50%); width: ${i}px; height: ${r}px; background: ${t.outfitColor}; box-shadow: 4px 0 0 0 ${s};"></div>
                <div style="position: absolute; bottom: 28px; left: 50%; transform: translateX(-50%); width: ${i}px; height: 12px; background: repeating-linear-gradient(90deg, ${s} 0px, ${s} 4px, ${t.outfitColor} 4px, ${t.outfitColor} 8px);"></div>
                <div style="position: absolute; bottom: 70px; left: 50%; transform: translateX(-50%); width: ${i}px; height: 8px; background: repeating-linear-gradient(90deg, ${s} 0px, ${s} 4px, ${t.outfitColor} 4px, ${t.outfitColor} 8px);"></div>
            `;break;case"Jacket":p=`
                <div style="position: absolute; bottom: 28px; left: 50%; transform: translateX(-50%); width: ${i}px; height: ${r}px; background: ${t.outfitColor}; box-shadow: 4px 0 0 0 ${s};"></div>
                <div style="position: absolute; bottom: 28px; left: 50%; transform: translateX(-50%); width: 4px; height: ${r-10}px; background: #f1c40f;"></div>
                <div style="position: absolute; bottom: 70px; left: calc(50% - 16px); width: 12px; height: 12px; background: ${s};"></div>
                <div style="position: absolute; bottom: 70px; left: calc(50% + 4px); width: 12px; height: 12px; background: ${s};"></div>
            `;break;case"Polo":p=`
                <div style="position: absolute; bottom: 28px; left: 50%; transform: translateX(-50%); width: ${i}px; height: ${r}px; background: ${t.outfitColor}; box-shadow: 4px 0 0 0 ${s};"></div>
                <div style="position: absolute; bottom: 75px; left: 50%; transform: translateX(-50%); width: 12px; height: 10px; background: ${s};"></div>
                <div style="position: absolute; bottom: 68px; left: calc(50% - 3px); width: 6px; height: 6px; background: #fff; border-radius: 50%;"></div>
                <div style="position: absolute; bottom: 60px; left: calc(50% - 3px); width: 6px; height: 6px; background: #fff; border-radius: 50%;"></div>
            `;break;case"V-Neck":p=`
                <div style="position: absolute; bottom: 28px; left: 50%; transform: translateX(-50%); width: ${i}px; height: ${r}px; background: ${t.outfitColor}; box-shadow: 4px 0 0 0 ${s};"></div>
                <div style="position: absolute; bottom: 70px; left: 50%; transform: translateX(-50%); width: 16px; height: 16px; background: ${t.skinColor}; clip-path: polygon(50% 100%, 0% 0%, 100% 0%);"></div>
            `;break;case"Vest":p=`
                <div style="position: absolute; bottom: 28px; left: 50%; transform: translateX(-50%); width: ${i}px; height: ${r}px; background: #fff; box-shadow: 4px 0 0 0 #ddd;"></div>
                <div style="position: absolute; bottom: 28px; left: calc(50% - 22px); width: 16px; height: ${r}px; background: ${t.outfitColor};"></div>
                <div style="position: absolute; bottom: 28px; left: calc(50% + 6px); width: 16px; height: ${r}px; background: ${t.outfitColor};"></div>
            `;break;case"Lab Coat":p=`
                <div style="position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); width: ${i+8}px; height: ${r+15}px; background: #ffffff; box-shadow: 4px 0 0 0 #ddd;"></div>
                <div style="position: absolute; bottom: 55px; left: calc(50% - 18px); width: 10px; height: 10px; background: ${t.outfitColor}; border-radius: 50%;"></div>
                <div style="position: absolute; bottom: 40px; left: calc(50% - 18px); width: 10px; height: 10px; background: ${t.outfitColor}; border-radius: 50%;"></div>
            `;break;default:p=`
                <div style="position: absolute; bottom: 28px; left: 50%; transform: translateX(-50%); width: ${i}px; height: ${r}px; background: ${t.outfitColor}; box-shadow: 4px 0 0 0 ${s}, -4px 0 0 0 ${M};"></div>
            `}let g="";const h=c(t.hairColor,10);switch(f){case"Stubble":g=`
                <div style="position: absolute; bottom: 88px; left: calc(50% - 16px); width: 32px; height: 8px; background: ${h}; opacity: 0.4;"></div>
            `;break;case"Beard":g=`
                <div style="position: absolute; bottom: 82px; left: calc(50% - 14px); width: 28px; height: 14px; background: ${h}; border-radius: 0 0 6px 6px;"></div>
            `;break;case"Goatee":g=`
                <div style="position: absolute; bottom: 82px; left: calc(50% - 6px); width: 12px; height: 14px; background: ${h}; border-radius: 0 0 4px 4px;"></div>
            `;break;case"Mustache":g=`
                <div style="position: absolute; bottom: 92px; left: calc(50% - 12px); width: 24px; height: 6px; background: ${h};"></div>
            `;break;case"Full Beard":g=`
                <div style="position: absolute; bottom: 75px; left: calc(50% - 18px); width: 36px; height: 22px; background: ${h}; border-radius: 0 0 10px 10px;"></div>
                <div style="position: absolute; bottom: 92px; left: calc(50% - 12px); width: 24px; height: 6px; background: ${h};"></div>
            `;break;case"Handlebar":g=`
                <div style="position: absolute; bottom: 92px; left: calc(50% - 16px); width: 32px; height: 6px; background: ${h};"></div>
                <div style="position: absolute; bottom: 88px; left: calc(50% - 20px); width: 6px; height: 10px; background: ${h}; border-radius: 0 0 0 4px;"></div>
                <div style="position: absolute; bottom: 88px; left: calc(50% + 14px); width: 6px; height: 10px; background: ${h}; border-radius: 0 0 4px 0;"></div>
            `;break}const y=t.pantsColor,T=c(y,15);e.innerHTML=`
        <!-- Legs -->
        <div style="position: absolute; bottom: 0; left: calc(50% - 16px); width: 14px; height: 30px; background: ${y}; box-shadow: 4px 0 0 0 ${T};"></div>
        <div style="position: absolute; bottom: 0; left: calc(50% + 2px); width: 14px; height: 30px; background: ${y}; box-shadow: 4px 0 0 0 ${T};"></div>
        
        <!-- Shoes -->
        <div style="position: absolute; bottom: 0; left: calc(50% - 20px); width: 18px; height: 10px; background: #4a3020; box-shadow: 2px 0 0 0 #3a2010;"></div>
        <div style="position: absolute; bottom: 0; left: calc(50% + 2px); width: 18px; height: 10px; background: #4a3020; box-shadow: 2px 0 0 0 #3a2010;"></div>
        
        <!-- Body/Outfit -->
        ${p}
        
        <!-- Arms -->
        <div style="position: absolute; bottom: 50px; left: calc(50% - ${i/2+12}px); width: 12px; height: 40px; background: ${t.skinColor}; box-shadow: 2px 0 0 0 ${c(t.skinColor,15)};"></div>
        <div style="position: absolute; bottom: 50px; left: calc(50% + ${i/2}px); width: 12px; height: 40px; background: ${t.skinColor}; box-shadow: 2px 0 0 0 ${c(t.skinColor,15)};"></div>
        
        <!-- Hands -->
        <div style="position: absolute; bottom: 45px; left: calc(50% - ${i/2+14}px); width: 14px; height: 14px; background: ${t.skinColor}; border-radius: 4px;"></div>
        <div style="position: absolute; bottom: 45px; left: calc(50% + ${i/2}px); width: 14px; height: 14px; background: ${t.skinColor}; border-radius: 4px;"></div>
        
        <!-- Head -->
        <div style="position: absolute; bottom: 85px; left: 50%; transform: translateX(-50%); width: 44px; height: 44px; background: ${t.skinColor}; border-radius: 8px; box-shadow: 4px 0 0 0 ${c(t.skinColor,15)}, -4px 0 0 0 ${k(t.skinColor,10)};"></div>
        
        <!-- Hair (behind head if long) -->
        ${a==="Long"||a==="Afro"?l:""}
        
        <!-- Eyes -->
        <div style="position: absolute; bottom: 105px; left: calc(50% - 12px); width: 8px; height: 10px; background: ${t.eyeColor}; box-shadow: inset 2px 2px 0 0 ${k(t.eyeColor,30)};"></div>
        <div style="position: absolute; bottom: 105px; left: calc(50% + 4px); width: 8px; height: 10px; background: ${t.eyeColor}; box-shadow: inset 2px 2px 0 0 ${k(t.eyeColor,30)};"></div>
        
        <!-- Eye highlights -->
        <div style="position: absolute; bottom: 111px; left: calc(50% - 10px); width: 3px; height: 3px; background: white;"></div>
        <div style="position: absolute; bottom: 111px; left: calc(50% + 6px); width: 3px; height: 3px; background: white;"></div>
        
        <!-- Eyebrows -->
        <div style="position: absolute; bottom: 116px; left: calc(50% - 14px); width: 10px; height: 3px; background: ${c(t.hairColor,10)};"></div>
        <div style="position: absolute; bottom: 116px; left: calc(50% + 4px); width: 10px; height: 3px; background: ${c(t.hairColor,10)};"></div>
        
        <!-- Mouth -->
        <div style="position: absolute; bottom: 93px; left: 50%; transform: translateX(-50%); width: 12px; height: 4px; background: ${c(t.skinColor,30)}; border-radius: 0 0 4px 4px;"></div>
        
        <!-- Facial Hair -->
        ${g}
        
        <!-- Hair (in front if not long) -->
        ${a!=="Long"&&a!=="Afro"?l:""}
        
        <!-- Accessory -->
        ${x}
        
        <!-- Hat -->
        ${n}
    `}function k(e,a){const o=parseInt(e.replace("#",""),16),d=Math.round(2.55*a),b=Math.min(255,(o>>16)+d),u=Math.min(255,(o>>8&255)+d),f=Math.min(255,(o&255)+d);return`#${(1<<24|b<<16|u<<8|f).toString(16).slice(1)}`}function c(e,a){const o=parseInt(e.replace("#",""),16),d=Math.round(2.55*a),b=Math.max(0,(o>>16)-d),u=Math.max(0,(o>>8&255)-d),f=Math.max(0,(o&255)-d);return`#${(1<<24|b<<16|u<<8|f).toString(16).slice(1)}`}function L(){const e=document.getElementById("submitBtn");e.addEventListener("click",()=>{e.style.transform="translateY(8px)",localStorage.setItem("playerCharacter",JSON.stringify(t)),setTimeout(()=>{e.style.transform="",window.location.href="lingua.html"},300)})}function I(){const e=document.getElementById("snowContainer");function a(){const o=document.createElement("div");o.className="snowflake",o.style.left=Math.random()*100+"vw";const d=[4,6,8],b=d[Math.floor(Math.random()*d.length)];o.style.width=b+"px",o.style.height=b+"px";const u=8+Math.random()*6;o.style.animationDuration=u+"s",o.style.animationDelay=Math.random()*2+"s";const f=Math.round((Math.random()-.5)*60/4)*4;o.style.setProperty("--drift",f+"px"),e.appendChild(o),setTimeout(()=>o.remove(),(u+2)*1e3)}for(let o=0;o<30;o++)setTimeout(()=>a(),o*100);setInterval(a,200)}
