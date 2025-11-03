import React, { useCallback, useEffect, useRef } from 'react';
import { LifeScheduleDayActions, LifeScheduleDayState, Project } from '../hooks/useLifeScheduleDayState';
import { LifeScheduleDayTaskList } from '../components/LifeScheduleDayTaskList';
import { LifeScheduleDayTimeline } from '../components/LifeScheduleDayTimeline';
import { LifeScheduleDayDetailPanel, LifeScheduleDayDetailPanelProps } from '../components/LifeScheduleDayDetailPanel';
import LifeScheduleDayFotter from '../components/LifeScheduleDayFotter';
import Loading from 'components/Loading';
import AreaOverlaySidePanel from 'components/molecules/areas/AreaOverlaySidePanel';
import LayoutBaseTs from 'components/layouts/LayoutBaseTs';
import HeaderSideMenu from 'components/molecules/headers/HeaderSideMenu';

// Handler interface defined locally
export interface LifeScheduleDayUiProps {
  // サイドバー操作コントロール
  sidebarControls: {
    toggle: () => void;
    close: () => void;
  };
  // タスク操作コントロール
  taskControls: {
    openTaskDetail: (tmpId: number) => void;
    closeTaskDetail: () => void;
    onAddTask: () => void;
    onChangeForm: (event: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>, tmpId: number) => void;
    onUpdate: () => void;
    onDragStart: (tmpId: number, type: 'start' | 'end' | 'move', e: React.MouseEvent | React.TouchEvent) => void;
    onDragMove: (e: React.MouseEvent | React.TouchEvent) => void;
    onDragEnd: () => void;
    registGoogleCalendar: (tmpId: number) => void;
  };
  // タイムライン操作コントロール
  timelineControls: {
    onMouseDown: (e: React.MouseEvent) => void;
    onMouseMove: (e: React.MouseEvent) => void;
    onMouseUp: () => void;
    onMouseLeave: () => void;
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: () => void;
    onTouchCancel: () => void;
  };
}

export interface PresenterProps {
  state: LifeScheduleDayState;
  actions: LifeScheduleDayActions;
}

// データ変換処理
const dataTransformer = {
  toMasterTask: (projects: Project[]) => projects.map((project, index) => ({
    taskId: project.id,
    taskName: project.name,
    taskColor: project.color,
  })),
};

