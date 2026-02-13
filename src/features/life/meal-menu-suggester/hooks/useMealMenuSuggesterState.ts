import { useCallback } from 'react';
import { MealMenuSuggesterState, MealMenuSuggesterActions, MealTime, DayMenu, MenuItem } from '../types';
import { getMenuItemsByMealTime } from '../data/menuData';

const getRandomItem = (items: MenuItem[], exclude?: MenuItem): MenuItem => {
  const filtered = exclude ? items.filter(item => item.id !== exclude.id) : items;
  return filtered[Math.floor(Math.random() * filtered.length)];
};

export const generateDayMenu = (date: Date): DayMenu => {
  return {
    date,
    colazione: getRandomItem(getMenuItemsByMealTime('colazione')),
    pranzo: getRandomItem(getMenuItemsByMealTime('pranzo')),
    cena: getRandomItem(getMenuItemsByMealTime('cena')),
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
            config: {
              ...prev.config,
              sidebarVisible: !prev.config.sidebarVisible,
            },
          }));
        }, [setState]),
        close: useCallback(() => {
          setState(prev => ({
            ...prev,
            config: {
              ...prev.config,
              sidebarVisible: false,
            },
          }));
        }, [setState]),
      },
      selectDay: useCallback((index: number) => {
        setState(prev => ({
          ...prev,
          config: {
            ...prev.config,
            selectedDayIndex: index,
          },
        }));
      }, [setState]),
    },

    shuffleMeal: useCallback((dayIndex: number, mealTime: MealTime) => {
      setState(prev => {
        const newMenus = [...prev.data.weekMenus];
        const currentMenu = newMenus[dayIndex];
        const items = getMenuItemsByMealTime(mealTime);
        const currentItem = currentMenu[mealTime];
        newMenus[dayIndex] = {
          ...currentMenu,
          [mealTime]: getRandomItem(items, currentItem),
        };
        return {
          ...prev,
          config: {
            ...prev.config,
            isShuffling: mealTime,
          },
          data: {
            ...prev.data,
            weekMenus: newMenus,
          },
        };
      });
      setTimeout(() => {
        setState(prev => ({
          ...prev,
          config: { ...prev.config, isShuffling: null },
        }));
      }, 400);
    }, [setState]),

    shuffleDay: useCallback((dayIndex: number) => {
      setState(prev => {
        const newMenus = [...prev.data.weekMenus];
        const date = newMenus[dayIndex].date;
        newMenus[dayIndex] = generateDayMenu(date);
        return {
          ...prev,
          config: {
            ...prev.config,
            isShuffling: 'all',
          },
          data: {
            ...prev.data,
            weekMenus: newMenus,
          },
        };
      });
      setTimeout(() => {
        setState(prev => ({
          ...prev,
          config: { ...prev.config, isShuffling: null },
        }));
      }, 400);
    }, [setState]),

    shuffleAll: useCallback(() => {
      setState(prev => {
        const startDate = prev.data.weekMenus[0]?.date || new Date();
        return {
          ...prev,
          config: {
            ...prev.config,
            isShuffling: 'all',
          },
          data: {
            ...prev.data,
            weekMenus: generateWeekMenus(startDate),
          },
        };
      });
      setTimeout(() => {
        setState(prev => ({
          ...prev,
          config: { ...prev.config, isShuffling: null },
        }));
      }, 400);
    }, [setState]),
  };

  return { actions };
};
