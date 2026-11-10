// Læser et billede af en p-afgift i browseren (Tesseract.js). Billedet sendes ikke nogen steder hen.
(function(){
var SELS=[['Q-Park',/q-?park/i],['APCOA PARKING',/apcoa/i],['Gardian',/gardian/i],['ParkZone',/park\s?zone/i],['EuroPark',/euro\s?park/i],['OnePark',/\bone\s?park/i],['Oparko',/oparko/i],['Sikker Parkering',/sikker\s?parkering/i],['Securitas',/securitas/i],['DinParkering',/\bdin\s?parkering/i],['UnoPark',/\buno\s?park/i],['SimplyPark',/simply\s?park|carpay/i],['Copark',/copark/i],['Scan-Park',/scan-?park/i],['ParkPark',/parkpark/i],['Metropark',/metropark/i],['Smart Parking',/smart parking/i],['Safe Park',/safe\s?park/i],['Parkware',/parkware/i],['All Parkering',/all parkering/i]];
function p2(n){return ('0'+n).slice(-2)}
function today(){var d=new Date();return d.getFullYear()+'-'+p2(d.getMonth()+1)+'-'+p2(d.getDate())}
/* Finder parkeringsdatoen. Et brev har ofte flere datoer (brevdato, betalingsfrist).
   Vi tager den dato, der står ved ord som "parkering" eller "observeret", ellers den tidligste,
   fordi parkeringen altid ligger før brevet og fristen. Datoer i fremtiden er frister og springes over. */
function findDato(t){var re=/\b(\d{1,2})[.\-\/](\d{1,2})[.\-\/](20\d{2}|\d{2})\b/g,m,all=[],nu=today();
while((m=re.exec(t))){var dd=+m[1],mm=+m[2],y=m[3].length===2?'20'+m[3]:m[3];
if(dd<1||dd>31||mm<1||mm>12||+y<2018)continue;
var iso=y+'-'+p2(mm)+'-'+p2(dd);if(iso>nu)continue;
var before=t.slice(Math.max(0,m.index-60),m.index).toLowerCase();
all.push({iso:iso,good:/parker|observ|overtr|tidspunkt|kontrol|dato for/.test(before)&&!/betal|frist|forfald/.test(before.slice(-25))})}
if(!all.length)return null;
var g=all.filter(function(x){return x.good});
if(g.length)return g[0].iso;
return all.map(function(x){return x.iso}).sort()[0]}
function parse(t){var r={},m;
m=t.match(/\b([A-ZÆØ]{2})\s?(\d{2})\s?(\d{3})\b/);if(m)r.reg=m[1]+' '+m[2]+' '+m[3];
var dt=findDato(t);if(dt)r.dato=dt;
// Klokkeslæt: først med "kl."/"tid" foran, ellers kun med kolon, så en dato som 10.11.2026 ikke læses som kl. 10.11
m=t.match(/(?:kl\.?|klokken|tidspunkt|tid)\s*:?\s*([01]?\d|2[0-3])[:.]([0-5]\d)(?![.\-\/]?\d)/i)||t.match(/\b([01]?\d|2[0-3]):([0-5]\d)\b/);if(m)r.kl=m[1]+'.'+m[2];
m=t.match(/(\d{1,2}\.\d{3}|\d{3,4})(?:[.,]00|[.,]-)?\s*(?:kr|dkk)/i)||t.match(/(?:kr\.?|dkk|beløb)\s*:?\s*(\d{1,2}\.\d{3}|\d{3,4})/i);if(m)r.bel=m[1].replace('.','');
m=t.match(/(?:afgift|løbe|sags|ref)\w*\s*(?:nr\.?|nummer)?\s*:?\s*([A-Z]{0,3}\d[\d-]{4,13})/i);if(m)r.nr=m[1];
for(var i=0;i<SELS.length;i++)if(SELS[i][1].test(t)){r.sel=SELS[i][0];r.hvem='priv';break}
// "Kontrolafgift" bruges kun af private selskaber, så det tjekkes før "kommune" og "politi",
// som også kan stå i en adresse eller i en bisætning på en privat afgift.
if(!r.hvem){m=t.match(/([A-ZÆØÅ][a-zæøå]+(?:-[A-ZÆØÅ][a-zæøå]+)?)\s+Kommune/);
if(/kontrolafgift/i.test(t)){r.hvem='priv'}
else if(m||/kommune/i.test(t)){r.hvem='kom';if(m)r.kommune=m[1]}
else if(/politi/i.test(t)&&/bøde/i.test(t)){r.hvem='pol'}}
// Kun et gæt, som brugeren bekræfter i tjekket. Kamera-sager skal ramme 'anpr' og ikke bare 'post'.
if(/anpr|nummerplade\s?(?:genkend|scan|aflæs|registr)|kamera\s?(?:kontrol|registr|system|scan)/i.test(t))r.hvor='anpr';
else if(/e-?boks|eftersendt|eftersendelse/i.test(t))r.hvor='post';
return r}
function load(cb,fail){if(window.Tesseract)return cb();var s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js';s.onload=cb;s.onerror=fail;document.head.appendChild(s)}
/* Tegner billedet ned på et lærred først. Det retter mobilbilleder, der er gemt på siden
   (EXIF-rotation), og gør store kamerabilleder små nok til, at telefonen kan læse dem hurtigt. */
function prep(file,cb){try{var img=new Image(),u=URL.createObjectURL(file);
img.onload=function(){try{var w=img.naturalWidth,h=img.naturalHeight,s=Math.min(1,2200/Math.max(w,h)),c=document.createElement('canvas');
c.width=Math.round(w*s);c.height=Math.round(h*s);c.getContext('2d').drawImage(img,0,0,c.width,c.height);URL.revokeObjectURL(u);cb(c)}catch(e){cb(file)}};
img.onerror=function(){URL.revokeObjectURL(u);cb(file)};img.src=u}catch(e){cb(file)}}
window.pkRead=function(file,status,done){
try{localStorage.removeItem('pklagen-ocr')}catch(e){}
var fin=false;function end(r,msg){if(fin)return;fin=true;if(msg)status(msg);done(r)}
status('Henter læseren …');
setTimeout(function(){end(null,'Det tog for lang tid at læse billedet. Svar på spørgsmålene i stedet.')},90000);
load(function(){status('Læser billedet. Det tager 10-30 sekunder …');
prep(file,function(src){
Tesseract.recognize(src,'dan').then(function(res){if(fin)return;var r=parse(res.data.text||'');try{localStorage.setItem('pklagen-ocr',JSON.stringify(r))}catch(e){}end(r)}).catch(function(){end(null,'Billedet kunne ikke læses. Svar på spørgsmålene i stedet.')})})},
function(){end(null,'Læseren kunne ikke hentes. Svar på spørgsmålene i stedet.')})};
window.pkParse=parse;
})();
