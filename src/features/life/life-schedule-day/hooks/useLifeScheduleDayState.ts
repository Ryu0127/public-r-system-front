import { useCallback, useEffect, useRef } from 'react';
import { useLifeScheduleDayApi } from './useLifeScheduleDayApi';
import { LifeScheduleDayTaskApiTask } from 'hooks/api/life/useLifeScheduleDayTaskGetApi';
import { LifeScheduleDayTaskApiRequestTask } from 'hooks/api/life/useLifeScheduleDayTaskPostApi';
import { EventsGoogleCalendarRegistPostApiRequest } from 'hooks/api/events/useEventsGoogleCalendarRegistPostApi';
import { TimeSlot } from 'components/molecules/timelines/TimelineScrollingHorizontal';

export interface LifeScheduleDayState {
  // リクエストパラメータ
  requestParams: {
    currentDate: Date;
  };
  // 画面制御
  config: {
    isLoading: boolean;
    sidebarVisible: boolean;
    taskListRef: React.RefObject<HTMLDivElement>;
    timelineRef: React.RefObject<HTMLDivElement>;
    isScrolling: boolean; // スクロール中判定
    openDetailPanel: boolean;
  }
  // 画面アイテム
  item: {
    timeSlots: TimeSlot[];
    projects: Project[];
  }
  // 画面データ
  data: {
    tasks: Task[];
  }
  // 選択データ
  selectedData: {
    resizingTask: {
      tmpId: number | null;
      projectId: string | null;
      type: 'start' | 'end' | 'move' | null;
      startX: number | null;
      originalStartDate?: Date | null;
      originalEndDate?: Date | null;
    };
    selectedTask: Task | null;
  };
}

export interface Project {
  id: string;
  name: string;
  color: string;
}

export interface Task {
  tmpId: number;
  taskId: string;
  taskName: string;
  startDateTime: Date;
  endDateTime: Date;
  projectId: string;
  remarks: string | null;
  selectData: {
    masterTaskId: string;
  };
  projectColor: string;
}

export interface LifeScheduleDayActions {
  configControl: {
    loading: {
      close: () => void;
    };
    sidebarVisible: {
      toggle: () => void;
      close: () => void;
    }
  };
  // フォームアクション
  updateFormValueTask: (event: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>, tmpId: number) => void;
  // スクロールアクション
  startScroll: (clientX: number) => void;
  handleScroll: (clientX: number) => void;
  endScroll: () => void;
  // タスクドラッグアクション
  taskDragActions: {
    startTaskDrag: (tmpId: number, type: 'start' | 'end' | 'move', clientX: number) => void;
    moveTask: (clientX: number) => void;
    resetSelectedData: () => void;
  };
  // タスク追加アクション
  addTask: () => void;
  // タスク詳細表示アクション
  openTaskDetail: (tmpId: number) => void;
  closeTaskDetail: () => void;
  // 初期データ取得
  fetchData: () => void;
  // 更新アクション
  update: () => void;
  // Googleカレンダーへの登録
  registGoogleCalendar: (tmpId: number) => void;
}

/**
 * 状態管理値のグループ更新
 */
const updateStateGroup = {
  /**
   * 画面ローディングの更新
   */
  toViewLoading: (setState: React.Dispatch<React.SetStateAction<LifeScheduleDayState>>, isLoading: boolean) => {
    setState(prev => {
      return {
        ...prev,
        config: {
          ...prev.config,
          isLoading: isLoading
        }
      };
    });
  },

  /**
   * サイドバー表示の更新
   */
  toSidebarVisible: (setState: React.Dispatch<React.SetStateAction<LifeScheduleDayState>>, isVisible: boolean) => {
    setState(prev => {
      return {
        ...prev,
        config: {
          ...prev.config,
          sidebarVisible: isVisible
        }
      };
    });
  },

  // viewActionの更新（ローディングフラグの更新）
  toViewActionLoading: (setState: React.Dispatch<React.SetStateAction<LifeScheduleDayState>>, isLoading: boolean) => {
    setState(prev => {
      return {
        ...prev,
        ...updateState.toViewActionLoading(prev, isLoading), // viewActionの更新（ローディングフラグの更新）
      };
    });
  },
  // viewActionの更新（サイドバーの表示フラグの更新）
  toViewActionSidebarVisible: (setState: React.Dispatch<React.SetStateAction<LifeScheduleDayState>>, isVisible: boolean) => {
    setState(prev => {
      return {
        ...prev,
        ...updateState.toViewActionSidebarVisible(prev, isVisible), // viewActionの更新（サイドバーの表示フラグの更新）
      };
    });
  },
}

/**
 * 状態管理値の更新
 */
