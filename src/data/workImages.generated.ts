export const workImagesByFolder = {
  "business-printing": [],
  "dtf": [
    "/images/dtf/dtf-main2.png",
    "/images/dtf/service-dtf-transfers.png"
  ],
  "emb": [
    "/images/emb/emb-jeff.jpg",
    "/images/emb/emb.png"
  ],
  "screen-printing": [
    "/images/screen-printing/2026-03-19%2016.25.30.jpg",
    "/images/screen-printing/2026-05-01%2014.02.47.jpg",
    "/images/screen-printing/2026-05-29%2017.52.27.jpg",
    "/images/screen-printing/438108615_1000197211906445_731713809547531031_n.jpg",
    "/images/screen-printing/448474393_1040283671231132_424779583664119723_n.jpg",
    "/images/screen-printing/481321854_1239895151269982_1488832230058542527_n.jpg",
    "/images/screen-printing/481999226_1239690291290468_4653975967093936796_n.jpg",
    "/images/screen-printing/496482338_18505561216009873_4698579137060342844_n.jpg",
    "/images/screen-printing/503723012_18520106737009873_8299786895107006739_n.jpg",
    "/images/screen-printing/527254628_18521751232009873_3821642175515511339_n.jpg",
    "/images/screen-printing/528689557_18522931255009873_2381109113211618775_n.jpg",
    "/images/screen-printing/545069955_18528986377009873_8233616816821158505_n.jpg",
    "/images/screen-printing/553374458_18532099264009873_8932786443256536017_n.jpg",
    "/images/screen-printing/558540293_1428370792422416_7730884362109349548_n.jpg",
    "/images/screen-printing/561336827_18534943984009873_665063645177449037_n.jpg",
    "/images/screen-printing/562888326_18535114597009873_9015901549848206854_n.jpg",
    "/images/screen-printing/611269105_18553619065009873_7800854787180806904_n.jpg",
    "/images/screen-printing/625952558_18559416961009873_7215614767635895671_n.jpg",
    "/images/screen-printing/638926009_18569767438009873_1457566201018128681_n.jpg",
    "/images/screen-printing/641723470_18570783376009873_7030023911011231962_n.jpg",
    "/images/screen-printing/641767704_18569017318009873_5999176633202524342_n.jpg",
    "/images/screen-printing/cpa.jpg",
    "/images/screen-printing/screen-print1.jpg"
  ],
  "sign-banners": [
    "/images/sign-banners/95525961_3022025347820545_5557957864531689472_n.jpg",
    "/images/sign-banners/618657266_18555735766009873_133435053101636559_n.jpg",
    "/images/sign-banners/639531227_18569535229009873_1734010140289635921_n.jpg",
    "/images/sign-banners/639985671_18569535244009873_4983119230006870802_n.jpg",
    "/images/sign-banners/642470483_18571217428009873_4887144359931898686_n.jpg",
    "/images/sign-banners/645501324_18571217419009873_5145212769391887043_n.jpg",
    "/images/sign-banners/672444216_18584145094009873_5071688867988805225_n.jpg",
    "/images/sign-banners/681332911_18586231018009873_8171075390474764978_n.jpg",
    "/images/sign-banners/Screenshot%202026-06-02%20125633.jpg",
    "/images/sign-banners/signs1.jpg"
  ],
  "vehicle-graphics": [
    "/images/vehicle-graphics/72129918_2554038127952605_2212803825624940544_n.jpg",
    "/images/vehicle-graphics/72959803_2605180492838368_6088365507881205760_n.jpg",
    "/images/vehicle-graphics/117121968_3297639280259149_5372068682898895892_n.jpg",
    "/images/vehicle-graphics/145748412_3792767444079661_3567942201483520864_n.jpg",
    "/images/vehicle-graphics/189032745_4099621726727563_1597358577555745744_n.jpg",
    "/images/vehicle-graphics/467430523_8880303031992718_4906817657093867641_n.jpg",
    "/images/vehicle-graphics/469947036_9018672644822422_2689589393475107603_n.jpg",
    "/images/vehicle-graphics/491449752_18504299536009873_4018330112690580641_n.jpg",
    "/images/vehicle-graphics/573056704_18541685581009873_7230317914587998453_n.jpg",
    "/images/vehicle-graphics/604323464_18550757872009873_6264575973487702756_n.jpg",
    "/images/vehicle-graphics/609642154_18552630907009873_2057889211380661695_n.jpg",
    "/images/vehicle-graphics/619847800_18556123204009873_7241363035410170780_n.jpg",
    "/images/vehicle-graphics/622501195_18557355934009873_2409729968051443478_n.jpg",
    "/images/vehicle-graphics/623162389_18557836936009873_1351491017251288203_n.jpg",
    "/images/vehicle-graphics/656321387_18575760043009873_1258624418878298762_n.jpg",
    "/images/vehicle-graphics/box-truck.jpg",
    "/images/vehicle-graphics/truck-graphics.jpg",
    "/images/vehicle-graphics/vehicle-ngl.jpg",
    "/images/vehicle-graphics/vehicle-page.jpg"
  ]
} as const;

export type WorkImageFolder = keyof typeof workImagesByFolder;
