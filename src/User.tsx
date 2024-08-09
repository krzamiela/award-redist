import React, { useMemo } from 'react';
import Item from './Item';

interface UserProps {
  user: {
    "Contract Admin": string;
    totalWeight?: number;
    [key: string]: any;
  };
  awards: any[];
  displayType: string;
  highlightedItems: any[];
  averageWeight: number;
  onItemClick: (item: any) => void;
}

const User: React.FC<UserProps> = React.memo(({ user, awards, displayType, highlightedItems, averageWeight, onItemClick }) => {
  const isAboveAverage = useMemo(() => user.totalWeight! > averageWeight, [user.totalWeight, averageWeight]);

  const isItemHighlighted = (item: any) => {
    return highlightedItems.some(highlighted => highlighted.key === item.key);
  };

  if (displayType === "awd") {
    return (
      <div className="user">
        <h3>{user["Contract Admin"]}</h3>
        <p style={{ color: isAboveAverage ? 'red' : 'black' }}>
          Total Weight: {user.totalWeight}
        </p>
        <div className="items">
          {awards.map((award) => (
            <Item
              key={award["Contract"]}
              item={award}
              displayType={displayType}
              isHighlighted={highlightedItems.includes(award)}
              onClick={() => onItemClick(award)}
            />
          ))}
        </div>
      </div>
    );
  } else if (displayType === "dept") {
    return (
      <div className="user">
        <h3>{user["Contract Admin"]}</h3>
        <p style={{ color: isAboveAverage ? 'red' : 'black' }}>
          Total Weight: {user.totalWeight}
        </p>
        <div className="items">
          {awards.map((deptAward) => (
            <Item
              key={`${user["Contract Admin"]} ${deptAward.dept}`}
              item={deptAward}
              displayType={displayType}
              isHighlighted={isItemHighlighted(deptAward)}
              onClick={() => onItemClick(deptAward)}
            />
          ))}
        </div>
      </div>
    );
  }

  return null; // Fallback in case no displayType matches
});

export default User;