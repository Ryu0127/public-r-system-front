import React, { useCallback } from 'react';
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
    onDragStart: (tmpId: number, type: 'start' | 'end' | 'move', e: React.MouseEvent) => void;
    onDragMove: (e: React.MouseEvent) => void;
    onDragEnd: () => void;
    registGoogleCalendar: (tmpId: number) => void;
  };
  // タイムライン操作コントロール
  timelineControls: {
    onMouseDown: (e: React.MouseEvent) => void;
    onMouseMove: (e: React.MouseEvent) => void;
    onMouseUp: () => void;
    onMouseLeave: () => void;
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
      onDragStart: useCallback((tmpId: number, type: 'start' | 'end' | 'move', e: React.MouseEvent) => {
        actions.taskDragActions.startTaskDrag(tmpId, type, e.clientX);
      }, [actions]),
      onDragMove: useCallback((e: React.MouseEvent) => {
        actions.taskDragActions.moveTask(e.clientX);
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
    }
  };

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
                    ref={state.config.timelineRef}
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