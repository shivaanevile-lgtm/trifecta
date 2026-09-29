// Trifecta shared code: the footballer database and the game rules.
// Used by the browser (app.js) and by the online-rooms function (functions/api/room.js).

// ======== PART 1: PLAYER DATABASE ========
// Trifecta player database.
// One line per player:  Name | Nation | Positions | Clubs (codes) | Fame (1-3, blank = 2) | Aliases (; separated)
// Positions: GK CB LB RB DM CM AM LW RW ST   ("W" = LW+RW)
// Fame only matters for how well the computer opponents "know" a player.
// To add players just add lines. Club codes must exist in CLUBS below.

export const POSITIONS = ['GK', 'CB', 'LB', 'RB', 'DM', 'CM', 'AM', 'LW', 'RW', 'ST'];
export const POS_NAMES = {
  GK: 'Goalkeeper', CB: 'Centre-back', LB: 'Left-back', RB: 'Right-back', DM: 'Defensive mid',
  CM: 'Central mid', AM: 'Attacking mid', LW: 'Left winger', RW: 'Right winger', ST: 'Striker',
};

// code: [name, primary colour, text colour]
export const CLUBS = {
  MUN: ['Manchester United', '#DA291C', '#fff'], MCI: ['Manchester City', '#6CABDD', '#10233f'],
  LIV: ['Liverpool', '#C8102E', '#fff'], CHE: ['Chelsea', '#034694', '#fff'],
  ARS: ['Arsenal', '#EF0107', '#fff'], TOT: ['Tottenham Hotspur', '#132257', '#fff'],
  NEW: ['Newcastle United', '#241F20', '#fff'], WHU: ['West Ham United', '#7A263A', '#9ad0f0'],
  AVL: ['Aston Villa', '#670E36', '#95bfe5'], EVE: ['Everton', '#003399', '#fff'],
  LEI: ['Leicester City', '#003090', '#fff'], LEE: ['Leeds United', '#FFCD00', '#1d428a'],
  SOU: ['Southampton', '#D71920', '#fff'], FUL: ['Fulham', '#111111', '#fff'],
  BHA: ['Brighton', '#0057B8', '#fff'], WOL: ['Wolverhampton', '#FDB913', '#111'],
  CRY: ['Crystal Palace', '#1B458F', '#fff'], BLB: ['Blackburn Rovers', '#009EE0', '#fff'],
  SUN: ['Sunderland', '#EB172B', '#fff'], BRF: ['Brentford', '#E30613', '#fff'],
  RMA: ['Real Madrid', '#F4F1EA', '#1a1a1a'], BAR: ['Barcelona', '#A50044', '#EDBB00'],
  ATM: ['Atlético Madrid', '#CB3524', '#fff'], SEV: ['Sevilla', '#F4F1EA', '#D4011C'],
  VAL: ['Valencia', '#F4F1EA', '#111'], VIL: ['Villarreal', '#FFE114', '#0a3a7a'],
  RSO: ['Real Sociedad', '#0067B1', '#fff'], ATH: ['Athletic Club', '#EE2523', '#fff'],
  BET: ['Real Betis', '#0BB363', '#fff'], MAL: ['Málaga', '#3f7fc4', '#fff'],
  JUV: ['Juventus', '#111111', '#fff'], MIL: ['AC Milan', '#FB090B', '#111'],
  INT: ['Inter Milan', '#0068A8', '#111'], ROM: ['AS Roma', '#8E1F2F', '#F0BC42'],
  NAP: ['Napoli', '#12A0D7', '#fff'], LAZ: ['Lazio', '#87D8F7', '#10233f'],
  ATA: ['Atalanta', '#1E71B8', '#111'], FIO: ['Fiorentina', '#482E92', '#fff'],
  PAR: ['Parma', '#FFD400', '#0a3a7a'], SAM: ['Sampdoria', '#0055a5', '#fff'],
  BAY: ['Bayern Munich', '#DC052D', '#fff'], BVB: ['Borussia Dortmund', '#FDE100', '#111'],
  LEV: ['Bayer Leverkusen', '#E32221', '#111'], RBL: ['RB Leipzig', '#DD0741', '#fff'],
  SCH: ['Schalke 04', '#004D9D', '#fff'], WOB: ['Wolfsburg', '#65B32E', '#fff'],
  BRE: ['Werder Bremen', '#1D9053', '#fff'], GLA: ['Gladbach', '#111111', '#3fa34d'],
  FRA: ['Eintracht Frankfurt', '#E1000F', '#111'], HOF: ['Hoffenheim', '#1961B5', '#fff'],
  STU: ['VfB Stuttgart', '#E32219', '#fff'], HSV: ['Hamburg', '#0a3a7a', '#fff'],
  PSG: ['Paris Saint-Germain', '#004170', '#DA291C'], OM: ['Marseille', '#2FAEE0', '#fff'],
  OL: ['Lyon', '#F4F1EA', '#1a3a8a'], MON: ['Monaco', '#E51B22', '#fff'],
  LIL: ['Lille', '#E01E13', '#fff'], REN: ['Rennes', '#E13327', '#111'],
  SAI: ['Saint-Étienne', '#008A3B', '#fff'],
  AJX: ['Ajax', '#D2122E', '#fff'], PSV: ['PSV Eindhoven', '#ED1C24', '#fff'],
  FEY: ['Feyenoord', '#E4002B', '#fff'],
  POR: ['Porto', '#003893', '#fff'], BEN: ['Benfica', '#E30613', '#fff'],
  SCP: ['Sporting CP', '#008057', '#fff'],
  CEL: ['Celtic', '#16a34a', '#fff'], RAN: ['Rangers', '#1B458F', '#fff'],
  GAL: ['Galatasaray', '#FDB912', '#A90432'], FEN: ['Fenerbahçe', '#FFED00', '#0a2a6a'],
  BES: ['Beşiktaş', '#111111', '#fff'], RBS: ['RB Salzburg', '#DD0741', '#fff'],
  SHA: ['Shakhtar Donetsk', '#F58220', '#111'], ZEN: ['Zenit', '#00A0DC', '#fff'],
  BOC: ['Boca Juniors', '#0a3a7a', '#F7D117'], RIV: ['River Plate', '#F4F1EA', '#E4002B'],
  FLA: ['Flamengo', '#C8102E', '#111'], SAN: ['Santos', '#F4F1EA', '#111'],
  PLM: ['Palmeiras', '#006437', '#fff'], SAO: ['São Paulo', '#E4002B', '#fff'],
  COR: ['Corinthians', '#111111', '#fff'], GRE: ['Grêmio', '#0D80BF', '#111'],
  LAG: ['LA Galaxy', '#00245D', '#FFD200'], LAF: ['LAFC', '#111111', '#C39E6D'],
  MIA: ['Inter Miami', '#F7B5CD', '#231F20'], NAS: ['Al-Nassr', '#FFD500', '#0a2a6a'],
  HIL: ['Al-Hilal', '#005EB8', '#fff'], ITT: ['Al-Ittihad', '#FFD500', '#111'],
  BOL: ['Bologna', '#1A2F48', '#fff'],
  GIR: ['Girona', '#E41E26', '#fff'],
  CLV: ['Celta Vigo', '#8AC3EE', '#10233f'],
  GEN: ['Genoa', '#A6192E', '#0a2a6a'],
  TOR: ['Torino', '#8B1A2B', '#fff'],
  UDI: ['Udinese', '#111111', '#fff'],
  SAS: ['Sassuolo', '#00A550', '#111'],
  CAG: ['Cagliari', '#A6192E', '#0a2a6a'],
  NFO: ['Nottingham Forest', '#DD0000', '#fff'],
  BOU: ['Bournemouth', '#DA291C', '#111'],
  STK: ['Stoke City', '#E03A3E', '#fff'],
  SWA: ['Swansea City', '#F4F1EA', '#111'],
  WBA: ['West Brom', '#122F67', '#fff'],
  MID: ['Middlesbrough', '#E4002B', '#fff'],
  NOR: ['Norwich City', '#FFF200', '#00A650'],
  WAT: ['Watford', '#FBEE23', '#111'],
  LEN: ['Lens', '#FFD400', '#E4002B'],
  UNI: ['Union Berlin', '#EB1923', '#fff'],
  M05: ['Mainz 05', '#C3141E', '#fff'],
  AZ: ['AZ Alkmaar', '#D2122E', '#fff'],
  GNK: ['Genk', '#0A5DA6', '#fff'],
  BSL: ['Basel', '#D4001A', '#0a2a6a'],
  NIC: ['Nice', '#111111', '#E4002B'],
  OSA: ['Osasuna', '#D91A21', '#0a2a6a'],
  ESY: ['Espanyol', '#0A5DA6', '#fff'],
  AHL: ['Al-Ahli', '#0B7A3E', '#fff'],
};

export const FLAGS = {
  Brazil: '🇧🇷', Argentina: '🇦🇷', Uruguay: '🇺🇾', Germany: '🇩🇪', Spain: '🇪🇸', France: '🇫🇷',
  England: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', Portugal: '🇵🇹', Netherlands: '🇳🇱', Italy: '🇮🇹', Belgium: '🇧🇪', Croatia: '🇭🇷',
  Sweden: '🇸🇪', Norway: '🇳🇴', Denmark: '🇩🇰', Poland: '🇵🇱', Ukraine: '🇺🇦', Bulgaria: '🇧🇬',
  'Czech Republic': '🇨🇿', Bosnia: '🇧🇦', Switzerland: '🇨🇭', Romania: '🇷🇴', Turkey: '🇹🇷',
  Slovenia: '🇸🇮', Scotland: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', Wales: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', Ireland: '🇮🇪', 'Northern Ireland': '🇬🇧',
  Egypt: '🇪🇬', Senegal: '🇸🇳', 'Ivory Coast': '🇨🇮', Cameroon: '🇨🇲', Algeria: '🇩🇿', Morocco: '🇲🇦',
  Nigeria: '🇳🇬', Ghana: '🇬🇭', Gabon: '🇬🇦', Guinea: '🇬🇳', Mali: '🇲🇱', Liberia: '🇱🇷',
  Colombia: '🇨🇴', Chile: '🇨🇱', Ecuador: '🇪🇨', Paraguay: '🇵🇾', Mexico: '🇲🇽', USA: '🇺🇸',
  Canada: '🇨🇦', Japan: '🇯🇵', 'South Korea': '🇰🇷', Australia: '🇦🇺',
  Austria: '🇦🇹',
  Serbia: '🇷🇸',
  Hungary: '🇭🇺',
  Greece: '🇬🇷',
  Peru: '🇵🇪',
  Venezuela: '🇻🇪',
  Tunisia: '🇹🇳',
  'DR Congo': '🇨🇩',
  Togo: '🇹🇬',
  Iran: '🇮🇷',
};

