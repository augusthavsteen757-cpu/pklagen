(function(){
function store(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
var A={},AUTO={},busy=false;
function idag(){var d=new Date();return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2)}
function strong(a){return a.hvor==='anpr'||(a.hvor==='post'&&(a.dato?a.dato>='2025-07-01':a.efter==='ja'))}
var Q=[
{id:'ok',if:function(a){return a._conf},t:'Passer det, vi læste?',o:[['ja','Ja, vis mit resultat'],['nej','Nej, jeg svarer selv']]},
{id:'hvem',t:'Hvem er afgiften fra?',o:[['priv','Et privat p-selskab, fx Q-Park eller APCOA'],['kom','Kommunen'],['pol','Politiet']]},
{id:'hvor',if:function(a){return a.hvem==='priv'},t:'Hvordan fik du den?',o:[['bil','Den sad på bilen, eller en vagt gav mig den'],['post','Med posten, i e-Boks eller på mail'],['anpr','Bagefter, og pladsen havde kameraer'],['vi','Kan ikke huske det']]},
{id:'efter',if:function(a){return a.hvem==='priv'&&(a.hvor==='post'||a.hvor==='anpr')&&!a.dato},t:'Parkerede du efter 1. juli 2025?',o:[['ja','Ja'],['nej','Nej, det var før']]},
{id:'grund',if:function(a){return a.hvem==='priv'},t:'Hvad siger de, du har gjort?',more:6,o:[['betalt','Ikke betalt, men det havde jeg'],['skive','Manglende eller forkert p-skive'],['tid','Holdt for længe'],['till','Ingen tilladelse, men jeg havde en'],['adm','Det er et "gebyr" eller en faktura, ikke en afgift'],['andet','Ved ikke, eller noget andet'],['gaest','Jeg var ved at hente gæstekort'],['flere','Flere afgifter for samme parkering'],['baas','Holdt uden for båsen, men stregerne var svære at se'],['forer','Det var ikke mig, der kørte bilen']]},
{id:'fejl',t:'Hvordan havde du betalt?',if:function(a){return a.grund==='betalt'},o:[['ok','Korrekt, og jeg har kvittering'],['taste','Jeg tastede forkert nummerplade eller zone'],['ingen','Jeg har ingen kvittering'],['nej','Jeg havde ikke betalt']]},
{id:'skilt',if:function(a){return a.hvem==='priv'&&!strong(a)},t:'Kunne du se skiltene med reglerne?',o:[['ok','Ja, tydeligt'],['daarlig','Nej, de var svære at se eller manglede prisen'],['vi','Lagde ikke mærke til dem']]},
{id:'kgrund',if:function(a){return a.hvem==='kom'},t:'Hvad siger kommunen, du har gjort?',o:[['taste','Ikke betalt, men jeg betalte og tastede nummerpladen forkert'],['betalt','Ikke betalt, men det havde jeg, og jeg har kvittering'],['skive','Forkert p-skive, men den var stillet rigtigt'],['licens','Ingen licens, men jeg havde en gyldig'],['skilt','Skiltningen var uklar eller manglede'],['andet','Noget andet']]}
];
var i=0,W=document.getElementById('wiz'),P=document.getElementById('prog'),R=document.getElementById('res');
function vis(){return Q.filter(function(q){return !AUTO[q.id]&&(!q.if||q.if(A))})}
function draw(){var L=vis(),q=L[i],h='<div class="step"><h3>'+q.t+'</h3>';
var n=Math.max(L.length,4),bar='';for(var j=0;j<n;j++)bar+='<i class="'+(j<=i?'on':'')+'"></i>';P.innerHTML=bar;
if(q.o){var open=!q.more||q._open||q.o.slice(q.more).some(function(o){return o[0]===A[q.id]});h+='<div class="opts" role="radiogroup" aria-label="'+q.t+'">';q.o.forEach(function(o,n){h+='<label'+(!open&&n>=q.more?' hidden':'')+'><input type="radio" name="w_'+q.id+'" value="'+o[0]+'"'+(A[q.id]===o[0]?' checked':'')+'> <span>'+o[1]+'</span></label>'});if(!open)h+='<button class="more" type="button" id="mr">Vis flere grunde</button>';h+='</div>'}
else{h+='<label class="fld"><span>Dato</span><input id="w_'+q.id+'" type="date" max="'+idag()+'" value="'+(A[q.id]||'')+'"></label>'}
if(q.h)h+='<p class="hint">'+q.h+'</p>';
h+='<div class="nav">'+(q.o?'':'<button class="btn" type="button" id="nx">Næste</button>')+(i?'<button class="back" type="button" id="bk">Tilbage</button>':'')+'</div></div>';
W.innerHTML=h;
var mr=document.getElementById('mr');if(mr)mr.onclick=function(){q._open=1;draw()};
var bk=document.getElementById('bk');if(bk)bk.onclick=function(){i--;draw()};
if(q.o){[].forEach.call(W.querySelectorAll('input'),function(r){r.onclick=function(){if(busy)return;busy=true;A[q.id]=r.value;setTimeout(function(){busy=false;if(q.id==='ok'&&r.value==='nej')return document.getElementById('skip').onclick();if(q.id==='hvem'&&r.value==='pol')return result();next()},180)}})}
else{var inp=document.getElementById('w_'+q.id);document.getElementById('nx').onclick=function(){if(!inp.value||inp.value>idag()){inp.focus();return}A[q.id]=inp.value;next()}}
}
function next(){if(i<vis().length-1){i++;draw()}else result()}
function result(){
var a=A,lvl=1,why=[],sel=[];
if(a.hvem==='pol'){lvl=-1;why.push('En parkeringsbøde fra politiet er en straffesag. Afviser du bøden, kan sagen ende i retten med ekstra omkostninger. Det hjælper P-klagen ikke med. Mener du, bøden er forkert, så kontakt politiet direkte.')}
else if(a.hvem==='kom'){a.typ='kom';
if(a.kgrund==='taste'){lvl=3;sel.push('ktaste');why.push('Du betalte, men tastede nummerpladen forkert. Højesteret har i 2020 slået fast, at kommunen ikke kan fastholde en p-afgift for en tastefejl, når der er betalt for parkeringen, og der ikke findes en anden bil med det indtastede nummer. Det er et stærkt argument.')}
if(a.kgrund==='betalt'){lvl=3;sel.push('kbetalt');why.push('Du havde betalt og har kvittering. Vedlæg kvitteringen eller et skærmbillede fra appen.')}
if(a.kgrund==='skive'){lvl=2;sel.push('kskive');why.push('Var p-skiven stillet rigtigt efter ankomsttiden og lå synligt, er det værd at klage. Vedlæg et billede, hvis du har et.')}
if(a.kgrund==='licens'){lvl=2;sel.push('klicens');why.push('Havde du en gyldig licens til området, skal afgiften annulleres. Vedlæg licensen.')}
if(a.kgrund==='skilt'){lvl=2;sel.push('kskilt');why.push('Var skiltningen uklar eller manglede den, er det værd at klage. Tag billeder af stedet som bevis.')}
if(a.kgrund==='andet'){why.push('Skriv din egen forklaring i klagen, og vedlæg billeder. Uden et konkret argument er det svært at få afgiften annulleret.')}
why.push('Du klager gratis direkte til kommunen. Der findes ikke et klagenævn for kommunale p-afgifter, så kommunens svar er det sidste skridt uden for retten.')}
else{
var efter=a.dato?a.dato>='2025-07-01':a.efter==='ja';
if(a.hvor==='anpr'){lvl=3;sel.push('anpr');why.push('Afgiften er udstedt via kameraer og sendt bagefter. '+(efter?'Siden 1. juli 2025 skal en kontrolafgift sættes synligt på bilen eller gives til føreren. ':'')+'Parkeringsklagenævnet annullerede i september 2026 en sådan afgift, selv om den var fra december 2024, fordi den ikke blev sat på bilen eller givet til føreren (sag 14567). Det er et meget stærkt argument.')}
else if(a.hvor==='post'&&efter){lvl=3;sel.push('post');why.push('Afgiften er sendt bagefter. Siden 1. juli 2025 skal en kontrolafgift sættes synligt på bilen eller gives til føreren. En afgift, der kun er sendt med posten, e-Boks eller mail, er som udgangspunkt ikke gyldig.')}
else if(a.hvor==='post'){lvl=Math.max(lvl,2);sel.push('post');why.push('Afgiften er sendt bagefter. Før 1. juli 2025 måtte det kun ske, hvis det ikke var muligt at sætte den på bilen. Selskabet skal kunne vise, at det var tilfældet.')}
if(a.skilt==='daarlig'){lvl=Math.max(lvl,2);sel.push('skilt');why.push('Skiltningen skal opfylde faste krav: et skilt med hvidt P på sort bund ved indkørslen og skilte på pladsen med reglerne, afgiftens størrelse og selskabets navn. Er den utydelig, er du ikke bundet af vilkårene. Tag billeder som bevis.')}
if(a.seddel==='nej'){lvl=Math.max(lvl,2);sel.push('seddel');why.push('Afgiften skal oplyse, hvilket vilkår du har overtrådt, tid og sted, nummerplade, betalingsfrist og hvor du kan klage. Mangler noget, er den ikke udstedt efter reglerne.')}
if(a.grund==='betalt'&&a.fejl==='ok'){lvl=Math.max(lvl,3);sel.push('betalt');why.push('Du havde betalt og har kvittering. Det er et stærkt argument. Vedlæg kvitteringen eller et skærmbillede fra appen.')}
if(a.grund==='betalt'&&a.fejl==='taste'){sel.push('taste');why.push('Du betalte, men med forkert nummerplade eller kode. Det er ærligt talt et svagt argument. Domstolene har sagt, at det er bilistens risiko, hvis appen bruges forkert. Nogle selskaber annullerer alligevel af god vilje, men regn ikke med det.')}
if(a.grund==='till'){lvl=Math.max(lvl,2);sel.push('till');why.push('Du havde tilladelse. Vedlæg kopi af tilladelsen og et billede af, hvor den lå i bilen.')}
if(a.grund==='skive'){lvl=Math.max(lvl,2);sel.push('skive');why.push('Lå der en rigtig p-skive, stillet efter ankomsttiden, er det værd at klage, især med et billede. En håndskrevet seddel tæller ikke, det har landsretten afgjort.')}
if(a.grund==='gaest'){lvl=Math.max(lvl,2);sel.push('gaest');why.push('Står der ikke på skiltet, hvor lang tid man har til at hente gæstekort, har man efter landsrettens praksis rimelig tid til det.')}
if(a.grund==='flere'){lvl=Math.max(lvl,2);sel.push('flere');why.push('Flere afgifter for én sammenhængende parkering kan være urimeligt, fx når bilen holdt fra aften til morgen. Det har landsretten givet en bilist medhold i.')}
if(a.grund==='adm'){lvl=Math.max(lvl,3);sel.push('adm');why.push('Et "administrationsgebyr" for at bryde parkeringsvilkårene er reelt en kontrolafgift og skal følge de samme regler. Nævnet gav en bilist medhold i august 2026 i en sag om et gebyr på 89 kr, der var sendt bagefter (sag 18103).')}
if(a.grund==='baas'){lvl=Math.max(lvl,2);sel.push('baas');why.push('Var stregerne nedslidte eller utydelige, kan du ikke forventes at vide, hvor båsen var. Nævnet gav en bilist medhold i oktober 2026 i netop sådan en sag (sag 11593). Tag billeder af stregerne.')}
if(a.grund==='forer'){lvl=Math.max(lvl,2);sel.push('forer');why.push('Kun den, der parkerede bilen, hæfter for afgiften. Ejeren hæfter ikke, har Højesteret slået fast (U.2015.27H). Du skal dog kunne sandsynliggøre, at det ikke var dig, fx at du var et andet sted. Skriv kun det, der er sandt.')}
if(a.grund==='tid'&&lvl<3){sel.push('tid');why.push('Overskredet tid er svært at vinde på, medmindre skiltningen var utydelig, eller selskabet har regnet tiden forkert.')}
if(a.hvor==='vi'||a.skilt==='vi')why.push('Kig på afgiften og skiltene igen, hvis du kan. Det kan give dig et stærkere argument.')
}
if(lvl===1&&a.hvem==='priv')sel.unshift('vedikke');
a.grunde=sel;a.typ=a.hvem==='kom'?'kom':'priv';a.lvl=lvl;a.why=why;store('pklagen',a);location.href='resultat.html';
}
var PH=document.getElementById('photo'),WZ=document.getElementById('wizbox'),ST=document.getElementById('ocrstat'),RD=document.getElementById('readinfo');
function startWiz(){PH.hidden=true;WZ.hidden=false;i=0;if(!vis().length)return result();draw()}
document.getElementById('skip').onclick=function(){A={};AUTO={};try{localStorage.removeItem('pklagen-ocr')}catch(e){}RD.hidden=true;startWiz()};
document.getElementById('pic').onchange=function(e){var f=e.target.files&&e.target.files[0];if(!f)return;
pkRead(f,function(m){ST.textContent=m},function(r){if(!r){setTimeout(startWiz,1200);return}
A={};AUTO={};var seen=[];if(r.hvem){A.hvem=r.hvem;if(r.hvem==='priv'&&r.sel)AUTO.hvem=1;seen.push(r.hvem==='priv'?(r.sel||'privat p-selskab'):r.hvem==='kom'?(r.kommune?r.kommune+' Kommune':'kommunen'):'politiet')}
if(r.hvor){A.hvor=r.hvor;if(r.dato)AUTO.hvor=1;seen.push(r.hvor==='anpr'?'kamera':'sendt bagefter')}
if(r.grund){A.grund=r.grund;AUTO.grund=1;seen.push({betalt:'ikke betalt',skive:'p-skive',tid:'holdt for længe',till:'ingen tilladelse',baas:'uden for båsen',adm:'gebyr'}[r.grund])}
if(r.dato){A.dato=r.dato;var d=r.dato.split('-');seen.push(d[2]+'.'+d[1]+'.'+d[0])}
if(r.reg)seen.push(r.reg);if(r.bel)seen.push(r.bel+' kr');
if(AUTO.hvem&&AUTO.hvor&&AUTO.grund&&strong({hvor:r.hvor,dato:r.dato}))A._conf=1;RD.hidden=!seen.length;RD.innerHTML='Vi læste: <b>'+seen.join(' · ').replace(/[<>&]/g,'')+'</b>. '+(A._conf?'':'<button class="back" type="button" id="wrong">Passer det ikke? Svar selv</button>');var wr=document.getElementById('wrong');if(wr)wr.onclick=function(){document.getElementById('skip').onclick()};startWiz()})};
})();
