import { MenuItem, MealTimeConfig } from '../types';

export const ITEMS_PER_SECTION = 6;

export const mealTimeConfigs: MealTimeConfig[] = [
  {
    key: 'colazione',
    labelEn: 'Breakfast',
    labelJa: '朝食',
    time: '6:00〜9:00',
  },
  {
    key: 'pranzo',
    labelEn: 'Lunch',
    labelJa: '昼食',
    time: '11:00〜14:00',
  },
  {
    key: 'cena',
    labelEn: 'Dinner',
    labelJa: '夕食',
    time: '18:00〜21:00',
  },
];

export const breakfastItems: MenuItem[] = [
  { id: 'b01', name: 'トースト＆目玉焼き', nameEn: 'Toast & Egg', description: 'こんがり焼いたトーストに、半熟の目玉焼きを添えて。' },
  { id: 'b02', name: 'シリアル＆ヨーグルト', nameEn: 'Cereal & Yogurt', description: 'サクサクのシリアルにヨーグルトをかけた朝の定番。' },
  { id: 'b03', name: 'おにぎり＆味噌汁', nameEn: 'Onigiri & Miso', description: '握りたてのおにぎりと温かい味噌汁の和朝食。' },
  { id: 'b04', name: 'パンケーキ', nameEn: 'Pancake', description: 'ふわふわに焼き上げたパンケーキ。メープルシロップと共に。' },
  { id: 'b05', name: 'フルーツグラノーラ', nameEn: 'Fruit Granola', description: 'ドライフルーツたっぷりのグラノーラにミルクをかけて。' },
  { id: 'b06', name: '納豆ごはん＆味噌汁', nameEn: 'Natto Rice', description: '栄養満点の納豆ごはんに温かい味噌汁を添えて。' },
  { id: 'b07', name: 'フレンチトースト', nameEn: 'French Toast', description: '卵液に浸したパンをバターでじっくり焼き上げて。' },
  { id: 'b08', name: 'お茶漬け', nameEn: 'Ochazuke', description: '温かいお出汁をかけたさっぱり朝ごはん。' },
  { id: 'b09', name: 'バナナスムージー', nameEn: 'Banana Smoothie', description: 'バナナとミルクをブレンドした朝の一杯。' },
  { id: 'b10', name: 'クロワッサン＆サラダ', nameEn: 'Croissant & Salad', description: 'サクサクのクロワッサンと新鮮なグリーンサラダ。' },
  { id: 'b11', name: '卵かけごはん', nameEn: 'Tamago Kake Gohan', description: '炊きたてごはんに新鮮な卵をかけたシンプルな朝食。' },
  { id: 'b12', name: 'ハムチーズトースト', nameEn: 'Ham Cheese Toast', description: 'ハムとチーズをのせてこんがり焼いたトースト。' },
  { id: 'b13', name: 'オートミール', nameEn: 'Oatmeal', description: 'ミルクで煮たオートミールにフルーツをトッピング。' },
  { id: 'b14', name: 'ベーグル＆クリームチーズ', nameEn: 'Bagel & Cream Cheese', description: 'もちもちベーグルにクリームチーズをたっぷり。' },
];

