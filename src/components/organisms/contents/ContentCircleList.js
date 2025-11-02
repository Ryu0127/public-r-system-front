import React from 'react';
import Select from 'components/atoms/Select';
import ButtonCyan from 'components/atoms/buttons/ButtonCyan';
import Button from 'components/atoms/buttons/Button';
import Label from 'components/atoms/texts/Label';

const ContentCircleList = ({ objects, tabs, formSelectProjects }) => {
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
              <div className="js-accordion-card-header">
                <input type="hidden" className="js-tmp-row-index" value={index} />
                <div className="flex justify-between p-3 mb-0" style={{ textDecoration: 'none', cursor: 'pointer' }}>
                  <div>
                    <div className="d-inline">
                      <label>{item.doujinCircleName}</label>
                    </div>
                  </div>
                  <div>
                    <div className="d-inline">
                    </div>
                  </div> 
                </div>
              </div>
              {/* ▲ カードヘッダー */}
              {/* ▼ カードボディ */}
              <div className="js-accordion-card-body card-body accordion-content closed">
                {item.objectDetails.map((detailItem, detailIndex) => (
                  <div>
                    <label>{detailItem.eventName}[{detailItem.purchasePlanType}]</label>
                    {/* <blockquote class="twitter-tweet">
                      <a href="#" class="js-href-twitter"></a>
                    </blockquote>
                    <blockquote class="twitter-tweet">
                      <p lang="ja" dir="ltr">ラトナプティ、星川サラ、椎名唯華、戌亥とこ　添い寝/にじさんじ 
                        <a href="https://t.co/OZeFAr8EBQ">pic.twitter.com/OZeFAr8EBQ</a>
                      </p>&mdash; らん (@AInoVLove) 
                      <a href="https://twitter.com/AInoVLove/status/1816932265685078285?ref_src=twsrc%5Etfw">July 26, 2024</a>
                    </blockquote> */}
                  </div>
                ))}
              </div>
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

export default ContentCircleList;