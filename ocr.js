// Læser et billede af en p-afgift i browseren (Tesseract.js). Billedet sendes ikke nogen steder hen.
(function(){
var SELS=[['Q-Park',/q-?park/i],['APCOA PARKING',/apcoa/i],['Gardian',/gardian/i],['ParkZone',/park\s?zone/i],['EuroPark',/euro\s?park/i],['OnePark',/one\s?park/i]];
function parse(t){var r={},m;
m=t.match(/\b([A-ZÆØ]{2})\s?(\d{2})\s?(\d{3})\b/);if(m)r.reg=m[1]+' '+m[2]+' '+m[3];
m=t.match(/\b(\d{1,2})[.\-\/](\d{1,2})[.\-\/](20\d{2})\b/)||t.match(/\b(\d{1,2})[.\-\/](\d{1,2})[.\-\/](\d{2})\b/);
if(m){var y=m[3].length===2?'20'+m[3]:m[3];r.dato=y+'-'+('0'+m[2]).slice(-2)+'-'+('0'+m[1]).slice(-2)}
m=t.match(/(?:kl\.?|tid|klokken)\s*(\d{1,2})[:.](\d{2})/i)||t.match(/\b([01]?\d|2[0-3])[:.]([0-5]\d)\b/);if(m)r.kl=m[1]+'.'+m[2];
m=t.match(/(\d{3,4})(?:[.,]00|[.,]-)?\s*(?:kr|dkk)/i)||t.match(/(?:kr\.?|dkk|beløb)\s*:?\s*(\d{3,4})/i);if(m)r.bel=m[1];
m=t.match(/(?:afgift|løbe|sags|ref)\w*\s*(?:nr\.?|nummer)?\s*:?\s*([A-Z]{0,3}\d[\d-]{4,13})/i);if(m)r.nr=m[1];
for(var i=0;i<SELS.length;i++)if(SELS[i][1].test(t)){r.sel=SELS[i][0];r.hvem='priv';break}
if(!r.hvem){m=t.match(/([A-ZÆØÅ][a-zæøå]+(?:\s[A-ZÆØÅ][a-zæøå]+)?)\s+Kommune/);
if(m||/kommune/i.test(t)){r.hvem='kom';if(m)r.kommune=m[1]}
else if(/politi/i.test(t)){r.hvem='pol'}
else if(/kontrolafgift/i.test(t)){r.hvem='priv'}}
if(/e-?boks|fremsendt|eftersendt|nummerplade\s?genkend|kamera|anpr/i.test(t))r.hvor='post';
return r}
function load(cb,fail){if(window.Tesseract)return cb();var s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/tesseract.js@5.1.1/dist/tesseract.min.js';s.onload=cb;s.onerror=fail;document.head.appendChild(s)}
window.pkRead=function(file,status,done){status('Henter læseren …');
load(function(){status('Læser billedet. Det tager 10-30 sekunder …');
Tesseract.recognize(file,'dan').then(function(res){var r=parse(res.data.text||'');try{localStorage.setItem('pklagen-ocr',JSON.stringify(r))}catch(e){}done(r)}).catch(function(){status('Billedet kunne ikke læses. Svar på spørgsmålene i stedet.');done(null)})},
function(){status('Læseren kunne ikke hentes. Svar på spørgsmålene i stedet.');done(null)})};
window.pkParse=parse;
})();
