import React from 'react';
import Select from 'components/atoms/Select';
import ButtonCyan from 'components/atoms/buttons/ButtonCyan';
import Button from 'components/atoms/buttons/Button';

const getSelectOptionsWorkTypes = () => {
  return [
    {text: '選択してください', value: ''},
    {text: '出勤', value: '10'},
    {text: '休日出勤', value: '11'},
    {text: '休日', value: '20'},
    {text: '会社指定休暇', value: '21'},
    {text: '代休消化', value: '22'},
    {text: '有給休暇(全休)', value: '30'},
    {text: '有給休暇(午前休)', value: '31'},
    {text: '有給休暇(午後休)', value: '32'},
    {text: '遅刻', value: '90'},
    {text: '早退', value: '91'},
    {text: '遅刻+早退', value: '92'},
    {text: '欠勤', value: '93'},
  ];
}

const getWorkPhases = () => {
  return [
    {text: '選択してください', value: ''},
    {text: '要件定義', value: '0'},
    {text: '外部設計', value: '1'},
    {text: '内部設計', value: '2'},
    {text: '製造', value: '3'},
    {text: '単体テスト', value: '4'},
    {text: '結合テスト', value: '5'},
    {text: 'その他', value: '6'},
  ];
}

const getWorkProjects = (formSelectProjects) => {
  var mappingWorkProjects = [
    { text: "選択してください", value: "" }
  ];
  mappingWorkProjects = [
    ...mappingWorkProjects,
    ...formSelectProjects.map(item => ({
      text: item.text,
      value: item.val,
    })),
  ];
  return mappingWorkProjects;
}

const getSelectOptionHour = () => {
  return Array.from({ length: 49 }, (_, i) => {
    const value = String(i).padStart(2, '0');
    return { text: value, value: value };
  });
}

const getSelectOptionMin = () => {
  return [
    {text: '00', value: '00'},
    {text: '15', value: '15'},
    {text: '30', value: '30'},
    {text: '45', value: '45'},
  ];
}

const ContentWorkProjectMonthlyAtenndance = ({ objects, formSelectProjects }) => {
  return (
    <div className="container container-fluid" style={{ width: '1050px' }}>
      <div className="fade-in row col-12 card ml-0">
        <div className="card-body">
          {/* ▼ アコーディオンエリア */}
          <div className="js-accordion-area accordion sortable">
            {objects.map((item, index) => (
            <div className="js-accordion-card card mb-0" key={index}>
              {/* ▼ カードヘッダー */}
              <div className="js-accordion-card-header">
                <input type="hidden" className="js-tmp-row-index" value={index} />
                <div className="flex justify-between p-3 mb-0" style={{ textDecoration: 'none', cursor: 'pointer' }}>
                  <div>
                    <div className="d-inline">
                      <label>{item.day}</label>
                      <label>{item.view_day_of_the_week}</label>
                      <label>[{item.work_type}]</label>
                    </div>
                  </div>
                  <div>
                    <div className="d-inline">
                      <label>{item.start_time}</label>
                      <label>-</label>
                      <label>{item.end_time}</label>
                      <label>[</label>
                      <label>{item.operating_time}h</label>
                      <label>({item.over_time}h)</label>
                      <label>]</label>
                    </div>
                  </div> 
                </div>
              </div>
              {/* ▲ カードヘッダー */}
              {/* ▼ カードボディ */}
              {item.objectDetail.map((detailItem, detailIndex) => (
              <div className="js-accordion-card-body card-body accordion-content closed">
                <input type="hidden" className="js-tmp-index" value={detailItem.tmp_id} />
                <input type="hidden" name="update_flag" value={detailItem.update_flag} />
                {/* ▼ 1行目 */}
                <div className="flex justify-start pb-3">
                  <div className="pl-5">
                    <label>稼働区分</label>
                    <div className="flex w-44">
                      <Select name="work_type" addClass="form-control" options={getSelectOptionsWorkTypes()} value={detailItem.work_type} />
                    </div>
                  </div>
                  <div className="pl-5">
                    <label>開始時間</label>
                    <div className="flex w-32">
                      <Select name="start_time_hour" addClass="form-control" options={getSelectOptionHour()} value={detailItem.start_time_hour} />
                      <Select name="start_time_min" addClass="form-control ml-2" options={getSelectOptionMin()} value={detailItem.start_time_min} />
                    </div>
                  </div>
                  <div className="pl-5">
                    <label>終了時間</label>
                    <div className="flex w-32">
                      <Select name="end_time_hour" addClass="form-control" options={getSelectOptionHour()} value={detailItem.end_time_hour} />
                      <Select name="end_time_min" addClass="form-control ml-2" options={getSelectOptionMin()} value={detailItem.end_time_min} />
                    </div>
                  </div>
                  <div className="pl-5">
                    <label>休憩時間</label>
                    <div className="flex w-32">
                      <Select name="break_time_hour" addClass="form-control" options={getSelectOptionHour()} value={detailItem.break_time_hour} />
                      <Select name="break_time_min" addClass="form-control ml-2" options={getSelectOptionMin()} value={detailItem.break_time_min} />
                    </div>
                  </div>
                </div>
                {/* ▲ 1行目 */}
                {/* ▼ 2行目 */}
                <div className="flex justify-start pb-3">
                  <div className="pl-5">
                    <label>作業フェーズ</label>
                    <div className="flex w-44">
                      <Select name="work_phase" addClass="form-control" options={getWorkPhases()} value={detailItem.work_phase} />
                    </div>
                  </div>
                  <div className="w-full pl-5">
                    <label>作業プロジェクト</label>
                    <div className="flex">
                      <Select name="project_info_id" addClass="form-control" options={getWorkProjects(formSelectProjects)} value={detailItem.project_info_id} />
                    </div>
                  </div>
                </div>
                {/* ▲ 2行目 */}
                {/* ▼ 3行目 */}
                <div className="pb-3">
                  <div className="pl-5">
                    <label>主な作業内容</label>
                    <div className="flex">
                      <textarea
                        name="work_detail"
                        className="form-control"
                        rows="2"
                        cols="20"
                        placeholder=""
                        defaultValue={detailItem.work_detail}
                      />
                    </div>
                  </div>
                </div>
                {/* ▲ 3行目 */}
                {/* ▼ 4行目 */}
                <div className="pb-3">
                  <div className="pl-5">
                    <label>備考</label>
                    <div className="flex">
                      <textarea
                        name="remarks"
                        className="form-control"
                        rows="2"
                        cols="20"
                        placeholder=""
                        defaultValue={detailItem.remarks}
                      />
                    </div>
                  </div>
                </div>
                {/* ▲ 4行目 */}
                {/* ▼ 5行目 */}
                <div className="">
                  <div className="text-right pt-2">
                    {item.objectDetail.map((pageItem, pageIndex) => (
                    <div className="js-page d-inline pl-3">
                      <input type="hidden" className='js-tmp-page-index' value={pageItem.tmp_id} />
                      <ButtonCyan addClass="js-page-btn w-12" text={pageIndex + 1} />
                    </div>
                    ))}
                    <div className="d-inline pl-3">
                      <Button addClass="js-page-add-btn w-12" text="+" />
                    </div>
                  </div>
                </div>
                {/* ▲ 5行目 */}
              </div>
              ))}
              {/* ▲ カードボディ */}
            </div>
            ))}
          </div>
          {/* <!-- ▲ アコーディオンエリア --> */}
        </div>
      </div>
    </div>
  );
};

export default ContentWorkProjectMonthlyAtenndance;