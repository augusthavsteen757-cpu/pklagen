(function(){
function store(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
var A={},AUTO={};
var Q=[
{id:'hvem',t:'Hvem er afgiften fra?',o:[['priv','Et privat firma, fx Q-Park, APCOA, Gardian eller EuroPark'],['kom','Kommunen'],['pol','Politiet']]},
{id:'hvor',if:function(a){return a.hvem==='priv'},t:'Hvordan fik du den?',o:[['post','Den kom bagefter, med posten, i e-Boks eller på mail'],['bil','Den sad på bilen, eller en vagt gav mig den'],['vi','Kan ikke huske det']]},
{id:'dato',if:function(a){return a.hvem==='priv'},t:'Hvilken dato parkerede du?',d:1},
{id:'grund',if:function(a){return a.hvem==='priv'},t:'Hvad siger de, du har gjort?',o:[['betalt','Ikke betalt, men det havde jeg'],['skive','Manglende eller forkert p-skive'],['tid','Overskredet tid'],['till','Ingen tilladelse, men jeg havde en'],['gaest','Holdt der uden tilladelse, mens jeg hentede gæstekort'],['flere','Flere afgifter for samme parkering'],['andet','Noget andet']]},
{id:'fejl',t:'Hvordan havde du betalt?',if:function(a){return a.grund==='betalt'},o:[['ok','Korrekt, og jeg har kvittering'],['taste','Jeg tastede forkert nummerplade eller zone'],['ingen','Jeg har ingen kvittering']]},
{id:'skilt',if:function(a){return a.hvem==='priv'},t:'Kunne man se skiltene?',o:[['ok','Ja, tydeligt, også hvad afgiften kostede'],['daarlig','Nej, de var svære at se eller manglede prisen'],['vi','Lagde ikke mærke til dem']]},
{id:'seddel',if:function(a){return a.hvem==='priv'},t:'Står der tid, sted, nummerplade, betalingsfrist og hvor man klager?',o:[['ja','Ja, det hele'],['nej','Nej, noget mangler'],['vi','Har ikke tjekket']]},
{id:'kgrund',if:function(a){return a.hvem==='kom'},t:'Hvad siger kommunen, du har gjort?',o:[['taste','Ikke betalt, men jeg betalte og tastede nummerpladen forkert'],['betalt','Ikke betalt, men det havde jeg, og jeg har kvittering'],['skive','Forkert p-skive, men den var stillet rigtigt'],['licens','Ingen licens, men jeg havde en gyldig'],['skilt','Skiltningen var uklar eller manglede'],['andet','Noget andet']]},
{id:'klaget',if:function(a){return a.hvem==='priv'},t:'Har du klaget til dem?',o:[['nej','Ikke endnu'],['afslag','Ja, de sagde nej'],['intet','Ja, men intet svar i 3 måneder']]}
];
var i=0,W=document.getElementById('wiz'),P=document.getElementById('prog'),R=document.getElementById('res');
function vis(){return Q.filter(function(q){return !AUTO[q.id]&&(!q.if||q.if(A))})}
function draw(){var L=vis(),q=L[i],h='<div class="step"><p class="label">Spørgsmål '+(i+1)+' af '+L.length+'</p><h3>'+q.t+'</h3>';
P.innerHTML=L.map(function(x,j){return '<i class="'+(j<=i?'on':'')+'"></i>'}).join('');
if(q.o){h+='<div class="opts" role="radiogroup">';q.o.forEach(function(o){h+='<label><input type="radio" name="w_'+q.id+'" value="'+o[0]+'"'+(A[q.id]===o[0]?' checked':'')+'> <span>'+o[1]+'</span></label>'});h+='</div>'}
else{h+='<label class="fld"><span>Dato</span><input id="w_'+q.id+'" type="date" value="'+(A[q.id]||'')+'"></label>'}
if(q.h)h+='<p class="hint">'+q.h+'</p>';
h+='<div class="nav">'+(q.o?'':'<button class="btn" type="button" id="nx">Næste</button>')+(i?'<button class="back" type="button" id="bk">Tilbage</button>':'')+'</div></div>';
W.innerHTML=h;
var bk=document.getElementById('bk');if(bk)bk.onclick=function(){i--;draw()};
if(q.o){[].forEach.call(W.querySelectorAll('input'),function(r){r.onchange=function(){A[q.id]=r.value;setTimeout(function(){if(q.id==='hvem'&&r.value==='pol')return result();next()},180)}})}
else{var inp=document.getElementById('w_'+q.id);document.getElementById('nx').onclick=function(){if(!inp.value){inp.focus();return}A[q.id]=inp.value;next()}}
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
var efter=a.dato&&a.dato>='2025-07-01';
if(a.hvor==='post'&&efter){lvl=3;sel.push('post');why.push('Afgiften er sendt bagefter. Siden 1. juli 2025 skal en kontrolafgift sættes synligt på bilen eller gives til føreren. En afgift, der kun er sendt med posten, e-Boks eller mail, er som udgangspunkt ikke gyldig.')}
else if(a.hvor==='post'){lvl=Math.max(lvl,2);sel.push('post');why.push('Afgiften er sendt bagefter. Før 1. juli 2025 måtte det kun ske, hvis det ikke var muligt at sætte den på bilen. Selskabet skal kunne vise, at det var tilfældet.')}
if(a.skilt==='daarlig'){lvl=Math.max(lvl,2);sel.push('skilt');why.push('Skiltningen skal opfylde faste krav: et skilt med hvidt P på sort bund ved indkørslen og skilte på pladsen med reglerne, afgiftens størrelse og selskabets navn. Er den utydelig, er du ikke bundet af vilkårene. Tag billeder som bevis.')}
if(a.seddel==='nej'){lvl=Math.max(lvl,2);sel.push('seddel');why.push('Afgiften skal oplyse, hvilket vilkår du har overtrådt, tid og sted, nummerplade, betalingsfrist og hvor du kan klage. Mangler noget, er den ikke udstedt efter reglerne.')}
if(a.grund==='betalt'&&a.fejl==='ok'){lvl=Math.max(lvl,3);sel.push('betalt');why.push('Du havde betalt og har kvittering. Det er et stærkt argument. Vedlæg kvitteringen eller et skærmbillede fra appen.')}
if(a.grund==='betalt'&&a.fejl==='taste'){sel.push('taste');why.push('Du betalte, men med forkert nummerplade eller kode. Det er ærligt talt et svagt argument. Domstolene har sagt, at det er bilistens risiko, hvis appen bruges forkert. Nogle selskaber annullerer alligevel af god vilje, men regn ikke med det.')}
if(a.grund==='till'){lvl=Math.max(lvl,2);sel.push('till');why.push('Du havde tilladelse. Vedlæg kopi af tilladelsen og et billede af, hvor den lå i bilen.')}
if(a.grund==='skive'){sel.push('skive');why.push('Lå der en rigtig p-skive, stillet efter ankomsttiden, er det værd at klage, især med et billede. En håndskrevet seddel tæller ikke, det har landsretten afgjort.')}
if(a.grund==='gaest'){lvl=Math.max(lvl,2);sel.push('gaest');why.push('Står der ikke på skiltet, hvor lang tid man har til at hente gæstekort, har man efter landsrettens praksis rimelig tid til det.')}
if(a.grund==='flere'){lvl=Math.max(lvl,2);sel.push('flere');why.push('Flere afgifter for én sammenhængende parkering kan være urimeligt, fx når bilen holdt fra aften til morgen. Det har landsretten givet en bilist medhold i.')}
if(a.grund==='tid'){sel.push('tid');why.push('Overskredet tid er svært at vinde på, medmindre skiltningen var utydelig, eller selskabet har regnet tiden forkert.')}
if(a.hvor==='vi'||a.skilt==='vi'||a.seddel==='vi')why.push('Du svarede "ved ikke" på et spørgsmål. Kig på afgiften og skiltene igen. Det kan give dig et stærkere argument.')
if(a.klaget==='afslag'||a.klaget==='intet')why.push('Du har allerede klaget til selskabet. Næste skridt er Parkeringsklagenævnet. Gebyret er 175 kr, og du får det tilbage, hvis du får medhold. Klagen til nævnet er med i pakken.')}
a.grunde=sel;a.typ=a.hvem==='kom'?'kom':'priv';a.lvl=lvl;a.why=why;store('pklagen',a);location.href='resultat.html';
}
var PH=document.getElementById('photo'),WZ=document.getElementById('wizbox'),ST=document.getElementById('ocrstat'),RD=document.getElementById('readinfo');
function startWiz(){PH.hidden=true;WZ.hidden=false;i=0;if(!vis().length)return result();draw()}
document.getElementById('skip').onclick=function(){startWiz()};
document.getElementById('pic').onchange=function(e){var f=e.target.files&&e.target.files[0];if(!f)return;
pkRead(f,function(m){ST.textContent=m},function(r){if(!r){setTimeout(startWiz,1200);return}
var seen=[];if(r.hvem){A.hvem=r.hvem;AUTO.hvem=1;seen.push(r.hvem==='priv'?(r.sel||'privat p-selskab'):r.hvem==='kom'?(r.kommune?r.kommune+' Kommune':'kommunen'):'politiet')}
if(r.hvor==='post'){A.hvor='post';AUTO.hvor=1;seen.push('sendt bagefter')}
if(r.dato){A.dato=r.dato;AUTO.dato=1;var d=r.dato.split('-');seen.push(d[2]+'.'+d[1]+'.'+d[0])}
if(r.reg)seen.push(r.reg);if(r.bel)seen.push(r.bel+' kr');
if(r.reg&&r.dato&&r.kl&&r.bel&&r.nr){A.seddel='ja';AUTO.seddel=1}
RD.hidden=!seen.length;RD.textContent='Vi læste: '+seen.join(' · ')+'. Resten spørger vi om.';startWiz()})};
})();
