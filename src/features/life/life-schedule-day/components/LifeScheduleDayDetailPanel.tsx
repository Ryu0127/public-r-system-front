import React from 'react';
import ButtonIconClose from 'components/atoms/buttons/ButtonIconClose';
import { Task } from '../hooks/useLifeScheduleDayState';

/**
 * Dateオブジェクトをdatetime-local形式（YYYY-MM-DDTHH:mm）に変換
 */
const formatDateTimeLocal = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export interface LifeScheduleDayDetailPanelProps {
    selectedData?: {
        task: Task | null;
    };
    controls?: {
        taskControls: {
            closeTaskDetail: () => void;
            onChangeForm: (event: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement | HTMLInputElement>, tmpId: number) => void;
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
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex-1 mr-4">
                                <h3 className="text-sm font-medium text-gray-500 mb-1">スケジュール名</h3>
                                <textarea
                                    name="taskName"
                                    className="w-full p-2 border rounded-md text-lg font-medium"
                                    rows={6}
                                    placeholder="スケジュール名"
                                    value={selectedData.task.taskName}
                                    onChange={(e) => controls.taskControls.onChangeForm(e, selectedData.task?.tmpId || 0)}
                                    style={{ resize: 'none' }}
                                />
                            </div>
                            <div className="items-start">
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
                            <h3 className="text-sm font-medium text-gray-500 mb-2">日時</h3>
                            <div className="space-y-2">
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">開始日時</label>
                                    <input
                                        type="datetime-local"
                                        name="startDateTime"
                                        className="w-full p-2 border rounded-md"
                                        value={formatDateTimeLocal(selectedData.task.startDateTime)}
                                        onChange={(e) => controls.taskControls.onChangeForm(e, selectedData.task?.tmpId || 0)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">終了日時</label>
                                    <input
                                        type="datetime-local"
                                        name="endDateTime"
                                        className="w-full p-2 border rounded-md"
                                        value={formatDateTimeLocal(selectedData.task.endDateTime)}
                                        onChange={(e) => controls.taskControls.onChangeForm(e, selectedData.task?.tmpId || 0)}
                                    />
                                </div>
                            </div>
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
                                    rows={10}
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