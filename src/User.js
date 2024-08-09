import React, { useMemo } from 'react';
import Item from './Item';

const User = React.memo(({ user, awards, displayType, highlightedItems, averageWeight, onItemClick }) => {
    const isAboveAverage = useMemo(() => user.totalWeight > averageWeight, [user.totalWeight, averageWeight]);

    console.log(awards);

    const isItemHighlighted = (item) => {
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
                        <Item key={award["Contract"]}
                        item={award}
                        displayType={displayType}
                        isHighlighted={highlightedItems.includes(award)}
                        onClick={() => onItemClick(award)} 
                        />
                    ))}
                </div>
            </div>
        );
    }
    else if (displayType === "dept") {    
        return (
            <div className="user">
                <h3>{user["Contract Admin"]}</h3>
                <p style={{ color: isAboveAverage ? 'red' : 'black' }}>
                    Total Weight: {user.totalWeight}
                </p>
                <div className="items">
                    {Object.keys(awards).map((dept) => (
                        <Item key={user["Contract Admin"] + " " + awards[dept].dept}
                        item={awards[dept]}
                        displayType={displayType}
                        isHighlighted={isItemHighlighted(awards[dept])}
                        onClick={() => onItemClick(awards[dept])} 
                        />
                    ))}
                </div>
            </div>
        );
    }
});

export default User;