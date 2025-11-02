import React from 'react';
import Select from 'components/atoms/Select';
import ButtonCyan from 'components/atoms/buttons/ButtonCyan';
import Button from 'components/atoms/buttons/Button';
import Label from 'components/atoms/texts/Label';

const ContentEventList = ({ objects, tabs, formSelectProjects }) => {
  return (
    <div className="container container-fluid" style={{ width: '1050px' }}>
      <div className="fade-in row col-12 card ml-0">
        <div className="card-body">
          {/* タブエリア */}
          <div className="contents-tab mb-4">
            <ul className="d-flex justify-center mb-0 pl-0">
              {tabs.map((tab, index) => (
                <li className="js-contents-tab tab">
                  <a href={tab.href}>
                    <div className="mx-4">
                      <Label>{tab.text}</Label>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          {/* タグエリア */}
          {/* ▼ アコーディオンエリア */}
          <div className="js-accordion-area accordion sortable">
            {objects.map((item, index) => (
            <div className="js-accordion-card card mb-0" key={index}>
              {/* ▼ カードヘッダー */}
              <a href={ item.redirectUrl }>
                <div className="js-accordion-card-header">
                  <input type="hidden" className="js-tmp-row-index" value={index} />
                  <div className="flex justify-between p-3 mb-0" style={{ textDecoration: 'none', cursor: 'pointer' }}>
                    <div>
                      <div className="d-inline">
                        <label>{item.eventName}</label>
                      </div>
                    </div>
                    <div>
                      <div className="d-inline">
                      </div>
                    </div> 
                  </div>
                </div>
              </a>
              {/* ▲ カードヘッダー */}
              {/* ▼ カードボディ */}
              {/* {item.objectDetail.map((detailItem, detailIndex) => (
              <div className="js-accordion-card-body card-body accordion-content closed">
                <input type="hidden" className="js-tmp-index" value={detailItem.tmp_id} />
                <input type="hidden" name="update_flag" value={detailItem.update_flag} /> */}
                {/* ▼ 1行目 */}
                {/* <div className="flex justify-start pb-3"> */}
                  {/* <div className="pl-5">
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
                  </div> */}
                {/* </div> */}
                {/* ▲ 1行目 */}
              {/* </div> */}
              {/* ))} */}
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

export default ContentEventList;