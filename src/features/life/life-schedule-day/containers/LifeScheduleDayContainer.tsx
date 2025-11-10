import { useState } from 'react';
import useTitle from 'utils/useTitle';
import { LifeScheduleDayState, useLifeScheduleDayState } from '../hooks/useLifeScheduleDayState';
import LifeScheduleDayPresenter from '../presenters/LifeScheduleDayPresenter';
import { getDateDefaultNow } from 'utils/dateUtil';
import { TimeSlot } from 'components/molecules/timelines/TimelineScrollingHorizontal';

const initialState: LifeScheduleDayState = {
  requestParams: {
    currentDate: new Date(),
  },
  // 画面制御
  config: {
    isLoading: true,
    sidebarVisible: false,
    taskListVisible: false, // モバイルではデフォルトで非表示
    taskListRef: { current: null },
    timelineRef: { current: null },
    isScrolling: false,
    openDetailPanel: false,
  },
  // 画面アイテム
  item: {
    timeSlots: [],
    projects: [],
    schedules: [],
  },
  // データ項目
  data: {
    tasks: [],
  },
  // 選択データ
  selectedData: {
    resizingTask: {
      tmpId: null,
      projectId: null,
      type: null,
      startX: null
    },
    selectedTask: null,
    selectedSchedule: null,
  },
};

/**
 * /life/life-schedule-day
 * 日次スケジュール画面
 * 
 * @returns 
 */
const LifeScheduleDayContainer: React.FC = () => {
  useTitle('日次スケジュール');

  // URLパラメータ
  const urlParams = new URLSearchParams(window.location.search);
  const usageYmd = urlParams.get('usageYmd');

  // 初期値設定（状態管理）
  const [state, setState] = useState<LifeScheduleDayState>(() => {
    // 初期表示日を設定
    const currentDate = new Date(getDateDefaultNow(usageYmd));
    // タイムスロットを生成
    const timeSlots = generateTimeSlots(currentDate);
    return {
      ...initialState,
      requestParams: {
        currentDate: currentDate,
      },
      item: {
        ...initialState.item,
        timeSlots,
      },
    };
  });

  // Actions Hook
  const { actions } = useLifeScheduleDayState(state, setState);

  return (
    <LifeScheduleDayPresenter
      state={state}
      actions={actions}
    />
  );
};

/**
 * タイムスロットを生成する
 */
const generateTimeSlots = (date: Date): TimeSlot[] => {
  const slots: TimeSlot[] = [];
  const startTime = new Date(date);
  startTime.setHours(5, 0, 0, 0); // 開始時刻
  
  for (let i = 0; i < 96; i++) {
    const time = new Date(startTime);
    time.setMinutes(i * 15); // 15分刻みで時間を設定
    slots.push({
      date: time,
      isNowHour: isNowHour(time),
      isTimeView: isJustHour(time) || isJustHalfHour(time),
    });
  }
  return slots;
};

const isJustHour = (date: Date): boolean => {
  return date.getMinutes() === 0;
};

const isJustHalfHour = (date: Date): boolean => {
  return date.getMinutes() === 30;
};

const isNowHour = (date: Date): boolean => {
  const now = new Date();
  // 現在時刻との差が15分以内かどうかを判定
  const before = new Date(now.getTime() - 15 * 60000);
  return date >= before && date < now;
};

export default LifeScheduleDayContainer;