import React from 'react';

/**
 * コンテンツ：
 */
const ContentsVideos = ({ objects, cssRedirectBtn }) => {
  return (
    <div className="">
      <div id="image-container" className="container d-flex flex-wrap bg-light">
      {objects.map((object, index) => (
        <div>
          <div className="p-3">
            <video width="380" controls>
              <source src={object.filePath} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div>
            <label>{object.title}</label>
          </div>
        </div>
      ))}
      </div>
    </div>
  );
};

export default ContentsVideos;
