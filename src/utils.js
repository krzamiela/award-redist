import * as XLSX from 'xlsx';

export const FTE_VALUES = {
  'GCFA': 1.0,
  'Senior GCFA': 0.75,
  'Director': 0.5,
};

export const filterUsers = (data) => {
  return data.filter(user => 
    user["User Title"] === "GCFA" ||
    user["User Title"] === "Senior GCFA" ||
    user["User Title"] === "Director"
  );
};

export const calculateAverageWeightPerFTE = (users) => {
  let totalWeight = 0;
  let totalFTE = 0;

  users.forEach(user => {
    const userFTE = FTE_VALUES[user["User Title"]] || 0;
    totalFTE += userFTE;

    totalWeight += user.totalWeight;
  });

  return totalFTE > 0 ? totalWeight / totalFTE : 0;
};

export const readExcelFile = (file, setData, sheetName) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const sheet = workbook.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json(sheet);
    // debug
    console.log(json);

    // if users, filter by current users
    if(sheetName === "GCFA_User") {
      const filteredData = filterUsers(json);
      console.log(filteredData);
      setData(filteredData);
    }
    else {
      setData(json);
    }
  };
  reader.readAsArrayBuffer(file);
};

export const groupAwardsByDept = (awards) => {
  return awards.reduce((acc, award) => {
      const deptKey = award["Contract Admin"] + " " + award["Dept Name"];
      const weight = parseFloat(award["Weight_Total"]);
  
      if (!acc[deptKey]) {
        acc[deptKey] = { key: deptKey, usr: award["Contract Admin"], dept: award["Dept Name"], totalWeight: 0 };
      }
      acc[deptKey].totalWeight += weight;
  
      return acc;
    }, {});
};

export const groupUsersByTitle = (users) => {
  return users.reduce((acc, user) => {
    if (!acc[user["User Title"]]) {
      acc[user["User Title"]] = [];
    }
    acc[user["User Title"]].push(user);
    return acc;
  }, {});
};