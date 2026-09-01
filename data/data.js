/* ==========================================================================
   Dades — Anàlisi del pressupost públic de Masquefa
   Font: Treball de Recerca "Anàlisi d'un pressupost públic" (Víctor M.A., Institut de Masquefa, 2025-2027) + Enquesta d'opinió pròpia (n=141)
   ========================================================================== */

const BUDGET = {
  years: [2024, 2025, 2026],
  totalIncome: { 2024: 16750872.97, 2025: 16185901.83, 2026: 17340448.83 },
  totalExpense: { 2024: 16750872.97, 2025: 16185901.83, 2026: 17340448.83 },
  debtRatio: { 2024: 62, 2025: 45, 2026: 43 }, // % endeutament, límit legal 75%

  incomeChapters: {
    labels: [
      "Cap. 1 · Impostos directes",
      "Cap. 2 · Impostos indirectes",
      "Cap. 3 · Taxes i preus públics",
      "Cap. 4 · Transferències corrents",
      "Cap. 5 · Ingressos patrimonials",
      "Cap. 6 · Alienació d'inversions",
      "Cap. 7 · Transferències de capital",
      "Cap. 8 · Actius financers",
      "Cap. 9 · Passius financers (crèdit)"
    ],
    short: ["Imp. directes","Imp. indirectes","Taxes i preus","Transf. corrents","Ing. patrimonials","Alienació inv.","Transf. capital","Actius fin.","Passius fin."],
    2024: [5178289.23, 650000, 3959590.50, 3724914.61, 250851.39, 0, 1187842.62, 22000, 1777384.62],
    2025: [5707470.28, 432000, 3871088.97, 3892902.10, 261129.33, 196500, 1001931.93, 25000, 797879.22],
    2026: [5852527.06, 332000, 3711572.28, 4271673.32, 204642.65, 0, 1913004.98, 35000, 1020028.54]
  },

  expenseChapters: {
    labels: [
      "Cap. 1 · Personal",
      "Cap. 2 · Béns corrents i serveis",
      "Cap. 3 · Despeses financeres",
      "Cap. 4 · Transferències corrents",
      "Cap. 6 · Inversions reals",
      "Cap. 7 · Transferències de capital",
      "Cap. 8 · Actius financers",
      "Cap. 9 · Passius financers (amortització)"
    ],
    short: ["Personal","Béns i serveis","Desp. financeres","Transf. corrents","Inversions reals","Transf. capital","Actius fin.","Passius fin."],
    2024: [4633012.65, 6649868.84, 217850, 614314.24, 3610227.24, 15000, 22000, 988600],
    2025: [4933908.95, 7041803.64, 235359.35, 673118.00, 2384701.15, 25000, 25000, 892010.74],
    2026: [4936035.77, 7417579.05, 144931.91, 719948.99, 2969533.52, 25000, 35000, 1092419.59]
  },

  expenseSharePct: {
    2024: { personal: 27.66, bens: 39.70, financeres: 1.30, transfCorrents: 3.67, inversions: 21.55, transfCapital: 0.09, actius: 0.13, passius: 5.90 },
    2025: { personal: 30.49, bens: 43.51, financeres: 1.45, transfCorrents: 4.16, inversions: 14.74, transfCapital: 0.15, actius: 0.15, passius: 5.51 },
    2026: { personal: 28.47, bens: 42.78, financeres: 0.84, transfCorrents: 4.15, inversions: 17.12, transfCapital: 0.14, actius: 0.20, passius: 6.30 }
  },

  areas: {
    educacio: {
      label: "Educació",
      capitalSocial: { 2024: 1158349.21, 2025: 1300000, 2026: 1389721.16 },
      growth2426: 19.98,
      highlights: {
        2024: ["Neteja de centres educatius: 350.000 €", "Serveis especialitzats contractats: 527.736,63 €", "Inversions en centres: 81.500 €", "Beques menjador: 4.000 €"],
        2025: ["Neteja d'edificis escolars: 385.000 €", "Altres treballs externs: +590.000 €", "Inversions en centres: 43.000 €"],
        2026: ["Neteja de centres: 438.209,58 €", "Serveis especialitzats (nucli): 624.238,40 €", "Manteniment escola de la Beguda: 207.151,41 €", "Camins escolars segurs i sostenibles: 30.000 €", "Nova Escola de Música: +50.000 €/any", "Beques menjador: 5.600 €"]
      }
    },
    sanitat: {
      label: "Sanitat i benestar",
      capitalSocial: { 2024: 511955.24, 2025: 550000, 2026: 1222622.85 },
      growth2426: 138.82,
      highlights: {
        2024: ["Assistència social primària: 645.183,58 €", "Centre de Dia (CDDIA): +300.000 €", "Salut Pública (assignació directa): 6.250 €"],
        2025: ["Projecte del nou Centre de Dia: 30.000 €", "Ajuts pobresa energètica (Consell Comarcal): 27.400 €", "Prevenció de la legionel·la: 10.890 €"],
        2026: ["Nou Centre de Dia / Atenció a la Gent Gran: 700.000 € (d'un total de 2,1 M€)", "Ajuts a l'IBI: 37.000 €", "Ajuts directes Serveis Socials: 46.356,79 €", "Beques infants en risc social: 35.000 €", "Pobresa energètica: 20.000 €"]
      }
    },
    seguretat: {
      label: "Seguretat",
      capitalSocial: { 2024: 1171364.01, 2025: 1300000, 2026: 1159150 },
      growth2426: -1.04,
      highlights: {
        2024: ["Radar de control de trànsit: 54.450 €", "Càmeres de vigilància: 14.000 €", "Renovació d'armament: 10.000 €", "Protecció Civil: 25.000 € · ADF: 9.000 €"],
        2025: ["Pla d'inversions: 21.500 €", "Canvi d'armes: 10.000 €", "DEA portàtil: 2.000 €", "Protecció Civil: 30.000 € · ADF: 10.000 €"],
        2026: ["Nova plaça de sergent + 22.000 € en gratificacions", "Projecte \"Smart Vila\": 18.150 € en càmeres + 18.150 € en claus intel·ligents", "Franges perimetrals contra incendis: 100.000 €", "Protecció Civil: 30.000 € · ADF: 10.000 €"]
      }
    }
  }
};