const updateState = {
  // viewActionの更新（ローディングフラグの更新）
  toViewActionLoading: (prev: LifeScheduleDayState, isLoading: boolean) => ({
    config: {
      ...prev.config,
      isLoading: isLoading
    }
  }),
  // viewActionの更新（サイドバーの表示フラグの更新）
  toViewActionSidebarVisible: (prev: LifeScheduleDayState, isVisible: boolean) => ({
    config: {
      ...prev.config,
      sidebarVisible: isVisible
    }
  }),
  // viewDataの更新（タスク一覧の更新）
  toViewDataTasks: (prev: LifeScheduleDayState, tasks: Task[]) => ({
    data: {
      ...prev.data,
      tasks: tasks,
    }
  }),
}

/**
 * データ変換（APIデータ）
 */
const transformerApiData = {
  toResponseTask: (apiResponse: LifeScheduleDayTaskApiTask, index: number): Task => ({
    tmpId: index + 1,
    taskId: apiResponse.taskId,
    taskName: apiResponse.taskName,
    startDateTime: new Date(apiResponse.startDateTime),
    endDateTime: new Date(apiResponse.endDateTime),
    projectId: apiResponse.projectId,
    remarks: apiResponse.remarks,
    selectData: {
      masterTaskId: apiResponse.projectId,
    },
    projectColor: "#0342ab",
  }),
  toRequestParamTask: (task: Task): LifeScheduleDayTaskApiRequestTask => ({
    taskId: task.taskId.toString(),
    taskName: task.taskName,
    startDateTime: task.startDateTime.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }),
    endDateTime: task.endDateTime.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }),
    projectId: task.projectId.toString(),
    remarks: task.remarks,
  }),
  toRequestParamEventsGoogleCalendarRegist: (task: Task): EventsGoogleCalendarRegistPostApiRequest => ({
      summary: task.taskName,
      startEventDateTime: task.startDateTime.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }),
      endEventDateTime: task.endDateTime.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }),
      location: '',
      description: task.remarks ?? '',
  }),
};

// プロジェクトカラー取得
const getProjectColors = (): string[] => {
  return ['#e9ecf4', '#0342ab', '#03ab8c', '#ab0327'];
};

// フォーム値変更時のタスク更新
const updatedTasks = (tasks: Task[], tmpId: number, name: string, value: string): Task[] => {
  return tasks.map(task => {
    if (task.tmpId === tmpId) {
      if (name === 'projectId') {
        return {
          ...task,
          [name]: value,
          selectData: {
            masterTaskId: value,
            masterTaskColor: getProjectColors()[Number(value)],
          }
        };
      }
      return {
        ...task,
        [name]: value
      };
    }
    return task;
  });
};

const addMinutes = (date: Date, minutes: number): Date => {
  return new Date(date.getTime() + minutes * 60000);
};

const differenceInMinutes = (date1: Date, date2: Date): number => {
  // ミリ秒の差分を計算
  const diffMilliseconds = date1.getTime() - date2.getTime();
  // ミリ秒を分に変換（1分 = 60秒 = 60,000ミリ秒）
  return Math.floor(diffMilliseconds / 60000);
};

const roundToNearestMinute = (date: Date): Date => {
  const minutes = date.getMinutes();
  const roundedMinutes = Math.round(minutes / 15) * 15;
  const newDate = new Date(date);
  newDate.setMinutes(roundedMinutes);
  return newDate;
};

/**
 * カスタムフック（状態管理）
 * 
 * @param state 状態
 * @param setState 状態更新関数
 * @returns アクション
 */
