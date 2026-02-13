export interface MenuItem {
  id: string;
  name: string;
  nameEn: string;
  description: string;
}

export type MealTime = 'colazione' | 'pranzo' | 'cena';

export interface MealTimeConfig {
  key: MealTime;
  labelEn: string;
  labelJa: string;
  time: string;
}

export interface DayMenu {
  date: Date;
  colazione: MenuItem[];
  pranzo: MenuItem[];
  cena: MenuItem[];
}

export interface MealMenuSuggesterState {
  config: {
    sidebarVisible: boolean;
    selectedDayIndex: number;
    isShuffling: MealTime | 'all' | null;
  };
  data: {
    weekMenus: DayMenu[];
  };
}

export interface MealMenuSuggesterActions {
  configControl: {
    sidebarVisible: {
      toggle: () => void;
      close: () => void;
    };
    selectDay: (index: number) => void;
  };
  shuffleMealItem: (dayIndex: number, mealTime: MealTime, itemIndex: number) => void;
  shuffleSection: (dayIndex: number, mealTime: MealTime) => void;
  shuffleDay: (dayIndex: number) => void;
  shuffleAll: () => void;
}