const RAW = `
Pelé|Brazil|ST,AM|SAN|3
Ronaldo Nazário|Brazil|ST|PSV BAR INT RMA MIL COR|3|R9;Ronaldo Luis Nazario;Ronaldo Nazario
Ronaldinho|Brazil|AM,LW,CM|GRE PSG BAR MIL FLA|3|Ronaldinho Gaucho
Rivaldo|Brazil|AM,LW,ST|COR PLM BAR MIL
Kaká|Brazil|AM,CM|SAO MIL RMA|3|Kaka
Roberto Carlos|Brazil|LB|PLM INT RMA FEN COR|2
Cafu|Brazil|RB|SAO PLM ROM MIL
Dani Alves|Brazil|RB|SEV BAR JUV PSG SAO|2|Daniel Alves
Neymar|Brazil|LW,ST,AM|SAN BAR PSG HIL|3|Neymar Jr;Neymar Junior
Thiago Silva|Brazil|CB|MIL PSG CHE
Casemiro|Brazil|DM|SAO RMA POR MUN
Fernandinho|Brazil|DM|SHA MCI
Philippe Coutinho|Brazil|AM,CM|INT LIV BAR BAY AVL|2
Roberto Firmino|Brazil|ST,AM|HOF LIV|2|Bobby Firmino
Alisson|Brazil|GK|ROM LIV|2|Alisson Becker
Ederson|Brazil|GK|BEN MCI|2
Gabriel Jesus|Brazil|ST,LW|PLM MCI ARS|2
Vinícius Júnior|Brazil|LW|FLA RMA|3|Vinicius Junior;Vinicius Jr;Vini Jr
Rodrygo|Brazil|RW,ST|SAN RMA|2|Rodrygo Goes
Raphinha|Brazil|RW,LW|SCP REN LEE BAR|2
Richarlison|Brazil|ST|EVE TOT|2
Marquinhos|Brazil|CB,DM|COR ROM PSG|2
Bruno Guimarães|Brazil|CM,DM|OL NEW|2|Bruno Guimaraes
Lucas Paquetá|Brazil|CM,AM|FLA MIL OL WHU|2|Lucas Paqueta
Éder Militão|Brazil|CB,RB|SAO POR RMA|2|Eder Militao
Gabriel Magalhães|Brazil|CB|LIL ARS|2|Gabriel Magalhaes;Gabriel
Gabriel Martinelli|Brazil|LW|ARS|2|Martinelli
Endrick|Brazil|ST|PLM RMA|2
Hulk|Brazil|RW,ST|POR ZEN|1|Givanildo Vieira de Souza
Robinho|Brazil|LW,ST|SAN RMA MCI MIL
Adriano|Brazil|ST|FLA INT FIO PAR ROM COR|2|Adriano Leite Ribeiro
Romário|Brazil|ST|PSV BAR VAL FLA|2|Romario
Dida|Brazil|GK|MIL COR|1
David Luiz|Brazil|CB,DM|BEN CHE PSG ARS FLA|2
Willian|Brazil|RW|COR SHA CHE ARS FUL|2
Oscar|Brazil|AM|SAO CHE|1
Ramires|Brazil|CM|BEN CHE|1
Filipe Luís|Brazil|LB|ATM CHE FLA|2|Filipe Luis
Lucas Moura|Brazil|RW|SAO PSG TOT|2
Fred|Brazil|CM|SHA MUN FEN|1
Anderson|Brazil|AM|POR MUN|1
Alex Sandro|Brazil|LB|POR JUV|1
Danilo|Brazil|RB|POR RMA MCI JUV|2
Douglas Costa|Brazil|LW,RW|SHA BAY JUV|1
Arthur Melo|Brazil|CM|GRE BAR JUV LIV|1|Arthur
Lionel Messi|Argentina|RW,AM,ST|BAR PSG MIA|3|Leo Messi
Diego Maradona|Argentina|AM,ST|BOC BAR NAP SEV|3
Sergio Agüero|Argentina|ST|ATM MCI|3|Sergio Aguero;Kun Aguero
Ángel Di María|Argentina|RW,LW,AM|BEN RMA MUN PSG JUV|2|Angel Di Maria;Di Maria
Carlos Tevez|Argentina|ST|BOC COR MUN MCI JUV|2|Carlitos Tevez
Gabriel Batistuta|Argentina|ST|BOC RIV FIO ROM INT|2|Batigol
Javier Zanetti|Argentina|RB,DM|INT|2
Hernán Crespo|Argentina|ST|RIV PAR LAZ INT CHE MIL|2|Hernan Crespo
Juan Román Riquelme|Argentina|AM|BOC BAR VIL|2|Juan Roman Riquelme;Riquelme
Javier Mascherano|Argentina|DM,CB|RIV WHU LIV BAR|2
Gonzalo Higuaín|Argentina|ST|RIV RMA NAP JUV MIL CHE MIA|2|Gonzalo Higuain;Pipita
Paulo Dybala|Argentina|AM,ST|JUV ROM|2
Lautaro Martínez|Argentina|ST|INT|2|Lautaro Martinez
Julián Álvarez|Argentina|ST|RIV MCI ATM|2|Julian Alvarez;Araña
Enzo Fernández|Argentina|CM|RIV BEN CHE|2|Enzo Fernandez
Alexis Mac Allister|Argentina|CM|BHA LIV|2|Mac Allister
Emiliano Martínez|Argentina|GK|ARS AVL|2|Emiliano Martinez;Dibu Martinez
Cristian Romero|Argentina|CB|JUV ATA TOT|2|Cuti Romero
Rodrigo De Paul|Argentina|CM|VAL ATM|1
Lisandro Martínez|Argentina|CB,LB|AJX MUN|2|Lisandro Martinez
Nicolás Otamendi|Argentina|CB|POR VAL MCI BEN|2|Nicolas Otamendi
Ezequiel Lavezzi|Argentina|RW,ST|NAP PSG|1
Pablo Aimar|Argentina|AM|RIV VAL BEN|1
Fernando Redondo|Argentina|DM|RMA MIL|1
Diego Simeone|Argentina|CM,DM|SEV ATM INT LAZ|1
Ángel Correa|Argentina|LW,RW|ATM|1|Angel Correa
Mauro Icardi|Argentina|ST|SAM INT PSG GAL|2
Marcos Rojo|Argentina|CB|SCP MUN|1
Papu Gómez|Argentina|AM|ATA SEV|1|Alejandro Gomez;Papu Gomez
Nahuel Molina|Argentina|RB|ATM|1
Marcos Acuña|Argentina|LB|SEV|1|Marcos Acuna
Leandro Paredes|Argentina|CM|ROM ZEN PSG JUV|1
Giovani Lo Celso|Argentina|CM|PSG BET TOT VIL|1
Alejandro Garnacho|Argentina|LW|MUN CHE|1|Garnacho
Exequiel Palacios|Argentina|CM|RIV LEV|1
Franco Mastantuono|Argentina|RW|RIV RMA|1
Luis Suárez|Uruguay|ST|AJX LIV BAR ATM MIA|3|Luis Suarez
Edinson Cavani|Uruguay|ST|NAP PSG MUN VAL BOC|2
Diego Forlán|Uruguay|ST|MUN VIL ATM INT|2|Diego Forlan
Diego Godín|Uruguay|CB|VIL ATM INT|2|Diego Godin
Federico Valverde|Uruguay|CM|RMA|2|Fede Valverde
Darwin Núñez|Uruguay|ST|BEN LIV HIL|2|Darwin Nunez
Ronald Araújo|Uruguay|CB|BAR|2|Ronald Araujo
Rodrigo Bentancur|Uruguay|CM|BOC JUV TOT|1
José María Giménez|Uruguay|CB|ATM|1|Jose Maria Gimenez
Fernando Muslera|Uruguay|GK|LAZ GAL|1
Manuel Neuer|Germany|GK|SCH BAY|3
Thomas Müller|Germany|AM,ST,RW|BAY|3|Thomas Muller
Toni Kroos|Germany|CM|BAY LEV RMA|3
Mesut Özil|Germany|AM|BRE RMA ARS FEN|2|Mesut Ozil
Miroslav Klose|Germany|ST|BRE BAY LAZ|2
Bastian Schweinsteiger|Germany|CM|BAY MUN|2
Philipp Lahm|Germany|RB,LB,DM|BAY STU|2
Michael Ballack|Germany|CM|LEV BAY CHE|2
Lothar Matthäus|Germany|CM,DM|GLA BAY INT|2|Lothar Matthaus
Jürgen Klinsmann|Germany|ST|STU MON INT TOT BAY SAM|2|Jurgen Klinsmann
Oliver Kahn|Germany|GK|BAY|2
Marco Reus|Germany|AM,LW|GLA BVB LAG|2
Mats Hummels|Germany|CB|BAY BVB ROM|2
Jérôme Boateng|Germany|CB|HSV MCI BAY|2|Jerome Boateng
Antonio Rüdiger|Germany|CB|STU ROM CHE RMA|2|Antonio Rudiger
Joshua Kimmich|Germany|RB,DM,CM|RBL BAY|2
Leroy Sané|Germany|LW,RW|SCH MCI BAY GAL|2|Leroy Sane
Kai Havertz|Germany|AM,ST|LEV CHE ARS|2
Timo Werner|Germany|ST|STU RBL CHE TOT|2
Serge Gnabry|Germany|RW|ARS BRE HOF BAY|2
İlkay Gündoğan|Germany|CM|BVB MCI BAR GAL|2|Ilkay Gundogan
Jamal Musiala|Germany|AM|BAY|2
Florian Wirtz|Germany|AM|LEV LIV|2
Marc-André ter Stegen|Germany|GK|GLA BAR|2|Ter Stegen
Lukas Podolski|Germany|ST,LW|BAY ARS INT GAL|2
Mario Götze|Germany|AM|BVB BAY PSV FRA|2|Mario Gotze
Julian Draxler|Germany|AM,LW|SCH WOB PSG|1
Niclas Füllkrug|Germany|ST|BRE BVB WHU MIL|1|Niclas Fullkrug
Emre Can|Germany|CM,DM|BAY LEV LIV JUV BVB|1
Franz Beckenbauer|Germany|CB,DM|BAY|2
Gerd Müller|Germany|ST|BAY|2|Gerd Muller
Iker Casillas|Spain|GK|RMA POR|3
Xavi|Spain|CM|BAR|3|Xavi Hernandez
Andrés Iniesta|Spain|CM|BAR|3|Andres Iniesta
Sergio Ramos|Spain|CB,RB|SEV RMA PSG|3
Gerard Piqué|Spain|CB|MUN BAR|2|Gerard Pique
Sergio Busquets|Spain|DM|BAR MIA|3
David Villa|Spain|ST|VAL BAR ATM|2
Fernando Torres|Spain|ST|ATM LIV CHE MIL|3|El Nino Torres
Raúl|Spain|ST|RMA SCH|2|Raul;Raul Gonzalez
Carles Puyol|Spain|CB|BAR|2
Cesc Fàbregas|Spain|CM,AM|ARS BAR CHE MON|2|Cesc Fabregas
David Silva|Spain|AM|VAL MCI RSO|2
Juan Mata|Spain|AM|VAL CHE MUN GAL|2
Xabi Alonso|Spain|CM,DM|RSO LIV RMA BAY|2
Jordi Alba|Spain|LB|VAL BAR MIA|2
Álvaro Morata|Spain|ST|RMA JUV CHE ATM MIL GAL|2|Alvaro Morata
Koke|Spain|CM|ATM|2
Isco|Spain|AM|VAL MAL RMA SEV BET|2
Thiago Alcântara|Spain|CM|BAR BAY LIV|2|Thiago Alcantara;Thiago
Pedri|Spain|CM|BAR|2
Gavi|Spain|CM|BAR|2
Rodri|Spain|DM|VIL ATM MCI|3
Lamine Yamal|Spain|RW|BAR|3
Nico Williams|Spain|LW|ATH|2
Dani Olmo|Spain|AM|RBL BAR|2
Unai Simón|Spain|GK|ATH|1|Unai Simon
David de Gea|Spain|GK|ATM MUN FIO|2|De Gea
Pepe Reina|Spain|GK|BAR VIL LIV NAP BAY MIL AVL LAZ|2
César Azpilicueta|Spain|RB,LB,CB|OM CHE ATM SEV|2|Cesar Azpilicueta;Azpi
Pedro|Spain|RW|BAR CHE ROM LAZ|2|Pedro Rodriguez
Jesús Navas|Spain|RW,RB|SEV MCI|1|Jesus Navas
Santi Cazorla|Spain|AM|VIL MAL ARS|2
Mikel Arteta|Spain|CM|PSG RAN RSO EVE ARS|1
Nacho Fernández|Spain|CB|RMA|1|Nacho
Dani Carvajal|Spain|RB|RMA LEV|2|Carvajal
Aymeric Laporte|Spain|CB|ATH MCI NAS|1
Marc Cucurella|Spain|LB|BHA CHE|1
Mikel Oyarzabal|Spain|LW,ST|RSO|1
Ferran Torres|Spain|RW,LW|VAL MCI BAR|1
Mikel Merino|Spain|CM|RSO NEW ARS|1
Martín Zubimendi|Spain|DM|RSO ARS|1|Martin Zubimendi
Diego Costa|Spain|ST|ATM CHE WOL|2
Álvaro Arbeloa|Spain|RB|LIV RMA|1|Alvaro Arbeloa
Fernando Llorente|Spain|ST|ATH JUV TOT|1
Ander Herrera|Spain|CM|ATH MUN PSG|1
Zinedine Zidane|France|AM,CM|JUV RMA|3|Zizou
Thierry Henry|France|ST,LW|MON JUV ARS BAR|3
Michel Platini|France|AM|JUV|2
Eric Cantona|France|ST,AM|OM LEE MUN|2
Patrick Vieira|France|DM,CM|MIL JUV ARS INT MCI|2
Didier Deschamps|France|DM|OM JUV CHE|1
Lilian Thuram|France|RB,CB|MON PAR JUV BAR|2
Marcel Desailly|France|CB,DM|OM MIL CHE|2
Fabien Barthez|France|GK|OM MON MUN|1
Franck Ribéry|France|LW|OM GAL BAY FIO|2|Franck Ribery
Karim Benzema|France|ST|OL RMA ITT|3
Antoine Griezmann|France|ST,AM,LW|RSO ATM BAR|3
Kylian Mbappé|France|ST,LW,RW|MON PSG RMA|3|Kylian Mbappe;Mbappe
Paul Pogba|France|CM|MUN JUV MON|3
N'Golo Kanté|France|DM,CM|LEI CHE ITT|3|Ngolo Kante;Kante
Raphaël Varane|France|CB|RMA MUN|2|Raphael Varane
Hugo Lloris|France|GK|OL TOT LAF|2
Olivier Giroud|France|ST|ARS CHE MIL LIL LAF|2
Samir Nasri|France|AM|OM ARS MCI SEV|2
Blaise Matuidi|France|CM|SAI PSG JUV MIA|1
Ousmane Dembélé|France|RW,LW|REN BVB BAR PSG|2|Ousmane Dembele
William Saliba|France|CB|SAI OM ARS|2
Aurélien Tchouaméni|France|DM|MON RMA|2|Aurelien Tchouameni
Eduardo Camavinga|France|CM,LB|REN RMA|2
Theo Hernández|France|LB|RMA MIL|2|Theo Hernandez
Lucas Hernández|France|LB,CB|ATM BAY PSG|1|Lucas Hernandez
Benjamin Pavard|France|RB,CB|STU BAY INT OM|1
Kingsley Coman|France|LW,RW|PSG JUV BAY|2
Adrien Rabiot|France|CM|PSG JUV OM|2
Dayot Upamecano|France|CB|RBS RBL BAY|1
Ibrahima Konaté|France|CB|RBL LIV|2|Ibrahima Konate
Mike Maignan|France|GK|LIL MIL|2
Michael Olise|France|RW|CRY BAY|2
Marcus Thuram|France|ST|GLA INT|2
Randal Kolo Muani|France|ST|FRA PSG JUV TOT|1
Bradley Barcola|France|LW|OL PSG|1
Youri Djorkaeff|France|AM|MON PSG INT|1
Robert Pirès|France|LW|OM ARS VIL|2|Robert Pires
Claude Makélélé|France|DM|OM RMA CHE PSG|2|Claude Makelele
David Trezeguet|France|ST|MON JUV|2
Nicolas Anelka|France|ST|PSG ARS RMA LIV MCI FEN CHE|2
Patrice Evra|France|LB|MON MUN JUV OM|2
Laurent Blanc|France|CB|BAR OM INT MUN|1
Dimitri Payet|France|AM|SAI LIL OM WHU|1
Harry Kane|England|ST|TOT LEI BAY|3
Wayne Rooney|England|ST,AM|EVE MUN|3
Steven Gerrard|England|CM|LIV LAG|3
Frank Lampard|England|CM|WHU CHE MCI|3
John Terry|England|CB|CHE AVL|2
David Beckham|England|RW,CM|MUN RMA MIL LAG PSG|3
Paul Scholes|England|CM|MUN|2
Michael Owen|England|ST|LIV RMA NEW MUN|2
Alan Shearer|England|ST|SOU BLB NEW|2
Gary Lineker|England|ST|LEI EVE BAR TOT|2
Paul Gascoigne|England|AM|NEW TOT LAZ RAN EVE|2|Gazza
Ashley Cole|England|LB|ARS CHE ROM LAG|2
Rio Ferdinand|England|CB|WHU LEE MUN|2
Sol Campbell|England|CB|TOT ARS|2
Jamie Carragher|England|CB|LIV|2
Peter Crouch|England|ST|AVL SOU LIV TOT|2
David Seaman|England|GK|ARS|1
Joe Hart|England|GK|MCI WHU CEL|2
Jordan Pickford|England|GK|SUN EVE|2
Raheem Sterling|England|LW,RW|LIV MCI CHE ARS|2
Marcus Rashford|England|LW,ST|MUN AVL BAR|2
Jack Grealish|England|LW,AM|AVL MCI EVE|2
Phil Foden|England|AM,LW|MCI|2
Jude Bellingham|England|CM,AM|BVB RMA|3
Bukayo Saka|England|RW|ARS|2
Declan Rice|England|DM,CM|WHU ARS|2
Trent Alexander-Arnold|England|RB|LIV RMA|2|Trent
Kyle Walker|England|RB|TOT AVL MCI MIL|2
John Stones|England|CB|EVE MCI|2
Harry Maguire|England|CB|LEI MUN|2
Luke Shaw|England|LB|SOU MUN|2
Jordan Henderson|England|CM|SUN LIV AJX|2
Kieran Trippier|England|RB|TOT ATM NEW|2
Jadon Sancho|England|RW,LW|MCI BVB MUN CHE|2
Mason Mount|England|AM,CM|CHE MUN|2
Cole Palmer|England|AM,RW|MCI CHE|2
Ollie Watkins|England|ST|AVL|2
Jamie Vardy|England|ST|LEI|2
Dele Alli|England|AM|TOT EVE|2
Eric Dier|England|CB,DM|SCP TOT BAY|1
Andy Cole|England|ST|NEW MUN BLB|2
Teddy Sheringham|England|ST|TOT MUN|1
Ian Wright|England|ST|CRY ARS|2
Michael Carrick|England|CM|WHU TOT MUN|2
Gareth Barry|England|CM|AVL MCI EVE|1
Kalvin Phillips|England|CM|LEE MCI WHU|1
James Maddison|England|AM|LEI TOT|2
Anthony Gordon|England|LW|EVE NEW|1
Conor Gallagher|England|CM|CHE CRY ATM TOT|1
Ben White|England|CB|BHA ARS|1
Reece James|England|RB|CHE|2
Danny Welbeck|England|ST|MUN SUN ARS BHA|1
Theo Walcott|England|RW|SOU ARS EVE|2
Jermain Defoe|England|ST|WHU TOT SUN|1
Robbie Fowler|England|ST|LIV LEE MCI|2
Cristiano Ronaldo|Portugal|ST,LW,RW|SCP MUN RMA JUV NAS|3|CR7;Ronaldo
Luís Figo|Portugal|RW|SCP BAR RMA INT|2|Luis Figo
Rui Costa|Portugal|AM|BEN FIO MIL|1
Deco|Portugal|AM,CM|POR BAR CHE|2
Pepe|Portugal|CB|POR RMA BES|2
Bruno Fernandes|Portugal|AM,CM|SAM SCP MUN|2
Bernardo Silva|Portugal|RW,AM,CM|BEN MON MCI|2
João Cancelo|Portugal|RB,LB|BEN VAL INT JUV MCI BAY BAR HIL|2|Joao Cancelo
Rúben Dias|Portugal|CB|BEN MCI|2|Ruben Dias
Diogo Jota|Portugal|LW,ST|POR WOL LIV|2
Rafael Leão|Portugal|LW|SCP LIL MIL|2|Rafael Leao
João Félix|Portugal|AM,ST|BEN ATM CHE BAR MIL NAS|2|Joao Felix
Vitinha|Portugal|CM|POR WOL PSG|2
Rúben Neves|Portugal|CM|POR WOL HIL|1|Ruben Neves
Ricardo Carvalho|Portugal|CB|POR CHE RMA MON|2
Nani|Portugal|LW,RW|SCP MUN VAL|2
João Moutinho|Portugal|CM|SCP POR MON WOL|1|Joao Moutinho
Renato Sanches|Portugal|CM|BEN BAY LIL PSG|1
Diogo Costa|Portugal|GK|POR|1
Rui Patrício|Portugal|GK|SCP WOL ROM ATA|1|Rui Patricio
Nuno Mendes|Portugal|LB|SCP PSG|1
Gonçalo Ramos|Portugal|ST|BEN PSG|1|Goncalo Ramos
João Neves|Portugal|CM|BEN PSG|1|Joao Neves
Pedro Neto|Portugal|RW|LAZ WOL CHE|1
Matheus Nunes|Portugal|CM|SCP WOL MCI|1
Danilo Pereira|Portugal|DM|POR PSG|1
Ricardo Quaresma|Portugal|RW|SCP BAR POR INT CHE BES|1
Johan Cruyff|Netherlands|AM,ST|AJX BAR|3
Marco van Basten|Netherlands|ST|AJX MIL|2
Ruud Gullit|Netherlands|AM,CM|PSV MIL SAM CHE|2
Frank Rijkaard|Netherlands|CM,DM|AJX MIL|1
Dennis Bergkamp|Netherlands|ST,AM|AJX INT ARS|2
Patrick Kluivert|Netherlands|ST|AJX MIL BAR NEW VAL PSV|2
Edgar Davids|Netherlands|CM|AJX MIL JUV BAR INT TOT|2
Clarence Seedorf|Netherlands|CM|AJX SAM RMA INT MIL|2
Ruud van Nistelrooy|Netherlands|ST|PSV MUN RMA HSV|2
Arjen Robben|Netherlands|RW|PSV CHE RMA BAY|3
Robin van Persie|Netherlands|ST|FEY ARS MUN FEN|2
Wesley Sneijder|Netherlands|AM|AJX RMA INT GAL|2
Rafael van der Vaart|Netherlands|AM|AJX HSV RMA TOT|2
Virgil van Dijk|Netherlands|CB|CEL SOU LIV|3
Frenkie de Jong|Netherlands|CM|AJX BAR|2
Matthijs de Ligt|Netherlands|CB|AJX JUV BAY MUN|2
Memphis Depay|Netherlands|LW,ST|PSV MUN OL BAR ATM|2|Memphis
Cody Gakpo|Netherlands|LW|PSV LIV|2
Georginio Wijnaldum|Netherlands|CM|PSV NEW LIV PSG|2
Denzel Dumfries|Netherlands|RB|PSV INT|1
Nathan Aké|Netherlands|CB|CHE MCI|1|Nathan Ake
Xavi Simons|Netherlands|AM|PSG PSV RBL TOT|1
Daley Blind|Netherlands|LB,CB,DM|AJX MUN|1
Jaap Stam|Netherlands|CB|PSV MUN LAZ MIL|2
Edwin van der Sar|Netherlands|GK|AJX JUV FUL MUN|2
Dirk Kuyt|Netherlands|ST,RW|FEY LIV FEN|2
Ronald Koeman|Netherlands|CB|AJX PSV BAR|2
Giovanni van Bronckhorst|Netherlands|LB|FEY RAN ARS BAR|1
Ryan Gravenberch|Netherlands|CM|AJX BAY LIV|2
Jurriën Timber|Netherlands|CB|AJX ARS|1|Jurrien Timber
Tijjani Reijnders|Netherlands|CM|MIL MCI|1
Paolo Maldini|Italy|LB,CB|MIL|3
Franco Baresi|Italy|CB|MIL|2
Alessandro Nesta|Italy|CB|LAZ MIL|2
Fabio Cannavaro|Italy|CB|NAP PAR INT JUV RMA|2
Gianluigi Buffon|Italy|GK|PAR JUV PSG|3|Gigi Buffon
Andrea Pirlo|Italy|CM,DM|INT MIL JUV|3
Francesco Totti|Italy|AM,ST|ROM|3
Alessandro Del Piero|Italy|AM,ST|JUV|3
Roberto Baggio|Italy|AM,ST|FIO JUV MIL INT|3
Gennaro Gattuso|Italy|CM,DM|RAN MIL|2|Rino Gattuso
Giorgio Chiellini|Italy|CB|FIO JUV LAF|2
Leonardo Bonucci|Italy|CB|JUV MIL|2
Daniele De Rossi|Italy|CM,DM|ROM BOC|2
Christian Vieri|Italy|ST|ATA JUV ATM LAZ INT MIL MON SAM FIO|2|Bobo Vieri
Filippo Inzaghi|Italy|ST|ATA JUV MIL|2|Pippo Inzaghi
Gianfranco Zola|Italy|AM|NAP PAR CHE|2
Mario Balotelli|Italy|ST|INT MCI MIL LIV OM|2
Ciro Immobile|Italy|ST|JUV BVB SEV LAZ BES|2
Federico Chiesa|Italy|RW,LW|FIO JUV LIV|2
Nicolò Barella|Italy|CM|INT|2|Nicolo Barella
Marco Verratti|Italy|CM|PSG|2
Jorginho|Italy|CM,DM|NAP CHE ARS|2
Gianluigi Donnarumma|Italy|GK|MIL PSG MCI|2|Gigio Donnarumma
Alessandro Bastoni|Italy|CB|ATA PAR INT|1
Federico Dimarco|Italy|LB|PAR INT|1
Sandro Tonali|Italy|CM|MIL NEW|1
Lorenzo Insigne|Italy|LW|NAP|1
Manuel Locatelli|Italy|CM|MIL JUV|1
Nicolò Zaniolo|Italy|AM|INT ROM GAL AVL ATA FIO|1|Nicolo Zaniolo
Giacomo Raspadori|Italy|ST,LW|NAP ATM|1
Gianluca Vialli|Italy|ST|SAM JUV CHE|2
Claudio Marchisio|Italy|CM|JUV|1
Antonio Cassano|Italy|AM,ST|ROM RMA SAM MIL INT PAR|1
Luca Toni|Italy|ST|FIO BAY ROM JUV|1
Kevin De Bruyne|Belgium|AM,CM|CHE WOB MCI NAP|3|KDB
Eden Hazard|Belgium|LW,AM|LIL CHE RMA|3
Romelu Lukaku|Belgium|ST|CHE EVE MUN INT ROM NAP|2
Thibaut Courtois|Belgium|GK|CHE ATM RMA|2
Vincent Kompany|Belgium|CB|HSV MCI|2
Jan Vertonghen|Belgium|CB|AJX TOT BEN|2
Toby Alderweireld|Belgium|CB|AJX ATM SOU TOT|2
Axel Witsel|Belgium|CM,DM|BEN ZEN BVB ATM|1
Dries Mertens|Belgium|LW,ST|PSV NAP GAL|2
Yannick Carrasco|Belgium|LW|MON ATM|1
Youri Tielemans|Belgium|CM|MON LEI AVL|1
Leandro Trossard|Belgium|LW|BHA ARS|1
Jérémy Doku|Belgium|LW|REN MCI|1|Jeremy Doku
Michy Batshuayi|Belgium|ST|OM CHE BVB VAL CRY GAL|1
Marouane Fellaini|Belgium|CM|EVE MUN|1
Nacer Chadli|Belgium|LW|TOT|1
Mousa Dembélé|Belgium|CM|FUL TOT AJX|1|Mousa Dembele
Simon Mignolet|Belgium|GK|SUN LIV|1
Amadou Onana|Belgium|DM|EVE AVL|1
Loïs Openda|Belgium|ST|RBL JUV|1|Lois Openda
Charles De Ketelaere|Belgium|AM|MIL ATA|1
Timothy Castagne|Belgium|RB|ATA LEI FUL|1
Luka Modrić|Croatia|CM|TOT RMA MIL|3|Luka Modric
Ivan Rakitić|Croatia|CM|SEV BAR|2|Ivan Rakitic
Mario Mandžukić|Croatia|ST|WOB BAY ATM JUV MIL|2|Mario Mandzukic
Ivan Perišić|Croatia|LW|BVB WOB BAY INT TOT|2|Ivan Perisic
Mateo Kovačić|Croatia|CM|INT RMA CHE MCI|2|Mateo Kovacic
Marcelo Brozović|Croatia|DM,CM|INT NAS|1|Marcelo Brozovic
Dejan Lovren|Croatia|CB|OL SOU LIV ZEN|1
Joško Gvardiol|Croatia|CB|RBL MCI|2|Josko Gvardiol
Davor Šuker|Croatia|ST|SEV RMA ARS WHU|2|Davor Suker
Zvonimir Boban|Croatia|AM|MIL|1
Andrej Kramarić|Croatia|ST|LEI HOF|1|Andrej Kramaric
Zlatan Ibrahimović|Sweden|ST|AJX JUV INT BAR MIL PSG MUN LAG|3|Zlatan Ibrahimovic;Zlatan
Erling Haaland|Norway|ST|RBS BVB MCI|3
Martin Ødegaard|Norway|AM,CM|RMA RSO ARS|2|Martin Odegaard
Henrik Larsson|Sweden|ST|FEY CEL BAR MUN|2
Fredrik Ljungberg|Sweden|RW|ARS WHU|2
Alexander Isak|Sweden|ST|BVB RSO NEW LIV|2
Dejan Kulusevski|Sweden|RW|ATA PAR JUV TOT|2
Viktor Gyökeres|Sweden|ST|BHA SCP ARS|2|Viktor Gyokeres
Emil Forsberg|Sweden|AM|RBL|1
Victor Lindelöf|Sweden|CB|BEN MUN|1|Victor Lindelof
Peter Schmeichel|Denmark|GK|MUN SCP AVL MCI|2
Christian Eriksen|Denmark|AM,CM|AJX TOT INT BRF MUN|2
Michael Laudrup|Denmark|AM|JUV BAR RMA AJX|2
Brian Laudrup|Denmark|LW,RW|BAY FIO MIL RAN CHE AJX|1
Pierre-Emile Højbjerg|Denmark|CM,DM|BAY SOU TOT OM|1|Pierre-Emile Hojbjerg;Hojbjerg
Rasmus Højlund|Denmark|ST|ATA NAP MUN|1|Rasmus Hojlund;Hojlund
Simon Kjær|Denmark|CB|WOB SEV MIL|1|Simon Kjaer
Ole Gunnar Solskjær|Norway|ST|MUN|2|Ole Gunnar Solskjaer;Solskjaer
John Arne Riise|Norway|LB|MON LIV ROM FUL|1
Robert Lewandowski|Poland|ST|BVB BAY BAR|3
Wojciech Szczęsny|Poland|GK|ARS ROM JUV BAR|2|Wojciech Szczesny
Piotr Zieliński|Poland|CM|NAP INT|1|Piotr Zielinski
Arkadiusz Milik|Poland|ST|AJX NAP OM JUV|1
Andriy Shevchenko|Ukraine|ST|MIL CHE|3
Oleksandr Zinchenko|Ukraine|LB,CM|MCI ARS|2
Mykhailo Mudryk|Ukraine|LW|SHA CHE|1
Artem Dovbyk|Ukraine|ST|ROM|1
Hristo Stoichkov|Bulgaria|ST|BAR|2
Dimitar Berbatov|Bulgaria|ST|LEV TOT MUN FUL|2
Pavel Nedvěd|Czech Republic|CM|LAZ JUV|2|Pavel Nedved
Petr Čech|Czech Republic|GK|REN CHE ARS|2|Petr Cech
Tomáš Rosický|Czech Republic|AM|BVB ARS|1|Tomas Rosicky
Edin Džeko|Bosnia|ST|WOB MCI ROM INT FEN|2|Edin Dzeko
Miralem Pjanić|Bosnia|CM|OL ROM JUV BAR|1|Miralem Pjanic
Xherdan Shaqiri|Switzerland|RW|BAY INT LIV|1
Granit Xhaka|Switzerland|CM|GLA ARS LEV|2
Manuel Akanji|Switzerland|CB|BVB MCI INT|1
Yann Sommer|Switzerland|GK|GLA BAY INT|1
Breel Embolo|Switzerland|ST|SCH GLA MON|1
Denis Zakaria|Switzerland|CM|GLA JUV CHE MON|1
Ricardo Rodríguez|Switzerland|LB|WOB MIL|1|Ricardo Rodriguez
Gheorghe Hagi|Romania|AM|RMA BAR GAL|2
Cristian Chivu|Romania|CB|AJX ROM INT|1
Arda Turan|Turkey|AM|ATM BAR GAL|1
Hakan Çalhanoğlu|Turkey|AM,CM|HSV LEV MIL INT|2|Hakan Calhanoglu
Arda Güler|Turkey|AM,RW|FEN RMA|2|Arda Guler
Kenan Yıldız|Turkey|LW|JUV|1|Kenan Yildiz
Merih Demiral|Turkey|CB|JUV ATA|1
Çağlar Söyüncü|Turkey|CB|LEI ATM FEN|1|Caglar Soyuncu
Ferdi Kadıoğlu|Turkey|LB|FEN BHA|1|Ferdi Kadioglu
Jan Oblak|Slovenia|GK|BEN ATM|2
Kenny Dalglish|Scotland|ST,AM|CEL LIV|2
Andy Robertson|Scotland|LB|LIV|2|Robbo
Scott McTominay|Scotland|CM|MUN NAP|2
John McGinn|Scotland|CM|AVL|1
Billy Gilmour|Scotland|CM|CHE BHA NAP|1
Kieran Tierney|Scotland|LB|CEL ARS RSO|1
Gareth Bale|Wales|LW,RW|SOU TOT RMA LAF|3
Ryan Giggs|Wales|LW|MUN|2
Aaron Ramsey|Wales|CM|ARS JUV|2
Ian Rush|Wales|ST|LIV JUV|2
Neco Williams|Wales|RB|LIV|1
Roy Keane|Ireland|CM|MUN CEL|2
Robbie Keane|Ireland|ST|WOL INT LEE TOT LIV CEL WHU AVL LAG|2
George Best|Northern Ireland|LW,RW|MUN|2
Mohamed Salah|Egypt|RW|CHE FIO ROM LIV|3|Mo Salah
Sadio Mané|Senegal|LW|RBS SOU LIV BAY NAS|3|Sadio Mane
Didier Drogba|Ivory Coast|ST|OM CHE GAL|3
Samuel Eto'o|Cameroon|ST|RMA BAR INT CHE EVE SAM|2|Samuel Etoo
Yaya Touré|Ivory Coast|CM|BAR MCI|2|Yaya Toure
Kolo Touré|Ivory Coast|CB|ARS MCI LIV|1|Kolo Toure
Riyad Mahrez|Algeria|RW|LEI MCI|2
Achraf Hakimi|Morocco|RB|RMA BVB INT PSG|2
Hakim Ziyech|Morocco|RW|AJX CHE GAL|1
Sofyan Amrabat|Morocco|DM|FIO MUN|1
Yassine Bounou|Morocco|GK|SEV|1|Bono
Youssef En-Nesyri|Morocco|ST|SEV FEN|1
Victor Osimhen|Nigeria|ST|LIL NAP GAL|2
Ademola Lookman|Nigeria|LW|EVE RBL ATA|1
Jay-Jay Okocha|Nigeria|AM|FRA PSG FEN|1
Nwankwo Kanu|Nigeria|ST|AJX INT ARS|1
Wilfried Zaha|Ivory Coast|LW,RW|CRY MUN GAL|1
Nicolas Pépé|Ivory Coast|RW|LIL ARS|1|Nicolas Pepe
Sébastien Haller|Ivory Coast|ST|FRA WHU AJX BVB|1|Sebastien Haller
Franck Kessié|Ivory Coast|CM|ATA MIL BAR|1|Franck Kessie
Serge Aurier|Ivory Coast|RB|PSG TOT|1
Eric Bailly|Ivory Coast|CB|VIL MUN|1
Thomas Partey|Ghana|CM,DM|ATM ARS|1
Michael Essien|Ghana|CM,DM|OL CHE RMA MIL|2
Mohammed Kudus|Ghana|AM,RW|AJX WHU TOT|1
Pierre-Emerick Aubameyang|Gabon|ST|MIL SAI BVB ARS BAR CHE OM|2|Aubameyang
Naby Keïta|Guinea|CM|RBS RBL LIV BRE|1|Naby Keita
Yves Bissouma|Mali|DM|BHA TOT|1
Wilfred Ndidi|Nigeria|DM|LEI|1
Kalidou Koulibaly|Senegal|CB|NAP CHE HIL|2
Édouard Mendy|Senegal|GK|REN CHE HIL|1|Edouard Mendy
Idrissa Gueye|Senegal|DM|AVL EVE PSG|1|Idrissa Gana Gueye
Ismaïla Sarr|Senegal|LW,RW|REN CRY|1|Ismaila Sarr
Nicolas Jackson|Senegal|ST|VIL CHE BAY|1
Bryan Mbeumo|Cameroon|RW|BRF MUN|1
Samuel Chukwueze|Nigeria|RW|VIL MIL|1
George Weah|Liberia|ST|MON PSG MIL CHE MCI OM|2
Luis Díaz|Colombia|LW|POR LIV BAY|2|Luis Diaz
James Rodríguez|Colombia|AM|POR MON RMA BAY EVE|2|James Rodriguez
Radamel Falcao|Colombia|ST|RIV POR ATM MON MUN CHE GAL|2|Falcao
Juan Cuadrado|Colombia|RW|FIO CHE JUV INT ATA|1
Yerry Mina|Colombia|CB|BAR EVE|1
Davinson Sánchez|Colombia|CB|AJX TOT GAL|1|Davinson Sanchez
Alexis Sánchez|Chile|LW,ST|RIV BAR ARS MUN INT OM SEV|2|Alexis Sanchez
Arturo Vidal|Chile|CM|LEV JUV BAY BAR INT FLA|2
Claudio Bravo|Chile|GK|RSO BAR MCI|1
Iván Zamorano|Chile|ST|SEV RMA INT|1|Ivan Zamorano
Enner Valencia|Ecuador|ST|WHU EVE FEN|1
Moisés Caicedo|Ecuador|DM|BHA CHE|2|Moises Caicedo
Piero Hincapié|Ecuador|CB|LEV ARS|1|Piero Hincapie
Roque Santa Cruz|Paraguay|ST|BAY BLB MCI|1
Hugo Sánchez|Mexico|ST|ATM RMA|1|Hugo Sanchez
Javier Hernández|Mexico|ST|MUN RMA LEV WHU LAG|2|Javier Hernandez;Chicharito
Rafael Márquez|Mexico|CB|MON BAR|1|Rafael Marquez
Hirving Lozano|Mexico|LW,RW|PSV NAP|1|Chucky Lozano
Raúl Jiménez|Mexico|ST|ATM BEN WOL FUL|1|Raul Jimenez
Edson Álvarez|Mexico|DM|AJX WHU|1|Edson Alvarez
Santiago Giménez|Mexico|ST|FEY MIL|1|Santiago Gimenez
Christian Pulisic|USA|LW,RW|BVB CHE MIL|2
Clint Dempsey|USA|AM,ST|FUL TOT|1
Tim Howard|USA|GK|MUN EVE|1
Landon Donovan|USA|LW,RW|LAG|1
Weston McKennie|USA|CM|SCH JUV LEE|1
Tyler Adams|USA|DM|RBL LEE|1
Timothy Weah|USA|LW,RW|PSG LIL JUV|1
Giovanni Reyna|USA|AM|BVB GLA|1
Alphonso Davies|Canada|LB|BAY|2
Jonathan David|Canada|ST|LIL JUV|1
Son Heung-min|South Korea|LW,ST|HSV LEV TOT LAF|3|Son;Heung-min Son
Kim Min-jae|South Korea|CB|NAP BAY|1
Park Ji-sung|South Korea|LW,RW|PSV MUN|2
Lee Kang-in|South Korea|AM|VAL PSG|1
Takefusa Kubo|Japan|RW|RMA VIL RSO|1
Kaoru Mitoma|Japan|LW|BHA|1
Takumi Minamino|Japan|AM|RBS LIV MON|1
Shinji Kagawa|Japan|AM|BVB MUN|1
Hidetoshi Nakata|Japan|AM|ROM PAR FIO|1
Keisuke Honda|Japan|AM|MIL|1
Maya Yoshida|Japan|CB|SOU|1
Wataru Endo|Japan|DM|STU LIV|1
Takehiro Tomiyasu|Japan|RB,CB|ARS|1
Tim Cahill|Australia|AM,ST|EVE|1
Harry Kewell|Australia|LW|LEE LIV GAL|1
Pau Cubarsí|Spain|CB|BAR|2|Cubarsi;Pau Cubarsi
Eric García|Spain|CB,DM|MCI BAR GIR|2|Eric Garcia
Alejandro Balde|Spain|LB|BAR|2|Balde
Fermín López|Spain|AM,CM|BAR|1|Fermin Lopez
Marc Casadó|Spain|DM|BAR|1|Marc Casado
Marc Bernal|Spain|DM|BAR|1
Iñigo Martínez|Spain|CB|RSO ATH BAR NAS|1|Inigo Martinez
Álex Baena|Spain|AM,LW|VIL ATM|1|Alex Baena
Pau Torres|Spain|CB|VIL AVL|1
Alejandro Grimaldo|Spain|LB|BEN LEV|2|Grimaldo
Dean Huijsen|Spain|CB|JUV BOU RMA|2|Huijsen
Ansu Fati|Spain|LW|BAR MON|1
Marc Guiu|Spain|ST|BAR CHE|1
Abde Ezzalzouli|Morocco|LW,RW|BAR OSA BET|1|Abde
Sergio Canales|Spain|AM|VAL RMA BET|1
Marcos Alonso|Spain|LB|FIO SUN CHE BAR|1
Dani Ceballos|Spain|CM|BET RMA ARS|1
Sergi Roberto|Spain|CM,RB|BAR|1
Rodrigo Moreno|Spain|ST|VAL LEE|1|Rodrigo
Marco Asensio|Spain|RW,AM|RMA PSG|2|Asensio
Alberto Moreno|Spain|LB|SEV LIV VIL|1
Gerard Moreno|Spain|ST|ESY VIL|1
Borja Iglesias|Spain|ST|BET|1
Joselu|Spain|ST|ESY STK NEW RMA|1
Bryan Gil|Spain|LW|SEV TOT|1
Fernando Hierro|Spain|CB,DM|RMA|1
Luis Enrique|Spain|CM,AM|RMA BAR|1
Guti|Spain|AM|RMA|1
Fernando Morientes|Spain|ST|RMA MON LIV VAL|1
Joaquín|Spain|RW|BET VAL FIO|1|Joaquin
Gaizka Mendieta|Spain|CM|VAL LAZ BAR MID|1
Pep Guardiola|Spain|DM|BAR ROM|1
Roberto Soldado|Spain|ST|RMA VAL TOT VIL|1
Nolito|Spain|RW|CLV MCI SEV VIL|1
Álvaro Negredo|Spain|ST|SEV MCI VAL|1|Alvaro Negredo
Rico Lewis|England|RB,CM|MCI|1
Morgan Rogers|England|AM,LW|AVL MID|2
Eberechi Eze|England|AM|CRY ARS|2
Marc Guéhi|England|CB|CRY CHE|2|Marc Guehi
Levi Colwill|England|CB|CHE BHA|1
Noni Madueke|England|RW|PSV CHE ARS|2
Curtis Jones|England|CM|LIV|1
Harvey Elliott|England|RW,AM|LIV AVL|1
Ivan Toney|England|ST|BRF AHL|2
Dominic Solanke|England|ST|BOU TOT CHE LIV|2
Jarrod Bowen|England|RW|WHU|2
James Ward-Prowse|England|CM|SOU WHU NFO|1
Callum Wilson|England|ST|BOU NEW WHU|1
Ross Barkley|England|CM,AM|EVE CHE AVL|1
Adam Wharton|England|CM|CRY|1
Ezri Konsa|England|CB|BRF AVL|1
Jarrad Branthwaite|England|CB|EVE|1
Morgan Gibbs-White|England|AM|WOL NFO|2
Kobbie Mainoo|England|CM|MUN|2
Jack Wilshere|England|CM|ARS BOU|1
Aaron Wan-Bissaka|England|RB|CRY MUN WHU|1
Fikayo Tomori|England|CB|CHE MIL|1
Ruben Loftus-Cheek|England|CM|CHE CRY MIL|1
Tammy Abraham|England|ST|CHE ROM MIL BES|2
Jesse Lingard|England|AM|MUN WHU NFO|1
Daniel Sturridge|England|ST|CHE LIV|1
Joe Cole|England|AM|WHU CHE LIV|1
Bobby Charlton|England|AM,CM|MUN|2
Bobby Moore|England|CB|WHU|1
Gordon Banks|England|GK|LEI STK|1
Kevin Keegan|England|ST|LIV HSV NEW|2
Peter Shilton|England|GK|LEI STK NFO SOU|1
Glenn Hoddle|England|AM|TOT MON|1
Bryan Robson|England|CM|WBA MUN|1
Gary Neville|England|RB|MUN|2
Phil Neville|England|RB,CM|MUN EVE|1
Steve McManaman|England|RW|LIV RMA MCI|1
Emile Heskey|England|ST|LEI LIV AVL|1
David James|England|GK|LIV AVL WHU MCI|1
Ledley King|England|CB|TOT|1
Wes Brown|England|CB|MUN SUN|1
Owen Hargreaves|England|DM|BAY MUN MCI|1
Scott Parker|England|CM|CHE NEW WHU TOT FUL|1
Rickie Lambert|England|ST|LIV SOU|1
Jermaine Jenas|England|CM|NEW TOT|1
Joey Barton|England|CM|MCI NEW OM|1
Micah Richards|England|CB|MCI AVL FIO|1
Stewart Downing|England|LW|MID AVL LIV WHU|1
Gabriel Agbonlahor|England|ST|AVL|1
Chris Sutton|England|ST|NOR BLB CHE CEL|1
Matt Le Tissier|England|AM|SOU|1
Les Ferdinand|England|ST|NEW TOT|1
Rayan Cherki|France|AM|OL MCI|2
Désiré Doué|France|RW,AM|REN PSG|2|Desire Doue
Warren Zaïre-Emery|France|CM|PSG|1|Warren Zaire-Emery
Jean-Philippe Mateta|France|ST|OL M05 CRY|1
Christopher Nkunku|France|AM,ST|PSG RBL CHE MIL|2
Jules Koundé|France|RB,CB|SEV CHE BAR|2|Jules Kounde
Malo Gusto|France|RB|OL CHE|1
Lucas Digne|France|LB|PSG ROM BAR EVE AVL|1
Ferland Mendy|France|LB|OL RMA|1
Moussa Diaby|France|RW|PSG LEV AVL ITT|1
Alexandre Lacazette|France|ST|OL ARS|2
Anthony Martial|France|ST,LW|MON MUN SEV|1
Presnel Kimpembe|France|CB|PSG|1
Mattéo Guendouzi|France|CM,DM|ARS OM LAZ|1|Matteo Guendouzi
Youssouf Fofana|France|CM|MON MIL|1
Manu Koné|France|CM|GLA ROM|1|Manu Kone
Wissam Ben Yedder|France|ST|SEV MON|1
Florian Thauvin|France|RW|OM NEW VAL|1
Hatem Ben Arfa|France|AM|OL OM NEW|1
Mathys Tel|France|ST|BAY TOT|1
Pascal Groß|Germany|CM|BHA BVB|1|Pascal Gross
Nico Schlotterbeck|Germany|CB|BVB|1
Jonathan Tah|Germany|CB|LEV BAY|1
Deniz Undav|Germany|ST|BHA STU|1
Leon Goretzka|Germany|CM|SCH BAY|2
Karim Adeyemi|Germany|LW,RW|RBS BVB|1
Niklas Süle|Germany|CB|HOF BAY BVB|1|Niklas Sule
Benedikt Höwedes|Germany|CB|SCH JUV|1|Benedikt Howedes
André Schürrle|Germany|LW|LEV CHE WOB BVB|1|Andre Schurrle
Mario Gómez|Germany|ST|STU BAY FIO BES WOB|2|Mario Gomez
Sami Khedira|Germany|CM|STU RMA JUV|2
Per Mertesacker|Germany|CB|BRE ARS|1
Julian Brandt|Germany|AM|LEV BVB|1
Riccardo Calafiori|Italy|CB,LB|BOL ARS|2
Gianluca Scamacca|Italy|ST|SAS WHU ATA|1
Mateo Retegui|Italy|ST|BOC GEN ATA|1
Federico Gatti|Italy|CB|JUV|1
Moise Kean|Italy|ST|JUV EVE PSG FIO|1
Destiny Udogie|Italy|LB|UDI TOT|1
Alessandro Florenzi|Italy|RB|ROM PSG MIL|1
Leonardo Spinazzola|Italy|LB|JUV ROM NAP|1
Domenico Berardi|Italy|RW|SAS|1
Matteo Politano|Italy|RW|INT NAP|1
Stephan El Shaarawy|Italy|LW|GEN MIL ROM|1
Andrea Belotti|Italy|ST|TOR ROM FIO|1
Emerson Palmieri|Italy|LB|ROM CHE OL|1|Emerson
Lorenzo Pellegrini|Italy|CM,AM|ROM|1
Federico Bernardeschi|Italy|RW|FIO JUV|1
Marco Materazzi|Italy|CB|INT|1
Gianluca Zambrotta|Italy|RB,LB|JUV BAR MIL|1
Gonçalo Inácio|Portugal|CB|SCP|1|Goncalo Inacio
António Silva|Portugal|CB|BEN|1|Antonio Silva
Francisco Conceição|Portugal|RW|POR JUV|1|Francisco Conceicao
Otávio|Portugal|AM,RW|POR NAS|1|Otavio
André Silva|Portugal|ST|POR MIL RBL SEV|1|Andre Silva
Eusébio|Portugal|ST|BEN|2|Eusebio
Brian Brobbey|Netherlands|ST|AJX|1
Joshua Zirkzee|Netherlands|ST|BAY BOL MUN|1
Steven Bergwijn|Netherlands|LW|PSV TOT AJX|1
Jeremie Frimpong|Netherlands|RB,RW|CEL LEV LIV|2
Micky van de Ven|Netherlands|CB|WOB TOT|1
Stefan de Vrij|Netherlands|CB|FEY LAZ INT|1
Teun Koopmeiners|Netherlands|CM|AZ ATA JUV|1
Donyell Malen|Netherlands|ST,RW|PSV ARS BVB AVL|1
Luuk de Jong|Netherlands|ST|PSV BAR|1
Klaas-Jan Huntelaar|Netherlands|ST|AJX RMA MIL SCH|1
Divock Origi|Belgium|ST|LIV MIL NFO|1
Thorgan Hazard|Belgium|LW|CHE GLA BVB|1
Leander Dendoncker|Belgium|DM|WOL AVL|1
Radja Nainggolan|Belgium|CM|ROM INT CAG|1
Ante Rebić|Croatia|LW|FRA MIL|1|Ante Rebic
Josip Stanišić|Croatia|RB|BAY LEV|1|Josip Stanisic
Nikola Vlašić|Croatia|AM|EVE WHU TOR|1|Nikola Vlasic
Dušan Vlahović|Serbia|ST|FIO JUV|2|Dusan Vlahovic
Aleksandar Mitrović|Serbia|ST|NEW FUL HIL|2|Aleksandar Mitrovic
Nemanja Vidić|Serbia|CB|MUN INT|2|Nemanja Vidic
Sergej Milinković-Savić|Serbia|CM|LAZ HIL|2|Sergej Milinkovic-Savic
Nikola Milenković|Serbia|CB|FIO NFO|1|Nikola Milenkovic
Dušan Tadić|Serbia|AM|AJX SOU FEN|1|Dusan Tadic
Branislav Ivanović|Serbia|RB|CHE ZEN|1|Branislav Ivanovic
Nemanja Matić|Serbia|DM|BEN CHE MUN ROM|1|Nemanja Matic
Luka Jović|Serbia|ST|RMA FIO MIL FRA|1|Luka Jovic
Adem Ljajić|Serbia|AM|FIO ROM INT FEN TOR|1|Adem Ljajic
Filip Kostić|Serbia|LW|FRA JUV|1|Filip Kostic
Dejan Stanković|Serbia|CM|INT LAZ|1|Dejan Stankovic
Predrag Mijatović|Serbia|ST|RMA VAL FIO|1|Predrag Mijatovic
David Alaba|Austria|CB,LB|BAY RMA|2
Marcel Sabitzer|Austria|CM|RBL BAY MUN BVB|1
Marko Arnautović|Austria|ST|INT BOL|1|Marko Arnautovic
Konrad Laimer|Austria|CM|RBL BAY|1
Kevin Danso|Austria|CB|LEN SOU TOT|1
Dominik Szoboszlai|Hungary|CM,AM|RBS RBL LIV|2
Péter Gulácsi|Hungary|GK|RBL|1|Peter Gulacsi
Kostas Manolas|Greece|CB|ROM NAP|1
Andreas Christensen|Denmark|CB|CHE BAR|1
Joakim Mæhle|Denmark|LB|ATA WOL|1|Joakim Maehle
Thomas Delaney|Denmark|CM|BVB|1
Mikkel Damsgaard|Denmark|AM|BRF|1
Jon Dahl Tomasson|Denmark|ST|FEY NEW MIL|1
Anthony Elanga|Sweden|RW|MUN NFO NEW|1
Sander Berge|Norway|CM|GNK FUL|1
Alexander Sørloth|Norway|ST|CRY RBL RSO VIL ATM|1|Alexander Sorloth
Joshua King|Norway|ST|MUN BLB BOU|1
Jakub Kiwior|Poland|CB|ARS|1
Matty Cash|Poland|RB|NFO AVL|1
Sebastian Szymański|Poland|AM|FEN|1|Sebastian Szymanski
Krzysztof Piątek|Poland|ST|MIL|1|Krzysztof Piatek
Jan Bednarek|Poland|CB|SOU|1
Łukasz Fabiański|Poland|GK|ARS WHU|1|Lukasz Fabianski
Jerzy Dudek|Poland|GK|LIV RMA|1
Vitaliy Mykolenko|Ukraine|LB|EVE|1
Georgiy Sudakov|Ukraine|AM|SHA BEN|1
Andriy Lunin|Ukraine|GK|RMA|1
Ruslan Malinovskyi|Ukraine|CM|ATA GEN|1
Andriy Yarmolenko|Ukraine|LW|WHU|1
Fabian Schär|Switzerland|CB|NEW|1|Fabian Schar
Remo Freuler|Switzerland|CM|ATA NFO BOL|1
Dan Ndoye|Switzerland|LW|BSL BOL NFO|1
Gregor Kobel|Switzerland|GK|BVB|1
Orkun Kökçü|Turkey|CM|FEY BEN|1|Orkun Kokcu
Zeki Çelik|Turkey|RB|ROM|1|Zeki Celik
Burak Yılmaz|Turkey|ST|LIL BES|1|Burak Yilmaz
Cengiz Ünder|Turkey|RW|ROM OM FEN|1|Cengiz Under
Ryan Christie|Scotland|AM|CEL BOU|1
Che Adams|Scotland|ST|SOU TOR|1
Aaron Hickey|Scotland|RB|BOL BRF|1
James Forrest|Scotland|RW|CEL|1
Craig Gordon|Scotland|GK|CEL|1
Darren Fletcher|Scotland|CM|MUN WBA|1
Denis Law|Scotland|ST|MCI TOR MUN|2
Daniel James|Wales|RW|MUN LEE FUL|1
Brennan Johnson|Wales|RW|NFO TOT CRY|1
Ethan Ampadu|Wales|CM,CB|CHE LEE|1
Harry Wilson|Wales|RW|LIV FUL|1
Kieffer Moore|Wales|ST|WOL BOU|1
Joe Allen|Wales|CM|LIV SWA STK|1
Ben Davies|Wales|LB|SWA TOT|1
Wayne Hennessey|Wales|GK|WOL CRY|1
Mark Hughes|Wales|ST|MUN BAR BAY CHE|1
Evan Ferguson|Ireland|ST|BHA|1
Caoimhín Kelleher|Ireland|GK|LIV BRF|1|Caoimhin Kelleher
Séamus Coleman|Ireland|RB|EVE|1|Seamus Coleman
Shane Long|Ireland|ST|SOU|1
Damien Duff|Ireland|LW|BLB CHE NEW FUL|1
John O'Shea|Ireland|CB|MUN SUN|1
Liam Brady|Ireland|AM|ARS JUV SAM INT|1
Amad Diallo|Ivory Coast|RW|ATA MUN|1|Amad
Wilfried Bony|Ivory Coast|ST|SWA MCI|1
Gervinho|Ivory Coast|LW|LIL ARS ROM|1
Iñaki Williams|Ghana|ST,RW|ATH|1|Inaki Williams
Jordan Ayew|Ghana|LW,ST|CRY LEI|1
André Ayew|Ghana|LW|OM SWA WHU|1|Andre Ayew
Cheikhou Kouyaté|Senegal|CM|WHU CRY|1|Cheikhou Kouyate
Pape Matar Sarr|Senegal|CM|TOT|1
Abdoulaye Doucouré|Mali|CM|EVE|1|Abdoulaye Doucoure
Mohamed Elneny|Egypt|CM|BSL ARS|1
Omar Marmoush|Egypt|ST,LW|WOB FRA MCI|2
Wahbi Khazri|Tunisia|AM|SAI SUN REN|1
Youcef Atal|Algeria|RB|NIC|1
Ismaël Bennacer|Algeria|CM|MIL|1|Ismael Bennacer
Saïd Benrahma|Algeria|LW|WHU OL|1|Said Benrahma
Noussair Mazraoui|Morocco|RB|AJX BAY MUN|1
Brahim Díaz|Morocco|AM|MCI RMA MIL|2|Brahim Diaz
Nayef Aguerd|Morocco|CB|WHU|1
Eric Maxim Choupo-Moting|Cameroon|ST|BAY PSG MUN|1|Choupo-Moting
André Onana|Cameroon|GK|AJX INT MUN|2|Andre Onana
Joël Matip|Cameroon|CB|SCH LIV|1|Joel Matip
Alex Song|Cameroon|DM|ARS BAR|1
Victor Boniface|Nigeria|ST|LEV|1
Alex Iwobi|Nigeria|LW,AM|ARS EVE FUL|1
Kelechi Iheanacho|Nigeria|ST|MCI LEI|1
Taiwo Awoniyi|Nigeria|ST|LIV UNI NFO|1
Calvin Bassey|Nigeria|LB,CB|RAN AJX FUL|1
John Obi Mikel|Nigeria|DM|CHE|1|Mikel Obi
Emmanuel Adebayor|Togo|ST|MON ARS MCI RMA TOT|1
Chancel Mbemba|DR Congo|CB|OM|1
Yoane Wissa|DR Congo|ST|BRF NEW|1
Serhou Guirassy|Guinea|ST|STU BVB|1
Antony|Brazil|RW|SAO AJX MUN BET|2
Savinho|Brazil|RW|GIR MCI|1
Estêvão|Brazil|RW|PLM CHE|1|Estevao
João Pedro|Brazil|ST|WAT BHA CHE|1|Joao Pedro
Matheus Cunha|Brazil|ST,AM|RBL ATM WOL MUN|2
Joelinton|Brazil|CM|NEW|1
Douglas Luiz|Brazil|CM|AVL JUV NFO|1
Andreas Pereira|Brazil|AM|MUN FUL|1
Emerson Royal|Brazil|RB|BAR TOT MIL|1
Bremer|Brazil|CB|TOR JUV|1|Gleison Bremer
João Gomes|Brazil|CM|FLA WOL|1|Joao Gomes
Gerson|Brazil|CM|ROM OM FLA|1
Alexandre Pato|Brazil|ST|MIL COR CHE|1|Pato
Luís Fabiano|Brazil|ST|POR SEV SAO|1|Luis Fabiano
Lucas Leiva|Brazil|DM,CM|GRE LIV LAZ|1
Diego|Brazil|AM|SAN POR BRE JUV WOB ATM FEN FLA|1|Diego Ribas
Gilberto Silva|Brazil|DM|ARS|1
Júlio César|Brazil|GK|FLA INT|1|Julio Cesar
Lúcio|Brazil|CB|BAY INT JUV|1|Lucio
Maicon|Brazil|RB|INT MCI ROM|1
Malcom|Brazil|RW|COR BAR ZEN|1
Thiago Almada|Argentina|AM|ATA OL|1
Nicolás González|Argentina|LW|STU FIO JUV ATM|1|Nico Gonzalez;Nicolas Gonzalez
Valentín Carboni|Argentina|AM|INT OM|1|Valentin Carboni
Giovanni Simeone|Argentina|ST|GEN FIO CAG NAP TOR|1
Matías Soulé|Argentina|AM|JUV ROM|1|Matias Soule
Roberto Pereyra|Argentina|CM|JUV UDI WAT|1
Éver Banega|Argentina|AM|SEV INT VAL|1|Ever Banega
Gonzalo Montiel|Argentina|RB|SEV|1
Lucas Ocampos|Argentina|LW|MON OM SEV|1
Walter Samuel|Argentina|CB|ROM RMA INT|1
Esteban Cambiasso|Argentina|CM,DM|RMA INT LEI|1
Juan Sebastián Verón|Argentina|CM|LAZ MUN CHE INT PAR|1|Juan Sebastian Veron
Gabriel Heinze|Argentina|LB|PSG MUN RMA OM|1
Manuel Ugarte|Uruguay|DM|SCP PSG MUN|1
Facundo Pellistri|Uruguay|RW|MUN|1
Álvaro Recoba|Uruguay|AM|INT PAR|1|Alvaro Recoba
Jhon Durán|Colombia|ST|AVL|1|Jhon Duran
Jefferson Lerma|Colombia|CM|CRY|1
Carlos Bacca|Colombia|ST|SEV MIL VIL|1
Duván Zapata|Colombia|ST|UDI NAP ATA TOR|1|Duvan Zapata
David Ospina|Colombia|GK|ARS NAP|1
Jackson Martínez|Colombia|ST|POR ATM|1|Jackson Martinez
Faustino Asprilla|Colombia|ST|PAR NEW|1
Marcelo Salas|Chile|ST|RIV LAZ JUV|1
Ben Brereton Díaz|Chile|ST|BLB VIL|1|Ben Brereton Diaz
Gary Medel|Chile|CB|SEV INT BES BOL|1
Paolo Guerrero|Peru|ST|BAY HSV COR FLA|1
Claudio Pizarro|Peru|ST|BRE BAY CHE|1
André Carrillo|Peru|RW|SCP BEN|1|Andre Carrillo
Salomón Rondón|Venezuela|ST|MAL ZEN WBA NEW EVE|1|Salomon Rondon
Miguel Almirón|Paraguay|AM|NEW|1|Miguel Almiron
Julio Enciso|Paraguay|AM|BHA|1
Kendry Páez|Ecuador|AM|CHE|1|Kendry Paez
Willian Pacho|Ecuador|CB|PSG|1|William Pacho
Antonio Valencia|Ecuador|RW,RB|MUN|1
Héctor Herrera|Mexico|CM|POR ATM|1|Hector Herrera
Andrés Guardado|Mexico|LW,CM|VAL BET|1|Andres Guardado
Carlos Vela|Mexico|LW,ST|ARS RSO LAF|1
Giovani dos Santos|Mexico|AM|BAR TOT|1
Sergiño Dest|USA|RB|AJX BAR MIL PSV|1|Sergino Dest
Ricardo Pepi|USA|ST|PSV|1
Folarin Balogun|USA|ST|ARS MON|1
Yunus Musah|USA|CM|VAL MIL|1
Brenden Aaronson|USA|AM|LEE UNI|1
Antonee Robinson|USA|LB|FUL|1
Brad Friedel|USA|GK|BLB AVL TOT LIV|1
Tajon Buchanan|Canada|RW|INT|1
Stephen Eustáquio|Canada|CM|POR|1|Stephen Eustaquio
Ritsu Doan|Japan|RW|FRA|1
Daichi Kamada|Japan|AM|FRA CRY LAZ|1
Hwang Hee-chan|South Korea|LW,ST|RBS WOL|1
Ki Sung-yueng|South Korea|CM|CEL SWA NEW|1
Mile Jedinak|Australia|DM|CRY|1
Mark Viduka|Australia|ST|CEL LEE MID|1
Mark Schwarzer|Australia|GK|MID FUL|1
Harry Souttar|Australia|CB|LEI STK|1
Mehdi Taremi|Iran|ST|POR INT|1
Sardar Azmoun|Iran|ST|LEV ROM|1
`;

