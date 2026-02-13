import { useCallback } from 'react';
import { MealMenuSuggesterState, MealMenuSuggesterActions, MealTime, DayMenu, MenuItem } from '../types';
import { getMenuItemsByMealTime, ITEMS_PER_SECTION } from '../data/menuData';

const getRandomItems = (items: MenuItem[], count: number): MenuItem[] => {
  const shuffled = [...items].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

const getRandomItem = (items: MenuItem[], exclude: MenuItem): MenuItem => {
  const filtered = items.filter(item => item.id !== exclude.id);
  return filtered[Math.floor(Math.random() * filtered.length)];
};

export const generateDayMenu = (date: Date): DayMenu => {
  return {
    date,
    colazione: getRandomItems(getMenuItemsByMealTime('colazione'), ITEMS_PER_SECTION),
    pranzo: getRandomItems(getMenuItemsByMealTime('pranzo'), ITEMS_PER_SECTION),
    cena: getRandomItems(getMenuItemsByMealTime('cena'), ITEMS_PER_SECTION),
  };
};

export const generateWeekMenus = (startDate: Date): DayMenu[] => {
  const menus: DayMenu[] = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    menus.push(generateDayMenu(date));
  }
  return menus;
};

export const useMealMenuSuggesterState = (
  state: MealMenuSuggesterState,
  setState: React.Dispatch<React.SetStateAction<MealMenuSuggesterState>>
): {
  actions: MealMenuSuggesterActions;
} => {
  const actions: MealMenuSuggesterActions = {
    configControl: {
      sidebarVisible: {
        toggle: useCallback(() => {
          setState(prev => ({
            ...prev,
            config: { ...prev.config, sidebarVisible: !prev.config.sidebarVisible },
          }));
        }, [setState]),
        close: useCallback(() => {
          setState(prev => ({
            ...prev,
            config: { ...prev.config, sidebarVisible: false },
          }));
        }, [setState]),
      },
      selectDay: useCallback((index: number) => {
        setState(prev => ({
          ...prev,
          config: { ...prev.config, selectedDayIndex: index },
        }));
      }, [setState]),
    },

    shuffleMealItem: useCallback((dayIndex: number, mealTime: MealTime, itemIndex: number) => {
      setState(prev => {
        const newMenus = [...prev.data.weekMenus];
        const currentMenu = { ...newMenus[dayIndex] };
        const items = getMenuItemsByMealTime(mealTime);
        const currentItems = [...currentMenu[mealTime]];
        currentItems[itemIndex] = getRandomItem(items, currentItems[itemIndex]);
        currentMenu[mealTime] = currentItems;
        newMenus[dayIndex] = currentMenu;
        return {
          ...prev,
          data: { ...prev.data, weekMenus: newMenus },
        };
      });
    }, [setState]),

    shuffleSection: useCallback((dayIndex: number, mealTime: MealTime) => {
      setState(prev => {
        const newMenus = [...prev.data.weekMenus];
        const currentMenu = { ...newMenus[dayIndex] };
        const items = getMenuItemsByMealTime(mealTime);
        currentMenu[mealTime] = getRandomItems(items, ITEMS_PER_SECTION);
        newMenus[dayIndex] = currentMenu;
        return {
          ...prev,
          config: { ...prev.config, isShuffling: mealTime },
          data: { ...prev.data, weekMenus: newMenus },
        };
      });
      setTimeout(() => {
        setState(prev => ({ ...prev, config: { ...prev.config, isShuffling: null } }));
      }, 400);
    }, [setState]),

    shuffleDay: useCallback((dayIndex: number) => {
      setState(prev => {
        const newMenus = [...prev.data.weekMenus];
        const date = newMenus[dayIndex].date;
        newMenus[dayIndex] = generateDayMenu(date);
        return {
          ...prev,
          config: { ...prev.config, isShuffling: 'all' },
          data: { ...prev.data, weekMenus: newMenus },
        };
      });
      setTimeout(() => {
        setState(prev => ({ ...prev, config: { ...prev.config, isShuffling: null } }));
      }, 400);
    }, [setState]),

    shuffleAll: useCallback(() => {
      setState(prev => {
        const startDate = prev.data.weekMenus[0]?.date || new Date();
        return {
          ...prev,
          config: { ...prev.config, isShuffling: 'all' },
          data: { ...prev.data, weekMenus: generateWeekMenus(startDate) },
        };
      });
      setTimeout(() => {
        setState(prev => ({ ...prev, config: { ...prev.config, isShuffling: null } }));
      }, 400);
    }, [setState]),
  };

  return { actions };
};