const LifeScheduleDayPresenter: React.FC<PresenterProps> = ({
  state,
  actions,
}) => {
  // タイムライン要素へのref
  const timelineElementRef = useRef<HTMLDivElement | null>(null);

  // UI Props定義
  const uiProps: LifeScheduleDayUiProps = {
    // サイドバー操作コントロール
    sidebarControls: {
      toggle: useCallback(() => {
        actions.configControl.sidebarVisible.toggle();
      }, [actions]),
      close: useCallback(() => {
        actions.configControl.sidebarVisible.close();
      }, [actions]),
    },
    // タスク操作コントロール
    taskControls: {
      openTaskDetail: actions.openTaskDetail,
      closeTaskDetail: actions.closeTaskDetail,
      onAddTask: actions.addTask,
      onChangeForm: actions.updateFormValueTask,
      onUpdate: actions.update,
      onDragStart: useCallback((tmpId: number, type: 'start' | 'end' | 'move', e: React.MouseEvent | React.TouchEvent) => {
        const clientX = 'touches' in e && e.touches.length > 0 ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        actions.taskDragActions.startTaskDrag(tmpId, type, clientX);
      }, [actions]),
      onDragMove: useCallback((e: React.MouseEvent | React.TouchEvent) => {
        const clientX = 'touches' in e && e.touches.length > 0 ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        actions.taskDragActions.moveTask(clientX);
      }, [actions]),
      onDragEnd: useCallback(() => {
        actions.taskDragActions.resetSelectedData();
      }, [actions]),
      registGoogleCalendar: actions.registGoogleCalendar,
    },
    // タイムライン操作コントロール
    timelineControls: {
      onMouseDown: useCallback((e: React.MouseEvent) => {
        if (!state.selectedData.resizingTask.tmpId) {
          actions.startScroll(e.clientX);
        }
      }, [actions, state.selectedData.resizingTask.tmpId]),
      onMouseMove: useCallback((e: React.MouseEvent) => {
        if (state.selectedData.resizingTask.tmpId) {
          actions.taskDragActions.moveTask(e.clientX);
        } else {
          actions.handleScroll(e.clientX);
        }
      }, [actions, state.selectedData.resizingTask.tmpId]),
      onMouseUp: useCallback(() => {
        actions.endScroll();
        actions.taskDragActions.resetSelectedData();
      }, [actions]),
      onMouseLeave: useCallback(() => {
        actions.endScroll();
        actions.taskDragActions.resetSelectedData();
      }, [actions]),
      onTouchStart: useCallback((e: React.TouchEvent) => {
        // タスクドラッグが既に開始されている場合は何もしない
        if (!state.selectedData.resizingTask.tmpId) {
          actions.startScroll(e.touches[0].clientX);
        }
      }, [actions, state.selectedData.resizingTask.tmpId]),
      onTouchMove: useCallback((e: React.TouchEvent) => {
        // タスクドラッグ中はグローバルリスナーで処理するため、ここでは何もしない
        if (!state.selectedData.resizingTask.tmpId) {
          actions.handleScroll(e.touches[0].clientX);
        }
      }, [actions, state.selectedData.resizingTask.tmpId]),
      onTouchEnd: useCallback(() => {
        actions.endScroll();
        actions.taskDragActions.resetSelectedData();
      }, [actions]),
      onTouchCancel: useCallback(() => {
        actions.endScroll();
        actions.taskDragActions.resetSelectedData();
      }, [actions]),
    }
  };

  // タイムライン要素のネイティブタッチイベントリスナー（passive: falseでpreventDefault可能）
  useEffect(() => {
    const timelineElement = timelineElementRef.current;
    if (!timelineElement) return;

    const handleTouchStart = (e: TouchEvent) => {
      // タスクドラッグが開始されていない場合のみスクロール開始
      if (!state.selectedData.resizingTask.tmpId) {
        actions.startScroll(e.touches[0].clientX);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      // 最新の状態を確認
      const currentResizingTaskId = state.selectedData.resizingTask.tmpId;
      if (currentResizingTaskId) {
        // タスクドラッグ中
        e.preventDefault(); // スクロールを防ぐ
        actions.taskDragActions.moveTask(e.touches[0].clientX);
      } else {
        // タイムラインスクロール中
        actions.handleScroll(e.touches[0].clientX);
      }
    };

    const handleTouchEnd = () => {
      actions.endScroll();
      actions.taskDragActions.resetSelectedData();
    };

    const handleTouchCancel = () => {
      actions.endScroll();
      actions.taskDragActions.resetSelectedData();
    };

    timelineElement.addEventListener('touchstart', handleTouchStart, { passive: false });
    timelineElement.addEventListener('touchmove', handleTouchMove, { passive: false });
    timelineElement.addEventListener('touchend', handleTouchEnd, { passive: false });
    timelineElement.addEventListener('touchcancel', handleTouchCancel, { passive: false });

    return () => {
      timelineElement.removeEventListener('touchstart', handleTouchStart);
      timelineElement.removeEventListener('touchmove', handleTouchMove);
      timelineElement.removeEventListener('touchend', handleTouchEnd);
      timelineElement.removeEventListener('touchcancel', handleTouchCancel);
    };
  }, [state.selectedData.resizingTask.tmpId, actions, state.selectedData]);

  // タスクドラッグ中のグローバルタッチイベントリスナー（タイムライン要素外での移動に対応）
  useEffect(() => {
    const currentResizingTaskId = state.selectedData.resizingTask.tmpId;
    if (!currentResizingTaskId) return;

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        // タイムライン要素内のイベントはネイティブリスナーで処理されるため、要素外のみ処理
        if (!timelineElementRef.current?.contains(e.target as Node)) {
          e.preventDefault(); // スクロールを防ぐ
          actions.taskDragActions.moveTask(e.touches[0].clientX);
        }
      }
    };

    const handleTouchEnd = () => {
      actions.endScroll();
      actions.taskDragActions.resetSelectedData();
    };

    const handleTouchCancel = () => {
      actions.endScroll();
      actions.taskDragActions.resetSelectedData();
    };

    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('touchcancel', handleTouchCancel);

    return () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchcancel', handleTouchCancel);
    };
  }, [state.selectedData.resizingTask.tmpId, actions]);

  return (
    <LayoutBaseTs
      sidebarContent={
        <HeaderSideMenu items={[]} />
      }
      sidebarVisible={state.config.sidebarVisible}
      onToggle={uiProps.sidebarControls.toggle}
      onClose={uiProps.sidebarControls.close}
    >
      <>
        {state.config.isLoading ? (
          <Loading />
        ) : (
          <div className="flex flex-col bg-gray-100">
            {/* メインコンテンツ */}
            <div className="flex-1 p-4">
              <div className="bg-white rounded-lg shadow overflow-hidden">
                {/* タスクリストとタイムライン */}
                <div className="flex h-[calc(100vh-15rem)] overflow-hidden">
                  {/* タスクリスト */}
                  <div
                    className="w-1/4 min-w-[300px] overflow-y-auto border-r mb-[15px]"
                    ref={state.config.taskListRef}
                  >
                    <LifeScheduleDayTaskList
                      data={{ tasks: state.data.tasks }}
                      item={{ masterTasks: dataTransformer.toMasterTask(state.item.projects) }}
                      controls={{ taskControls: uiProps.taskControls }}
                    />
                  </div>
                  {/* タイムライン */}
                  <div 
                    className="w-auto overflow-x-auto cursor-grab active:cursor-grabbing"
                    ref={(el) => {
                      if (state.config.timelineRef) {
                        (state.config.timelineRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
                      }
                      timelineElementRef.current = el;
                    }}
                    onMouseDown={uiProps.timelineControls.onMouseDown}
                    onMouseMove={uiProps.timelineControls.onMouseMove}
                    onMouseUp={uiProps.timelineControls.onMouseUp}
                    onMouseLeave={uiProps.timelineControls.onMouseLeave}
                  >
                    <LifeScheduleDayTimeline
                      data={{ tasks: state.data.tasks }}
                      item={{
                        timeSlots: state.item.timeSlots,
                        masterTasks: dataTransformer.toMasterTask(state.item.projects),
                      }}
                      controls={{ taskControls: uiProps.taskControls }}
                    />
                  </div>
                </div>
                {/* オーバーレイサイドパネルエリア */}
                <AreaOverlaySidePanel
                  isOpen={state.config.openDetailPanel}
                  width="300px"
                  addCss="pt-16"
                >
                  {/* 詳細パネル */}
                  <LifeScheduleDayDetailPanel
                    selectedData={{ task: state.selectedData.selectedTask }}
                    controls={{ taskControls: uiProps.taskControls }}
                  />
                </AreaOverlaySidePanel>
              </div>
            </div>
            {/* フッター */}
            <LifeScheduleDayFotter
              controls={{ taskControls: uiProps.taskControls }}
            />
          </div>
        )}
      </>
    </LayoutBaseTs>
  );
};

export default LifeScheduleDayPresenter;