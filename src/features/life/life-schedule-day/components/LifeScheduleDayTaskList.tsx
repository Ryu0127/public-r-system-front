import ButtonCyan from 'components/atoms/buttons/ButtonCyan';
import Select from 'components/atoms/Select';
import React from 'react';
import { Task } from '../hooks/useLifeScheduleDayState';
import ButtonIconInfo from 'components/atoms/buttons/ButtonIconInfo';
import { formatDateTime, toTimeString } from 'utils/dateUtil';

export interface LifeScheduleDayTaskListProps {
  config?: {
  };
  data?: {
    tasks: Task[];
  };
  item?: {
    masterTasks: {
      taskId: string;
      taskName: string;
      taskColor: string;
    }[];
  };
  controls?: {
    taskControls: {
      openTaskDetail: (tmpId: number) => void;
      onAddTask: () => void;
      onChangeForm: (event: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>, tmpId: number) => void;
    };
  };
}

/**
 * タスク一覧コンポーネント
 * スケジュール画面の左側に表示されるタスクリストを提供
 */
export const LifeScheduleDayTaskList: React.FC<LifeScheduleDayTaskListProps> = ({
  config,
  data = { tasks: [] },
  item = { masterTasks: [] },
  controls = {
    taskControls: {
      openTaskDetail: () => {},
      onAddTask: () => {},
      onChangeForm: () => {},
    },
  },
}) => {
  return (
    <>
      {/* ヘッダー */}
      <div className="sticky top-0 bg-white z-10 p-2 border-b font-medium h-[37px]">
        スケジュール項目
      </div>

      {/* タスクリスト */}
      {data?.tasks.map((task) => {
        return (
          <div 
            key={task.taskId} 
            className="h-[110px] p-3 border-b hover:bg-gray-50 transition-colors"
          >
            {/* タスク名 */}
            <div className="font-medium truncate">
              <textarea
                name="taskName"
                className="form-control"
                rows={1}
                placeholder="作業内容"
                value={task.taskName}
                onChange={(e) => controls?.taskControls.onChangeForm(e, task.tmpId)}  
                style={{ resize: 'none' }}
              />
            </div>
            {/* プロジェクト名 */}
            <div className="text-sm text-gray-500 mt-1">
              <Select
                name="projectId"
                addClass="w-full"
                value={task.projectId}
                options={item.masterTasks.map(masterTask => ({ 
                  value: masterTask.taskId,
                  text: masterTask.taskName
                }))}
                onChange={(e) => controls?.taskControls.onChangeForm(e, task.tmpId)}
              />
            </div>
            {/* 時間 */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500 mt-1">
                {toTimeString(task.startDateTime)} - {toTimeString(task.endDateTime)}
              </div>
              <ButtonIconInfo
                onClick={() => controls?.taskControls.openTaskDetail(task.tmpId)}
              />
            </div>
          </div>
        );
      })}

      {/* タスクが存在しない場合 */}
      {data?.tasks.length === 0 && (
        <div className="p-4 text-center text-gray-500">
          タスクが存在しません
        </div>
      )}
      <div className="p-4 text-center text-gray-500">
        <ButtonCyan
          addClass="w-32"
          text="タスクを追加"
          onClick={controls?.taskControls.onAddTask}
        />
      </div>
    </>
  );
};

export default LifeScheduleDayTaskList;