import React from 'react';
import Label from 'components/atoms/texts/Label';

/**
 * コンテンツ：
 */
const ContentsDoujins = ({ objects, tabs, cssRedirectBtn }) => {
  return (
    <div>
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
      <div id="image-container" className="container d-flex flex-wrap justify-around bg-light">
      {objects.map((object, index) => (
        <div className="js-img pb-3">
          <input type="hidden" className="js-img-id" value={object.id} />
          <img className={cssRedirectBtn + ' hover book-img'} src={object.imgPath} alt={object.id} />
        </div>
      ))}
      </div> 
    </div>
  );
};

export default ContentsDoujins;
