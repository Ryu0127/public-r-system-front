import React from 'react'

const ContentHome = ({ data }) => {
  return (
    <div className="container container-fluid flex justify-center">
      <div className="fade-in row col-12 card ml-0">
        <div className="card-body">
          <table className="table table-hover table-responsive-sm">
            <thead>
              <tr>
              <th className="col-1">No</th>
                <th className="col-11">システム一覧</th>
              </tr>
            </thead>
            <tbody>
            {data.map((item, index) => (
              <tr className="js-table-row">
                <td>{index + 1}</td>
                <td>{item.systemName}</td>
              </tr>
            ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ContentHome