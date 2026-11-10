/* Parkeringsklagenævnets liste over tilsluttede selskaber, hentet 9. nov. 2026 fra
   https://www.parkeringsklagenaevnet.dk/da/tilsluttede-selskaber/
   [søgning, officielt navn, CVR, perioder [fra,til] (til=null: stadig tilsluttet)] */
var PK_REG=[
[/simplyture|carpay|simply\s?park|simplytech/i,'Simplyture ApS (CarPay, SimplyPark)','36958243',[['2022-12-06','2025-12-31']]],
[/apcoa|euro\s?park|one\s?park/i,'Apcoa Parking Danmark A/S (EuroPark)','19055108',[['2018-07-01',null]]],
[/copark/i,'COPARK A/S','39297183',[['2018-07-01',null]]],
[/cp parking/i,'CP Parking System ApS','35210768',[['2021-12-21',null]]],
[/c-?parkingsystems|industrigården/i,'C-Parkingsystems A/S','25099184',[['2018-07-01',null]]],
[/din\s?parkering/i,'DinParkering A/S','34734135',[['2018-07-01',null]]],
[/dk security|dk park/i,'DK Security ApS (DK Park)','41934409',[['2023-12-21',null]]],
[/gardian|park\s?zone/i,'Gardian A/S (ParkZone)','27396682',[['2018-07-01',null]]],
[/metropark/i,'Metropark ApS','36422173',[['2018-07-04',null]]],
[/oparko|parkeringskompagniet/i,'Oparko A/S','37127485',[['2018-12-03','2020-05-04'],['2020-05-16',null]]],
[/avantpark|parking\s?eye|parking solutions/i,'Parking Solutions Danmark (Avantpark, Parkingeye)','42325864',[['2021-12-22',null]]],
[/juhlsland|parkware|\bplot\b/i,'Juhlsland og Co. A/S (Parkware, PLOT)','45443345',[['2018-07-03','2020-06-10'],['2020-06-18','2022-02-22'],['2022-05-19',null]]],
[/q-?park|city parkering|dansk parkerings\s?service|univers parkering/i,'Q-Park Operations Denmark A/S','11967086',[['2018-07-01',null]]],
[/safe\s?park/i,'Safe Park ApS','42567469',[['2022-11-23',null]]],
[/scanparkering|brøndby rengøring/i,'Scanparkering','15027576',[['2018-08-28','2022-02-22'],['2022-03-03',null]]],
[/scan-?park\b/i,'Scan-Park ApS','34593388',[['2018-07-01',null]]],
[/securitas|sikker\s?parkering/i,'Securitas A/S (SikkerParkering)','88663217',[['2022-02-15',null]]],
[/smart parking/i,'Smart Parking Danmark ApS','44496593',[['2024-02-23',null]]],
[/thy\s?hallen/i,'Thy Hallen','29189560',[['2025-11-17',null]]],
[/uno\s?park/i,'UnoPark A/S','36701781',[['2018-07-01',null]]],
[/all parkering/i,'All Parkering ApS','44234750',[['2023-09-08','2025-12-31']]],
[/atlas security/i,'Atlas Security ApS','36920408',[['2018-07-01','2023-05-30']]],
[/ørestad parkering|bc hospitality/i,'BC Hospitality Group A/S (Ørestad Parkering)','37939838',[['2019-02-11','2020-06-23'],['2020-07-08','2022-02-22']]],
[/dansk p-?kontrol/i,'Dansk P-kontrol v/Jan Schou','18140381',[['2018-07-01','2023-12-31']]],
[/dansk parkering\b/i,'Dansk Parkering ApS','37297542',[['2018-07-01','2020-08-01']]],
[/inter\s?park/i,'InterPark I/S','31963761',[['2018-07-01','2024-12-31']]],
[/nordkraft/i,'K/S Nordkraft Ejendomme','33586124',[['2018-07-16','2025-12-31']]],
[/p[\s-]?control/i,'P CONTROL ApS','32891373',[['2018-07-01','2023-02-10']]],
[/parkering (å|aa)rhus/i,'Parkering Århus A/S','32764339',[['2018-07-01','2019-08-06']]],
[/park\s?depot/i,'ParkDepot ApS','42920894',[['2022-05-17','2025-03-04']]],
[/parkforce/i,'Parkforce ApS','37798045',[['2018-12-21','2025-03-04']]],
[/parkspot/i,'Parkspot ApS','41534257',[['2020-12-03','2022-02-22']]],
[/privatpark/i,'Privatpark ApS','40341005',[['2021-03-08','2023-04-18'],['2023-05-11','2024-03-18']]],
[/tr total/i,'TR Total 1 ApS','42495530',[['2024-10-02','2025-12-31']]]
];
function pkD(s){var p=s.split('-');return +p[2]+'.'+(+p[1])+'.'+p[0]}
/* Returnerer null (ukendt), eller {navn,cvr,ok,per} hvor ok=false betyder: ikke tilsluttet på datoen */
function pkNaevn(sel,dato){if(!sel)return null;for(var i=0;i<PK_REG.length;i++){var r=PK_REG[i];if(r[0].test(sel)){
var ok=null;if(dato&&dato>='2018-07-01'){ok=r[3].some(function(p){return dato>=p[0]&&(!p[1]||dato<=p[1])})}
var per=r[3].map(function(p){return 'fra '+pkD(p[0])+(p[1]?' til '+pkD(p[1]):'')}).join(' og ');
return {navn:r[1],cvr:r[2],ok:ok,per:per}}}return null}