function parse() {
  const list = [];
  const seen = new Set();
  for (const line of RAW.split('\n')) {
    const t = line.trim();
    if (!t) continue;
    const [name, nation, pos, clubs, fame, alias] = t.split('|');
    const positions = [];
    for (const p of pos.split(',')) {
      if (p === 'W') { positions.push('LW', 'RW'); } else positions.push(p);
    }
    const id = norm(name).replace(/ /g, '-');
    if (seen.has(id)) continue;
    seen.add(id);
    list.push({
      id, name, nation, positions,
      clubs: clubs.split(' ').filter(Boolean),
      fame: Number(fame) || 2,
      aliases: alias ? alias.split(';').map(s => s.trim()).filter(Boolean) : [],
    });
  }
  return list;
}

export function norm(s) {
  return String(s || '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/ø/g, 'o').replace(/ł/g, 'l').replace(/đ/g, 'd').replace(/ı/g, 'i')
    .replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
}

export const PLAYERS = parse();
for (const p of PLAYERS) {
  p._names = [p.name, ...p.aliases].map(norm);
  p._tokens = new Set(p._names.flatMap(n => n.split(' ')));
}
export const BY_ID = Object.fromEntries(PLAYERS.map(p => [p.id, p]));
export const NATIONS = [...new Set(PLAYERS.map(p => p.nation))].sort();

export function matches(p, crit) {
  if (crit.club && !p.clubs.includes(crit.club)) return false;
  if (crit.country && p.nation !== crit.country) return false;
  if (crit.pos && !p.positions.includes(crit.pos)) return false;
  return true;
}

export function findMatches(crit, usedIds = []) {
  const used = new Set(usedIds);
  return PLAYERS.filter(p => !used.has(p.id) && matches(p, crit));
}

// Resolve free text to a player. Returns {player} | {ambiguous:[...]} | {none:true}
export function resolve(text) {
  const q = norm(text);
  if (q.length < 2) return { none: true };
  const exact = PLAYERS.filter(p => p._names.includes(q));
  if (exact.length === 1) return { player: exact[0] };
  if (exact.length > 1) return { ambiguous: exact.slice(0, 6) };
  const qt = q.split(' ');
  let cand = PLAYERS.filter(p => qt.every(t => p._tokens.has(t)));
  if (cand.length === 0 && q.length >= 4) {
    cand = PLAYERS.filter(p => p._names.some(n => n.includes(q)));
  }
  if (cand.length === 1) return { player: cand[0] };
  if (cand.length > 1) return { ambiguous: cand.sort((a, b) => b.fame - a.fame).slice(0, 6) };
  return { none: true };
}

export function suggest(text, limit = 6) {
  const q = norm(text);
  if (q.length < 2) return [];
  const qt = q.split(' ');
  const scored = [];
  for (const p of PLAYERS) {
    let s = 0;
    for (const n of p._names) {
      if (n === q) s = Math.max(s, 100);
      else if (n.startsWith(q)) s = Math.max(s, 80);
      else if (n.split(' ').some(w => w.startsWith(q))) s = Math.max(s, 60);
      else if (qt.every(t => n.includes(t))) s = Math.max(s, 40);
    }
    if (s) scored.push([s + p.fame, p]);
  }
  return scored.sort((a, b) => b[0] - a[0]).slice(0, limit).map(x => x[1]);
}


// ======== PART 2: GAME RULES ========
// Trifecta rules engine. Pure state machine shared by the browser (solo / pass-and-play)
// and the Cloudflare Pages Function (online rooms). All functions mutate the state in place.

export const CFG = {
  ROUNDS: 10,
  ANSWER_MS: 45000,
  LOCAL_ANSWER_MS: 75000,
  BUZZ_MS: 15000,
  REVEAL_MS: 10000,
  MAX_EXTRA: 5,
  PICK_MS: 10000, // default time to choose a clue; 5000-10000 offered in the UI
};

export const ALL_SLOTS = ['club', 'country', 'pos'];

const ok = (extra = {}) => ({ ok: true, ...extra });
const err = (error, extra = {}) => ({ ok: false, error, ...extra });

export function slotsFor(n) {
  return n === 3 ? ['club', 'country', 'pos'] : ['club', 'country'];
}

export function newGame({ mode, players, rounds, pickMs }) {
  return {
    v: 0,
    mode, // 'ai' | 'local' | 'online'
    rounds: rounds || CFG.ROUNDS,
    n: players.length,
    players: players.map(p => ({ name: p.name ?? null, ai: !!p.ai, diff: p.diff || 'medium' })),
    scores: players.map(() => 0),
    round: 0,
    phase: 'lobby', // lobby | pick | answer | reveal | over
    slots: slotsFor(players.length),
    pickMs: Math.min(10000, Math.max(5000, pickMs || CFG.PICK_MS)),
    pickDeadline: 0, // 0 = timer not running (pass-and-play waits for the next player)
    pickTimedOut: false, // true once the clock ran out with someone still to choose
    turn: 0, // pass-and-play only: whose turn it is to choose
    claims: {}, // category -> player index who chose it this round
    crit: {},
    used: [],
    locked: [],
    holder: null,
    holderUntil: 0,
    deadline: 0,
    nextAt: 0,
    last: null,
    log: [],
    winners: null,
  };
}

export function startGame(s, now = Date.now()) {
  s.scores = s.players.map(() => 0);
  s.round = 0;
  s.used = [];
  s.log = [];
  s.winners = null;
  nextRound(s, now);
  return ok();
}

function nextRound(s, now) {
  s.round += 1;
  s.slots = ALL_SLOTS.slice();
  s.claims = {};
  s.turn = 0;
  s.pickTimedOut = false;
  s.pickDeadline = s.mode === 'local' ? 0 : now + s.pickMs;
  s.crit = {};
  s.locked = [];
  s.holder = null;
  s.holderUntil = 0;
  s.deadline = 0;
  s.nextAt = 0;
  s.last = null;
  s.phase = 'pick';
}

const POOLS = { club: () => Object.keys(CLUBS), country: () => NATIONS, pos: () => POSITIONS };

// Everyone picks at the same time (except pass-and-play, where players go one after another).
// Each player claims one category (club, country or position) and names a value for it.
export function pick(s, who, slot, value, now = Date.now()) {
  if (s.phase !== 'pick') return err('phase');
  if (!ALL_SLOTS.includes(slot)) return err('slot');
  if (!POOLS[slot]().includes(value)) return err('invalid');
  if (s.mode === 'local') {
    if (s.turn !== who) return err('notyourturn');
    if (!s.pickDeadline) return err('notstarted');
  }
  if (s.claims[slot] !== undefined && s.claims[slot] !== who) return err('taken');
  const oldClaims = { ...s.claims };
  const oldCrit = { ...s.crit };
  for (const k of ALL_SLOTS) if (s.claims[k] === who) { delete s.claims[k]; delete s.crit[k]; }
  s.claims[slot] = who;
  s.crit[slot] = value;
  if (findMatches(s.crit, s.used).length === 0) {
    s.claims = oldClaims;
    s.crit = oldCrit;
    return err('nobody');
  }
  afterPick(s, now);
  return ok();
}

function startAnswer(s, now) {
  s.slots = ALL_SLOTS.filter(k => s.crit[k]);
  s.phase = 'answer';
  s.pickTimedOut = false;
  s.pickDeadline = 0;
  s.deadline = now + (s.mode === 'local' ? CFG.LOCAL_ANSWER_MS : CFG.ANSWER_MS);
}

function afterPick(s, now) {
  if (s.mode === 'local') {
    s.turn += 1;
    s.pickTimedOut = false;
    s.pickDeadline = 0;
    if (s.turn >= s.n) startAnswer(s, now);
  } else if (Object.keys(s.claims).length >= s.n) {
    startAnswer(s, now);
  }
}

// Pass-and-play: start the clock once the right player has taken the device.
export function startTurn(s, who, now = Date.now()) {
  if (s.phase !== 'pick' || s.mode !== 'local' || s.turn !== who || s.pickDeadline) return err('phase');
  s.pickDeadline = now + s.pickMs;
  return ok();
}

// The clock ran out with someone still to choose: restart the countdown so they can try again.
export function redoPick(s, who, now = Date.now()) {
  if (s.phase !== 'pick' || !s.pickTimedOut) return err('phase');
  s.pickTimedOut = false;
  s.pickDeadline = now + s.pickMs;
  return ok();
}

// After time is up, anyone can choose to give the missing clue(s) a random pick instead of restarting.
export function fillRandom(s, now = Date.now()) {
  if (s.phase !== 'pick' || !s.pickTimedOut) return err('phase');
  const claimed = i => Object.values(s.claims).includes(i);
  if (s.mode === 'local') {
    if (!claimed(s.turn)) fillOne(s, s.turn);
    afterPick(s, now);
  } else {
    const missing = Array.from({ length: s.n }, (_, i) => i).filter(i => !claimed(i)).sort(() => Math.random() - 0.5);
    for (const i of missing) fillOne(s, i);
    startAnswer(s, now);
  }
  return ok();
}

// Someone ran out of time: give them a random unclaimed category with a value that keeps the round playable.
function fillOne(s, who) {
  const free = ALL_SLOTS.filter(k => s.claims[k] === undefined);
  if (!free.length) return;
  const slot = choice(free);
  const value = aiChoose(s, slot);
  s.claims[slot] = who;
  s.crit[slot] = value;
}

// Computer player picks a random free category with a sensible value.
export function aiPick(s, who, now = Date.now()) {
  for (let t = 0; t < 25; t++) {
    const free = ALL_SLOTS.filter(k => s.claims[k] === undefined || s.claims[k] === who);
    if (!free.length) return err('taken');
    const slot = choice(free);
    const r = pick(s, who, slot, aiChoose(s, slot), now);
    if (r.ok) return r;
  }
  return err('nobody');
}

export function buzz(s, who, now = Date.now()) {
  if (s.phase !== 'answer') return err('phase');
  if (s.locked.includes(who)) return err('locked');
  if (s.holder !== null) return err('held');
  s.holder = who;
  s.holderUntil = now + CFG.BUZZ_MS;
  return ok();
}

function lock(s, who, now) {
  if (!s.locked.includes(who)) s.locked.push(who);
  if (s.holder === who) { s.holder = null; s.holderUntil = 0; }
  if (s.locked.length >= s.n) endRound(s, null, 'allwrong', null, now);
}

function endRound(s, winner, reason, player, now) {
  const examples = findMatches(s.crit, s.used.filter(id => id !== player?.id))
    .filter(p => p.id !== player?.id)
    .sort((a, b) => b.fame - a.fame)
    .slice(0, 5)
    .map(p => p.id);
  if (winner !== null && player) {
    s.scores[winner] += 1;
    s.used.push(player.id);
  }
  s.last = { round: s.round, winner, reason, playerId: player ? player.id : null, crit: { ...s.crit }, examples };
  s.log.push({ round: s.round, winner, playerId: player ? player.id : null, crit: { ...s.crit } });
  s.phase = 'reveal';
  s.holder = null;
  s.nextAt = now + CFG.REVEAL_MS;
}

// input: {id} or {text}
export function answer(s, who, input, now = Date.now()) {
  if (s.phase !== 'answer') return err('late');
  if (s.locked.includes(who)) return err('locked');
  if (s.holder !== who) return err('nobuzz');
  let p = null;
  if (input && input.id) p = BY_ID[input.id] || null;
  else {
    const r = resolve(input?.text || '');
    if (r.ambiguous) return err('ambiguous', { options: r.ambiguous.map(x => x.id) });
    p = r.player || null;
  }
  if (!p) return err('notfound');
  if (s.used.includes(p.id)) return err('used');
  if (matches(p, s.crit)) {
    endRound(s, who, 'correct', p, now);
    return ok({ correct: true, playerId: p.id });
  }
  lock(s, who, now);
  return ok({ correct: false, playerId: p.id });
}

export function skip(s, who, now = Date.now()) {
  if (s.phase !== 'answer') return err('phase');
  if (s.locked.includes(who)) return err('locked');
  lock(s, who, now);
  return ok();
}

export function next(s, now = Date.now()) {
  if (s.phase !== 'reveal') return err('phase');
  advance(s, now);
  return ok();
}

function leaders(s) {
  const top = Math.max(...s.scores);
  return s.scores.map((x, i) => (x === top ? i : -1)).filter(i => i >= 0);
}

function advance(s, now) {
  if (s.round >= s.rounds) {
    const l = leaders(s);
    if (l.length > 1 && s.round < s.rounds + CFG.MAX_EXTRA) return nextRound(s, now);
    s.winners = l;
    s.phase = 'over';
    return;
  }
  nextRound(s, now);
}

// Time-based transitions. Returns true when state changed.
export function tick(s, now = Date.now()) {
  if (s.phase === 'pick' && s.pickDeadline && !s.pickTimedOut && now >= s.pickDeadline) {
    s.pickTimedOut = true;
    return true;
  }
  if (s.phase === 'answer') {
    if (now >= s.deadline) { endRound(s, null, 'timeout', null, now); return true; }
    if (s.holder !== null && now >= s.holderUntil) { lock(s, s.holder, now); return true; }
  } else if (s.phase === 'reveal') {
    if (now >= s.nextAt) { advance(s, now); return true; }
  }
  return false;
}

export function inSuddenDeath(s) {
  return s.round > s.rounds;
}

// ---------- computer players ----------
const rnd = (a, b) => a + Math.random() * (b - a);
const choice = arr => arr[Math.floor(Math.random() * arr.length)];

export function aiChoose(s, slot) {
  const others = { ...s.crit };
  delete others[slot];
  const pool = POOLS[slot]();
  const scored = pool.map(v => ({ v, n: findMatches({ ...others, [slot]: v }, s.used).length }));
  let good = scored.filter(x => x.n >= 1);
  if (!good.length) good = scored;
  const otherCount = Object.keys(others).length;
  const diff = s.players.find(p => p.ai)?.diff || 'medium';
  if (otherCount === 0) {
    // nothing else known yet: choose something with a healthy pool so the round is playable
    const big = good.filter(x => x.n >= (slot === 'pos' ? 20 : slot === 'club' ? 8 : 6));
    return choice(big.length ? big : good).v;
  }
  good.sort((a, b) => a.n - b.n);
  if (diff === 'hard') return choice(good.slice(0, Math.max(1, Math.ceil(good.length / 3)))).v;
  return choice(good).v;
}

const KNOW = {
  easy: { 1: 0.12, 2: 0.4, 3: 0.85 },
  medium: { 1: 0.3, 2: 0.65, 3: 0.95 },
  hard: { 1: 0.6, 2: 0.88, 3: 1 },
};
const DELAY = { easy: [9000, 24000], medium: [5500, 15000], hard: [2500, 8500] };
const BLUNDER = { easy: 0.12, medium: 0.05, hard: 0.02 };

// Decide what a computer player will say and when. Returns {id, at, wrong} or null.
export function aiPlan(s, idx, now = Date.now()) {
  const diff = s.players[idx].diff || 'medium';
  const cands = findMatches(s.crit, s.used);
  const known = cands.filter(c => Math.random() < KNOW[diff][c.fame]);
  if (!known.length) return null;
  const [lo, hi] = DELAY[diff];
  const at = now + rnd(lo, hi);
  if (Math.random() < BLUNDER[diff]) {
    const near = PLAYERS.filter(p => !s.used.includes(p.id) && !matches(p, s.crit) &&
      Object.entries(s.crit).some(([k, v]) => matches(p, { [k]: v })));
    if (near.length) return { id: choice(near).id, at, wrong: true };
  }
  return { id: choice(known).id, at, wrong: false };
}

export function leadersOf(s) {
  return leaders(s);
}
