import Label from 'components/atoms/texts/Label';

const TabContents = ({ tabs }) => {
    return (
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
    );
};

export default TabContents;
