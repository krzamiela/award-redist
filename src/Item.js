import React from 'react';

const Item = React.memo(({ item, displayType, isHighlighted, onClick }) => {
  if (displayType === "awd") {
      return (
        <div className={`item ${isHighlighted ? 'highlighted' : ''}`} onClick={onClick}>
          {item["Contract"]}: {item["Weight_Total"]}
        </div>
      );
    }
  else if (displayType === "dept") {
    return (
      <div className={`item ${isHighlighted ? 'highlighted' : ''}`} onClick={onClick}>
        {item.dept}: {item.totalWeight}
      </div>
    );
  }
});

  export default Item;