import React from 'react';
import ButtonCyan from 'components/atoms/buttons/ButtonCyan';
import ButtonIconClose from 'components/atoms/buttons/ButtonIconClose';
import { Task } from '../hooks/useLifeScheduleDayState';
import { toTimeString } from 'utils/dateUtil';
import AreaOverlaySideSlide from 'components/molecules/areas/AreaOverlaySidePanel';

export interface LifeScheduleDayDetailPanelProps {
    selectedData?: {
        task: Task | null;
    };
    controls?: {
        taskControls: {
            closeTaskDetail: () => void;
            onChangeForm: (event: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>, tmpId: number) => void;
            registGoogleCalendar: (tmpId: number) => void;
        };
    };
}

export const LifeScheduleDayDetailPanel: React.FC<LifeScheduleDayDetailPanelProps> = ({
    selectedData = { task: null },
    controls = {
        taskControls: {
            closeTaskDetail: () => {},
            onChangeForm: () => {},
            registGoogleCalendar: () => {},
        },
    },
}) => {
    return (
        <>
            {selectedData.task && (
                <div className="h-full flex flex-col">
                    <div className="p-4 flex-1 overflow-y-auto">
                        <div className="flex justify-between h-[100px] mb-4">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">スケジュール名</h3>
                                <p className="text-lg font-medium">{selectedData.task.taskName}</p>
                            </div>
                            <div className="items-start h-[100px]">
                                <ButtonIconClose
                                    size="small"
                                    onClick={controls.taskControls.closeTaskDetail}
                                />
                            </div>
                        </div>

                        {/* <div className="mb-4">
                            <h3 className="text-sm font-medium text-gray-500">スケジュール種別</h3>
                            <div className="flex items-center mt-1">
                                <div className={`w-3 h-3 rounded-full ${selectedTaskProject?.color || "bg-gray-300"} mr-2`}></div>
                                <p>{selectedTaskProject?.name}</p>
                            </div>
                        </div> */}

                        <div className="mb-4">
                            <h3 className="text-sm font-medium text-gray-500">日時</h3>
                            <p className="mt-1">
                                {toTimeString(selectedData.task.startDateTime)} - {toTimeString(selectedData.task.endDateTime)}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                                {/* 所要時間: {differenceInMinutes(selectedTask.endDate, selectedTask.startDate) / 60} 時間 */}
                            </p>
                        </div>

                        {/* <div className="mb-4">
                            <h3 className="text-sm font-medium text-gray-500">ステータス</h3>
                            <div className="mt-1 inline-block px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm">
                                進行中
                            </div>
                        </div> */}

                        <div className="mb-4">
                            <h3 className="text-sm font-medium text-gray-500">備考</h3>
                            <p className="mt-1 text-gray-700">
                                <textarea
                                    name="remarks"
                                    className="w-full p-2 border rounded-md"
                                    rows={15}
                                    placeholder="備考"
                                    value={selectedData.task?.remarks || ""}
                                    onChange={(e) => controls.taskControls.onChangeForm(e, selectedData.task?.tmpId || 0)}
                                />
                            </p>
                        </div>
                    </div>

                    <div className="p-4 border-t">
                        <button
                            className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            onClick={() => controls.taskControls.registGoogleCalendar(selectedData.task?.tmpId || 0)}>
                            <span>Googleカレンダーへの登録</span>
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default LifeScheduleDayDetailPanel;