export const useLifeScheduleDayState = (
  state: LifeScheduleDayState,
  setState: React.Dispatch<React.SetStateAction<LifeScheduleDayState>>
): {
  actions: LifeScheduleDayActions
} => {
  // API Hooks
  const api = useLifeScheduleDayApi();

  // ドラッグ＆スクロール用のRef
  const isDraggingRef = useRef(false);
  const lastPositionRef = useRef(0);

  // アクション実装
  const actions: LifeScheduleDayActions = {
    /**
     * 画面制御
     */
    configControl: {
      loading: {
        close: useCallback(() => {
          updateStateGroup.toViewLoading(setState, false);
        }, [setState]),
      },
      sidebarVisible: {
        toggle: useCallback(() => {
          updateStateGroup.toSidebarVisible(setState, !state.config.sidebarVisible);
        }, [setState, state.config.sidebarVisible]),
        close: useCallback(() => {
          updateStateGroup.toSidebarVisible(setState, false);
        }, [setState]),
      },
    },

    // フォームの値を変更
    updateFormValueTask: useCallback((event: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>, tmpId: number) => {
      const { name, value } = event.target;
      setState(prev => {
        // 更新されたタスク配列を取得
        const updatedTasksList = updatedTasks(prev.data.tasks, tmpId, name, value);
        // 更新された配列から、変更されたタスクを見つける
        const updatedSelectedTask = updatedTasksList.find(task => task.tmpId === tmpId) || null;
        return {
          ...prev,
          data: {
            ...prev.data,
            tasks: updatedTasksList,
          },
          // 更新済みのタスクで選択データを更新
          selectedData: {
            ...prev.selectedData,
            selectedTask: updatedSelectedTask,
          },
          error: null
        };
      });
    }, [setState]),

    // スクロール開始
    startScroll: useCallback((clientX: number) => {
      isDraggingRef.current = true;
      lastPositionRef.current = clientX;
    }, []),

    // スクロール処理
    handleScroll: useCallback((clientX: number) => {
      if (!isDraggingRef.current) return;
      const delta = lastPositionRef.current - clientX;
      lastPositionRef.current = clientX;

      if (state.config.timelineRef.current) {
        state.config.timelineRef.current.scrollLeft += delta;
      }
    }, [state.config.timelineRef]),

    // スクロール終了
    endScroll: useCallback(() => {
      isDraggingRef.current = false;
    }, []),

    /**
     * タスクドラッグアクション
     */
    taskDragActions: {
      /**
       * タスクドラッグ開始
       * 
       * @param tmpId タスクID
       * @param type ドラッグタイプ
       * @param clientX クライアントX座標
       */
      startTaskDrag: useCallback((tmpId: number, type: 'start' | 'end' | 'move', clientX: number) => {
        const task = state.data.tasks.find(task => task.tmpId === tmpId);
        if (task) {
          setState(prev => ({
            ...prev,
            selectedData: {
              ...prev.selectedData,
              resizingTask: {
                ...prev.selectedData.resizingTask,
                tmpId: task.tmpId,
                type,
                originalStartDate: task.startDateTime,
                originalEndDate: task.endDateTime,
                startX: clientX
              }
            }
          }));
        }
      }, [state.data.tasks, setState]),

      // タスク移動
      moveTask: useCallback((clientX: number) => {
        if (!state.selectedData.resizingTask.tmpId) return;
        const CELL_WIDTH = 35;  // px
        const MINUTES_PER_CELL = 15;  // minutes
        
        setState(prev => {
          if (!prev.selectedData.resizingTask.tmpId) return prev;
          
          // 最初のタッチ位置（startX）からの累積差分を計算
          // startXは最初のタッチ位置のまま保持する（更新しない）
          const startX = prev.selectedData.resizingTask.startX || 0;
          const deltaX = clientX - startX;
          const deltaMinutes = Math.round((deltaX / CELL_WIDTH) * MINUTES_PER_CELL);
          
          // 現在のタスクを取得
          const currentTask = prev.data.tasks.find(task => task.tmpId === prev.selectedData.resizingTask.tmpId);
          if (!currentTask) return prev;
          
          let newStartDate = currentTask.startDateTime;
          let newEndDate = currentTask.endDateTime;

          switch (prev.selectedData.resizingTask.type) {
            case 'start':
              // originalStartDateからの累積差分を使用
              newStartDate = roundToNearestMinute(addMinutes(
                prev.selectedData.resizingTask.originalStartDate || currentTask.startDateTime, 
                deltaMinutes
              ));
              newEndDate = currentTask.endDateTime;
              break;
            case 'end':
              newStartDate = currentTask.startDateTime;
              // originalEndDateからの累積差分を使用
              newEndDate = roundToNearestMinute(addMinutes(
                prev.selectedData.resizingTask.originalEndDate || currentTask.endDateTime, 
                deltaMinutes
              ));
              break;
            case 'move':
              // originalStartDateからの累積差分を使用
              newStartDate = roundToNearestMinute(addMinutes(
                prev.selectedData.resizingTask.originalStartDate || currentTask.startDateTime, 
                deltaMinutes
              ));
              const duration = differenceInMinutes(
                prev.selectedData.resizingTask.originalEndDate || currentTask.endDateTime,
                prev.selectedData.resizingTask.originalStartDate || currentTask.startDateTime
              );
              newEndDate = addMinutes(newStartDate, duration);
              break;
          }
          
          const updatedTasks = prev.data.tasks.map(task => {
            if (task.tmpId === prev.selectedData.resizingTask.tmpId) {
              return { ...task, startDateTime: newStartDate, endDateTime: newEndDate };
            }
            return task;
          });
          
          return {
            ...prev,
            data: {
              ...prev.data,
              tasks: updatedTasks,
            }
          };
        });
      }, [state.selectedData.resizingTask, setState]),

      // 選択データリセット
      resetSelectedData: useCallback(() => {
        setState(prev => ({
          ...prev,
          selectedData: {
            ...prev.selectedData,
            resizingTask: {
              tmpId: null,
              projectId: null,
              type: null,
              startX: null,
            }
          }
        }));
      }, [setState]),
    },

    // タスク追加
    addTask: useCallback(() => {
      setState(prev => ({
        ...prev,
        data: {
          ...prev.data,
          tasks: [
            ...prev.data.tasks,
            {
              ...prev.data.tasks[prev.data.tasks.length - 1],
              tmpId: prev.data.tasks.length + 1,
              taskId: '',
              taskName: '',
              startDateTime: new Date(prev.requestParams.currentDate.setHours(10, 0, 0)),
              endDateTime: new Date(prev.requestParams.currentDate.setHours(19, 0, 0)),
              projectId: '',
              remarks: '',
              selectData: {
                masterTaskId: '',
                masterTaskColor: '',
              },
              projectColor: '#0342ab',
            }
          ]
        }
      }));
    }, [setState]), 

    // タスク詳細のオープン
    openTaskDetail: useCallback((tmpId: number) => {
      const task = state.data.tasks.find(task => task.tmpId === tmpId);
      if (task) {
        setState(prev => ({
          ...prev,
          config: {
          ...prev.config,
          openDetailPanel: true
        },
        selectedData: {
          ...prev.selectedData,
            selectedTask: task,
          }
        }));
      }
    }, [state.data.tasks, setState]),

    // タスク詳細のクローズ
    closeTaskDetail: useCallback(() => {
      setState(prev => ({
        ...prev,
        config: {
          ...prev.config,
          openDetailPanel: false
        },
        selectedData: {
          ...prev.selectedData,
          selectedTask: null,
        }
      }));
    }, [setState]),

    fetchData: useCallback(async () => {
      const apiResponse = await api.executeLifeScheduleDayTaskGet(state.requestParams.currentDate);
      if (apiResponse.success && apiResponse.data) {
        // APIレスポンスデータ変換（タスク一覧）
        const tasks = apiResponse.data.tasks.map((task, index) => transformerApiData.toResponseTask(task, index));
        setState(prev => {
          return {
            ...prev,
            ...updateState.toViewActionLoading(prev, false), // viewActionの更新（ローディングフラグの更新）
            ...updateState.toViewDataTasks(prev, tasks), // viewDataの更新（タスク一覧の更新）
            error: null
          };
        });
      }
    }, [setState]),

    // 更新
    update: useCallback(async () => {
      // viewActionの更新（ローディングフラグの更新）
      updateStateGroup.toViewActionLoading(setState, true);
      // タスク更新
      const requestParams = {
        tasks: state.data.tasks.map(task => transformerApiData.toRequestParamTask(task)),
        scheduleDate: state.requestParams.currentDate.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }),
      };
      const response = await api.update(requestParams);
      if (response.success) {
         // viewActionの更新（ローディングフラグの更新）
         updateStateGroup.toViewActionLoading(setState, false);
        return;
      }
    }, [state.data.tasks, setState]),

    // Googleカレンダーへの登録
    registGoogleCalendar: useCallback(async (tmpId: number) => {
      // viewActionの更新（ローディングフラグの更新）
      updateStateGroup.toViewActionLoading(setState, true);
      const task = state.data.tasks.find(task => task.tmpId === tmpId);
      if (task) {
        const requestParams = transformerApiData.toRequestParamEventsGoogleCalendarRegist(task);
        const response = await api.registGoogleCalendar(requestParams);
        if (response.success) {
          // viewActionの更新（ローディングフラグの更新）
          updateStateGroup.toViewActionLoading(setState, false);
          return;
        }
      }
    }, [state.data.tasks, setState]),
  };

  // スクロール同期処理
  useEffect(() => {
    const handleScroll = (source: 'taskList' | 'timeline', scrollTop: number) => {
      if (state.config.isScrolling) return;
      state.config.isScrolling = true;

      if (source === 'taskList' && state.config.timelineRef.current) {
        // タスクリストをスクロールした場合
        // タイムラインをスクロール
        state.config.timelineRef.current.scrollTop = scrollTop;
      } else if (source === 'timeline' && state.config.taskListRef.current) {
        // タイムラインをスクロールした場合
        // タスクリストをスクロール
        state.config.taskListRef.current.scrollTop = scrollTop;
      }
      // スクロール処理完了後にフラグをリセット
      setTimeout(() => {
        state.config.isScrolling = false;
      }, 50);
    };
    
    const taskListElement = state.config.taskListRef.current;
    const timelineElement = state.config.timelineRef.current;
    if (taskListElement && timelineElement) {
      taskListElement.addEventListener('scroll', () => {
        handleScroll('taskList', taskListElement.scrollTop);
      });

      timelineElement.addEventListener('scroll', () => {
        handleScroll('timeline', timelineElement.scrollTop);
      });
    }
  }, [state.data.tasks, setState]);

  /**
   * 初期データ取得
   */
  useEffect(() => {
    // 初期データ取得
    actions.fetchData();
  }, []);

  return { actions };
};
