import { MenuItem, MealTimeConfig } from '../types';

export const mealTimeConfigs: MealTimeConfig[] = [
  {
    key: 'colazione',
    labelIt: 'Colazione',
    labelJa: '朝食',
    icon: '~',
  },
  {
    key: 'pranzo',
    labelIt: 'Pranzo',
    labelJa: '昼食',
    icon: '~',
  },
  {
    key: 'cena',
    labelIt: 'Cena',
    labelJa: '夕食',
    icon: '~',
  },
];

export const breakfastItems: MenuItem[] = [
  { id: 'b01', name: 'トースト & 目玉焼き', description: 'Pane tostato con uovo' },
  { id: 'b02', name: 'シリアル & ヨーグルト', description: 'Cereali con yogurt' },
  { id: 'b03', name: 'おにぎり & 味噌汁', description: 'Onigiri e zuppa di miso' },
  { id: 'b04', name: 'パンケーキ', description: 'Pancake dolce' },
  { id: 'b05', name: 'フルーツグラノーラ', description: 'Granola alla frutta' },
  { id: 'b06', name: '納豆ごはん & 味噌汁', description: 'Riso con natto e miso' },
  { id: 'b07', name: 'フレンチトースト', description: 'French toast alla vaniglia' },
  { id: 'b08', name: 'お茶漬け', description: 'Ochazuke leggero' },
  { id: 'b09', name: 'バナナスムージー', description: 'Smoothie alla banana' },
  { id: 'b10', name: 'クロワッサン & サラダ', description: 'Cornetto con insalata' },
  { id: 'b11', name: '卵かけごはん', description: 'Riso con uovo crudo' },
  { id: 'b12', name: 'ハムチーズトースト', description: 'Toast al prosciutto e formaggio' },
  { id: 'b13', name: 'オートミール', description: 'Porridge di avena' },
  { id: 'b14', name: 'ベーグル & クリームチーズ', description: 'Bagel con crema di formaggio' },
];

export const lunchItems: MenuItem[] = [
  { id: 'l01', name: 'ペペロンチーノ', description: 'Spaghetti aglio, olio e peperoncino' },
  { id: 'l02', name: '焼きそば', description: 'Yakisoba saltato' },
  { id: 'l03', name: 'チャーハン', description: 'Riso saltato alla cinese' },
  { id: 'l04', name: 'BLTサンドイッチ', description: 'Panino BLT classico' },
  { id: 'l05', name: 'きつねうどん', description: 'Udon con tofu fritto' },
  { id: 'l06', name: '親子丼', description: 'Oyakodon — pollo e uovo' },
  { id: 'l07', name: 'カレーライス', description: 'Riso al curry giapponese' },
  { id: 'l08', name: '味噌ラーメン', description: 'Ramen al miso' },
  { id: 'l09', name: 'オムライス', description: 'Omurice — riso in omelette' },
  { id: 'l10', name: '牛丼', description: 'Gyudon — manzo su riso' },
  { id: 'l11', name: 'ナポリタン', description: 'Spaghetti alla napoletana' },
  { id: 'l12', name: 'そぼろ丼', description: 'Soboro don — carne macinata' },
  { id: 'l13', name: 'たまごサンド', description: 'Panino con insalata di uova' },
  { id: 'l14', name: '冷やし中華', description: 'Ramen freddo estivo' },
  { id: 'l15', name: 'ツナマヨ丼', description: 'Riso con tonno e maionese' },
];

export const dinnerItems: MenuItem[] = [
  { id: 'd01', name: '鶏の照り焼き & サラダ', description: 'Pollo teriyaki con insalata' },
  { id: 'd02', name: '肉じゃが', description: 'Nikujaga — stufato di carne' },
  { id: 'd03', name: '鮭の塩焼き & おひたし', description: 'Salmone grigliato con spinaci' },
  { id: 'd04', name: '麻婆豆腐 & ごはん', description: 'Mapo tofu con riso' },
  { id: 'd05', name: '豚の生姜焼き', description: 'Maiale allo zenzero' },
  { id: 'd06', name: 'グラタン', description: 'Gratin alla besciamella' },
  { id: 'd07', name: '一人鍋', description: 'Nabe — pentola calda per uno' },
  { id: 'd08', name: 'ハンバーグ', description: 'Hamburg steak alla giapponese' },
  { id: 'd09', name: '野菜炒め & スープ', description: 'Verdure saltate con zuppa' },
  { id: 'd10', name: 'ボロネーゼ', description: 'Spaghetti alla bolognese' },
  { id: 'd11', name: '回鍋肉', description: 'Hoikoro — maiale con cavolo' },
  { id: 'd12', name: 'チキンカツ', description: 'Cotoletta di pollo' },
  { id: 'd13', name: 'アクアパッツァ', description: 'Acqua pazza di pesce' },
  { id: 'd14', name: 'ドライカレー', description: 'Curry secco alla giapponese' },
  { id: 'd15', name: '豚キムチ', description: 'Maiale saltato con kimchi' },
  { id: 'd16', name: '鶏むね肉のソテー', description: 'Petto di pollo in padella' },
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