/* ==========================================================================
   Enquesta d'opinió — n = 141 respostes
   ========================================================================== */

const SURVEY = {
  n: 141,
  age: { "Menys de 18": 16, "18 - 24": 9, "25 - 34": 22, "35 - 44": 52, "45 - 54": 33, "55 - 65": 5, "Més de 65": 4 },
  gender: { "Femení": 83, "Masculí": 54, "Altre": 4 },

  perceivedInvestment: {
    "Cultura": 73, "Serveis Territorials": 49, "Comunicació": 37, "Gent Gran": 35,
    "Esports": 30, "Seguretat i Prevenció": 28, "Educació": 22, "Promoció Econòmica": 22,
    "Benestar Social i Família": 19, "Participació Ciutadana": 18, "Serveis Personals": 15,
    "Joventut": 12, "Salut Pública": 10, "Oficina Atenció Vilatà": 8
  },

  desiredInvestment: {
    "Salut Pública": 90, "Educació": 76, "Seguretat i Prevenció": 64, "Benestar Social i Família": 54,
    "Joventut": 33, "Esports": 30, "Gent Gran": 24, "Serveis Territorials": 17, "Cultura": 10,
    "Serveis Personals": 7, "Participació Ciutadana": 6, "Oficina Atenció Vilatà": 6,
    "Comunicació": 6, "Promoció Econòmica": 5
  },

  taxValue: {
    "Molt dolenta: Els impostos són elevats i els serveis deficients.": 36,
    "Dolenta: Pago molts impostos per la poca qualitat dels serveis.": 63,
    "Equilibrada: El servei correspon al que pago.": 38,
    "bona: Rebo més del que pago en serveis.": 1,
    "Molt bona: Rebo bastant més del que pago en serveis.": 1
  },

  infoChannel: {
    "Canals oficials (web, xarxes de l'Ajuntament, revista local, plens...)": 96,
    "No rebo ni busco informació sobre el pressupost": 22,
    "Mitjans de comunicació locals o premsa": 14,
    "Converses amb veïns, familiars o amics": 9
  },

  transparencyScore: { 1: 26, 2: 33, 3: 59, 4: 18, 5: 4 },
  transparencyAvg: 2.58,

  leastPainfulToCut: {
    "Comunicació": 34, "Cultura": 21, "Serveis Personals": 15, "Serveis Territorials": 13,
    "Participació Ciutadana": 11, "Esports": 10, "Oficina Atenció Vilatà": 9, "Promoció Econòmica": 8,
    "Gent Gran": 6, "Seguretat i Prevenció": 4, "Joventut": 3, "Benestar Social i Família": 3,
    "Salut Pública": 2, "Educació": 1
  },

  urgentThemes: {
    "Instal·lacions i manteniment esportiu (CEM, pavelló)": 17,
    "Passarel·la / pont del Maset": 14,
    "Neteja i manteniment de les urbanitzacions": 11,
    "Nou institut / ampliació Font del Roure": 10,
    "Seguretat ciutadana": 10,
    "Atenció al CAP / salut pública": 7,
    "Parcs infantils": 5,
    "Residència / atenció a la gent gran": 3
  },

  overfundedTheme: {
    "Cultura i festes majors": 20,
    "Cap àrea / pressupost ben repartit": 6,
    "Gent gran": 3,
    "Comunicació": 2
  }
};

/* Comparativa directa: les tres úniques àrees on disposem alhora de dada
   real (creixement pressupostari 2024→2026) i dada de percepció (enquesta) */
const COMPARISON = [
  {
    key: "salut",
    label: "Salut Pública / Sanitat",
    wantMore: 90, wantMorePct: Math.round((90/141)*1000)/10,
    perceivedNow: 10, perceivedNowPct: Math.round((10/141)*1000)/10,
    realGrowth: 138.82
  },
  {
    key: "educacio",
    label: "Educació",
    wantMore: 76, wantMorePct: Math.round((76/141)*1000)/10,
    perceivedNow: 22, perceivedNowPct: Math.round((22/141)*1000)/10,
    realGrowth: 19.98
  },
  {
    key: "seguretat",
    label: "Seguretat i Prevenció",
    wantMore: 64, wantMorePct: Math.round((64/141)*1000)/10,
    perceivedNow: 28, perceivedNowPct: Math.round((28/141)*1000)/10,
    realGrowth: -1.04
  }
];

const MUNICIPI = {
  nom: "Masquefa",
  comarca: "Anoia, Barcelona",
  habitants: 10330,
  creixementAnual: "200–225 persones/any",
  atur: 8.2
};