export const lunchItems: MenuItem[] = [
  { id: 'l01', name: 'ペペロンチーノ', nameEn: 'Peperoncino', description: 'にんにくと唐辛子の香りが効いたシンプルなパスタ。' },
  { id: 'l02', name: '焼きそば', nameEn: 'Yakisoba', description: 'たっぷりの野菜と麺をソースで炒めた一品。' },
  { id: 'l03', name: 'チャーハン', nameEn: 'Fried Rice', description: 'パラパラに仕上げた卵チャーハン。' },
  { id: 'l04', name: 'BLTサンドイッチ', nameEn: 'BLT Sandwich', description: 'ベーコン・レタス・トマトの定番サンドイッチ。' },
  { id: 'l05', name: 'きつねうどん', nameEn: 'Kitsune Udon', description: '甘く煮た油揚げをのせた温かいうどん。' },
  { id: 'l06', name: '親子丼', nameEn: 'Oyakodon', description: 'とろとろ卵と鶏肉がごはんに絡む丼もの。' },
  { id: 'l07', name: 'カレーライス', nameEn: 'Curry Rice', description: 'じっくり煮込んだ野菜と肉のカレーライス。' },
  { id: 'l08', name: '味噌ラーメン', nameEn: 'Miso Ramen', description: 'コク深い味噌スープにちぢれ麺がよく絡む。' },
  { id: 'l09', name: 'オムライス', nameEn: 'Omurice', description: 'ケチャップライスをふわふわ卵で包んだ洋食。' },
  { id: 'l10', name: '牛丼', nameEn: 'Gyudon', description: '甘辛く煮た牛肉と玉ねぎをごはんにのせて。' },
  { id: 'l11', name: 'ナポリタン', nameEn: 'Napolitan', description: 'ケチャップで炒めた懐かしい喫茶店の味。' },
  { id: 'l12', name: 'そぼろ丼', nameEn: 'Soboro Don', description: '甘辛い鶏そぼろと炒り卵の二色丼。' },
  { id: 'l13', name: 'たまごサンド', nameEn: 'Egg Sandwich', description: 'クリーミーな卵サラダをパンに挟んだ一品。' },
  { id: 'l14', name: '冷やし中華', nameEn: 'Hiyashi Chuka', description: '彩り豊かな具材をのせた冷たい中華麺。' },
  { id: 'l15', name: 'ツナマヨ丼', nameEn: 'Tuna Mayo Don', description: 'ツナとマヨネーズをごはんにのせたお手軽丼。' },
];

export const dinnerItems: MenuItem[] = [
  { id: 'd01', name: '鶏の照り焼き', nameEn: 'Teriyaki Chicken', description: '甘辛いタレで焼き上げたジューシーな鶏もも肉。' },
  { id: 'd02', name: '肉じゃが', nameEn: 'Nikujaga', description: 'ほくほくのじゃがいもと牛肉の和風煮物。' },
  { id: 'd03', name: '鮭の塩焼き', nameEn: 'Grilled Salmon', description: 'シンプルに塩をふって焼き上げた鮭の切り身。' },
  { id: 'd04', name: '麻婆豆腐', nameEn: 'Mapo Tofu', description: 'ピリ辛のひき肉あんと絹豆腐の中華定番。' },
  { id: 'd05', name: '豚の生姜焼き', nameEn: 'Ginger Pork', description: '生姜の香りが食欲をそそる豚ロースの生姜焼き。' },
  { id: 'd06', name: 'グラタン', nameEn: 'Gratin', description: 'クリーミーなホワイトソースとチーズの焼き上げ。' },
  { id: 'd07', name: '一人鍋', nameEn: 'Hot Pot for One', description: '野菜たっぷりの温かい一人用鍋。' },
  { id: 'd08', name: 'ハンバーグ', nameEn: 'Hamburg Steak', description: 'ジューシーに焼き上げたハンバーグステーキ。' },
  { id: 'd09', name: '野菜炒め＆スープ', nameEn: 'Stir-fry & Soup', description: '彩り野菜の炒め物と温かいスープのセット。' },
  { id: 'd10', name: 'ボロネーゼ', nameEn: 'Bolognese', description: 'じっくり煮込んだミートソースのパスタ。' },
  { id: 'd11', name: '回鍋肉', nameEn: 'Hoikoro', description: '豚肉とキャベツを甘辛味噌で炒めた中華。' },
  { id: 'd12', name: 'チキンカツ', nameEn: 'Chicken Katsu', description: 'サクサク衣のチキンカツ。キャベツを添えて。' },
  { id: 'd13', name: 'アクアパッツァ', nameEn: 'Acqua Pazza', description: '白身魚をトマトとオリーブで煮込んだイタリアン。' },
  { id: 'd14', name: 'ドライカレー', nameEn: 'Dry Curry', description: 'スパイシーなひき肉カレーをごはんに添えて。' },
  { id: 'd15', name: '豚キムチ', nameEn: 'Pork Kimchi', description: '豚バラ肉とキムチを炒めたピリ辛おかず。' },
  { id: 'd16', name: '鶏むね肉のソテー', nameEn: 'Chicken Sauté', description: 'しっとり焼き上げた鶏むね肉のソテー。' },
];

export const getMenuItemsByMealTime = (mealTime: 'colazione' | 'pranzo' | 'cena'): MenuItem[] => {
  switch (mealTime) {
    case 'colazione':
      return breakfastItems;
    case 'pranzo':
      return lunchItems;
    case 'cena':
      return dinnerItems;
  }
};
