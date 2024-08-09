import React from 'react';

interface ItemProps {
  item: {
    "Contract"?: string;
    "Weight_Total"?: number;
    dept?: string;
    totalWeight?: number;
  };
  displayType: string;
  isHighlighted: boolean;
  onClick: () => void;
}

const Item: React.FC<ItemProps> = React.memo(({ item, displayType, isHighlighted, onClick }) => {
  if (displayType === "awd" && item["Contract"] && item["Weight_Total"] !== undefined) {
    return (
      <div className={`item ${isHighlighted ? 'highlighted' : ''}`} onClick={onClick}>
        {item["Contract"]}: {item["Weight_Total"]}
      </div>
    );
  } else if (displayType === "dept" && item.dept && item.totalWeight !== undefined) {
    return (
      <div className={`item ${isHighlighted ? 'highlighted' : ''}`} onClick={onClick}>
        {item.dept}: {item.totalWeight}
      </div>
    );
  }

  return null; // Fallback in case of missing or invalid item data
});

export default Item;