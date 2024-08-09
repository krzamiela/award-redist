import React, { useState, useCallback, useMemo } from 'react';
import logo from './logo.svg';
import { calculateAverageWeightPerFTE, groupAwardsByDept, groupUsersByTitle, readExcelFile, FTE_VALUES } from './utils';
import './App.css';
import User from './User';


const App = () => {
  const [users, setUsers] = useState([]);
  const [awards, setAwards] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedChoice, setSelectedChoice] = useState("");

  const handleUsersFileUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      readExcelFile(file, setUsers, 'GCFA_User');
    } 
  }, []);
  
  const handleAwardsFileUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      readExcelFile(file, setAwards, 'Export');
    }
  }, []);

  const calculateTotalWeights = useCallback((users, awards) => {
    const userWeights = {};
    awards.forEach((award) => {
      if (!userWeights[award["Contract Admin"]]) {
        userWeights[award["Contract Admin"]] = 0;
      }
      userWeights[award["Contract Admin"]] += award["Weight_Total"];
    });

    return users.map((user) => ({
      ...user,
      totalWeight: userWeights[user["Contract Admin"]] || 0,
    }));
  }, []);

  const updatedUsers = useMemo(() => calculateTotalWeights(users, awards), [users, awards, calculateTotalWeights]);
  const groupedUsers = useMemo(() => groupUsersByTitle(updatedUsers), [updatedUsers]);
  const averageWeightPerFTE = useMemo(() => calculateAverageWeightPerFTE(updatedUsers), [updatedUsers]);
  const groupedAwards = useMemo(() => groupAwardsByDept(awards), [awards]);

  const handleAwdClick = (award) => {
    setSelectedItems(prevAwards => {
      if (prevAwards.some(a => a["Contract"] === award["Contract"])) {
        return prevAwards.filter(a => a["Contract"] !== award["Contract"]);
      } else {
        return [...prevAwards, award];
      }
    });
  };

  const handleDeptClick = (item) => {
    setSelectedItems(prevItems => {
      if (prevItems.some(a => a.usr === item.usr && a.dept === item.dept)) {
        return prevItems.filter(a => a.dept !== item.dept);
      } else {
        return [...prevItems, item];
      }
    });
  }

  const handleChoiceChange = (event) => {
    setSelectedChoice(event.target.value);
  };

  const handleUserSelect = (e) => {
    setSelectedUserId(e.target.value);
  };

  const handleReassign = () => {
    if (selectedChoice === "awd") {
      if (selectedUserId) {
        setAwards(prevAwards => {
          return prevAwards.map(award =>
            selectedItems.some(a => a["Contract"] === award["Contract"])
              ? { ...award, "Contract Admin": selectedUserId }
              : award
          );
        });
        setSelectedItems([]);
        setSelectedUserId(null);
      }
    }
    else if (selectedChoice === "dept") {
      if (selectedUserId) {
          setAwards(prevAwards => {
            return prevAwards.map(award =>
              selectedItems.some(a => a.key === award["Contract Admin"] + " " + award["Dept Name"])
              ? {...award, "Contract Admin": selectedUserId}
              : award
            );
          });
        setSelectedItems([]);
        setSelectedUserId(null);
      }
    }
  };

  return (
    <div className="App">
      <h1>Award Redistribution</h1>
      <div className="fileUpload">
        <h4>Upload Award File</h4>
        <input type="file" onChange={handleAwardsFileUpload} />
        <h4>Upload User File</h4>
        <input type="file" onChange={handleUsersFileUpload} />
      <h2>Select an Option</h2>
      <select value={selectedChoice} onChange={handleChoiceChange}>
        <option value="" disabled>Select one</option>
        <option value="awd">Reassign Individual Awards</option>
        <option value="dept">Reassign Awards By Department</option>
      </select>
      </div>
      <div className="sidebar">
          <h3>Selected Items</h3>
          {selectedChoice === "awd" && (
            <ul>
              {selectedItems.map(award => (
                <li key={award["Contract"]}>
                  {award["Contract"]}: {award["Weight_Total"]}
                </li>
              ))}
            </ul>
          )}
          {selectedChoice === "dept" && (
            <ul>
              {selectedItems.map(item => (
                <li key={item.usr + " " + item.dept}>
                  {item.usr + ", " + item.dept}: {item.totalWeight}
                </li>
              ))}
            </ul>
          )}
          <h4>Reassign to:</h4>
          <select onChange={handleUserSelect} value={selectedUserId || ''}>
            <option value="" disabled>Select User</option>
            {users.map(user => (
              <option key={user.id} value={user["Contract Admin"]}>
                {user["Contract Admin"]}
              </option>
            ))}
          </select>
          <button onClick={handleReassign}>Reassign Awards</button>
        </div>
        {selectedChoice !== "" &&  (
          <div className="users">
          {Object.keys(groupedUsers).map((title) => {
            const avgWeight = averageWeightPerFTE * FTE_VALUES[title];

            return (
              <div key={title} className="user-group">
                <h2>{title} Average Weight: {avgWeight.toFixed(2)}</h2>
                <div className="user-container">
                  {groupedUsers[title].map((user) => (
                    <User
                      key={user["Contract Admin"]}
                      user={user}
                      awards={selectedChoice === "awd" ? awards.filter((award) => award["Contract Admin"] === user["Contract Admin"]) : Object.values(groupedAwards).flat().filter((award) => award.usr === user["Contract Admin"])}
                      displayType={selectedChoice}
                      highlightedItems={selectedItems}
                      averageWeight={avgWeight}
                      onItemClick={selectedChoice === "awd" ? handleAwdClick : handleDeptClick}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        )}
      </div>
  );
};

export default App;
