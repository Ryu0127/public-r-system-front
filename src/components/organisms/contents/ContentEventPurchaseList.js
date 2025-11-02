import React, { useState, useRef, useEffect } from 'react';
import Button from 'components/atoms/buttons/Button';
import Label from 'components/atoms/texts/Label';

const ContentEventPurchaseList = ({ 
  objects, 
  tabs, 
  onDragEnd, 
  onAdd, 
}) => {
  const [list, setList] = useState(objects);
  const [dragging, setDragging] = useState(false);
  const dragItem = useRef();
  const dragNode = useRef();

  useEffect(() => {
    setList(objects);
  }, [objects]);

  const handleDragStart = (e, params) => {
    dragItem.current = params;
    dragNode.current = e.target;
    dragNode.current.addEventListener('dragend', handleDragEnd);
    setTimeout(() => {
      setDragging(true);
    }, 0);
  };

  const handleDragEnter = (e, params) => {
    const currentItem = dragItem.current;
    if (e.target !== dragNode.current) {
      setList(oldList => {
        let newList = JSON.parse(JSON.stringify(oldList));
        newList.splice(params.index, 0, newList.splice(currentItem.index, 1)[0]);
        dragItem.current = params;
        return newList;
      });
    }
  };

  const handleDragEnd = (e) => {
    setDragging(false);
    dragNode.current.removeEventListener('dragend', handleDragEnd);
    dragItem.current = null;
    dragNode.current = null;
    onDragEnd(list);
  };

  const getStyles = (params) => {
    const currentItem = dragItem.current;
    if (currentItem.index === params.index) {
      return "current js-hover-card card mb-0";
    }
    return "js-hover-card card mb-0";
  };

  return (
    <div className="container container-fluid" style={{ width: '1050px' }}>
      <div className="fade-in row col-12 card ml-0">
        {/* タブエリア */}
        <div className="contents-tab">
          <ul className="d-flex justify-center mb-0 pl-0">
            {tabs.map((tab, index) => (
              <li key={index} className="js-contents-tab tab">
                <a href={tab.href}>
                  <div className="mx-4">
                    <Label>{tab.text}</Label>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="card-body">
          {/* アコーディオンエリア */}
          <div className="accordion sortable" id="accordion">
            {list.map((item, index) => (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, {index})}
                onDragEnter={dragging ? (e) => handleDragEnter(e, {index}) : null}
                className={dragging ? getStyles({index}) : "js-hover-card card mb-0"}
              >
                {/* カードヘッダー */}
                <div className="">
                  <div className="flex justify-between p-3 mb-0" style={{ textDecoration: 'none', cursor: 'move' }}>
                    <div>
                      <div className="d-inline">
                        <label>{index + 1} | {item.placement_name}[{item.placement_detail_name}] | {item.author_name}[{item.doujin_circle_name}] [販売情報あり]</label>
                      </div>
                    </div>
                    <div>
                      <label>￥{Number(item.expected_purchase_amount).toLocaleString()}</label>
                    </div>
                  </div>
                </div>
                {/* カードボディ */}
              </div>
            ))}
          </div>
          <div>
            <Button className="btn btn-success col-1" onClick={onAdd} text="追加" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentEventPurchaseList;