import * as XLSX from 'xlsx';

// Define the FTE values for each title
export const FTE_VALUES: Record<string, number> = {
  'GCFA': 1.0,
  'Senior GCFA': 0.75,
  'Director': 0.5,
};

// Define the User and Award interfaces for type safety
interface User {
  "User Title": string;
  "Contract Admin": string;
  totalWeight?: number;
}

interface Award {
  "Contract Admin": string;
  "Dept Name": string;
  "Weight_Total": string;
}

// Filter users based on their title
export const filterUsers = (data: User[]): User[] => {
  return data.filter(user =>
    user["User Title"] === "GCFA" ||
    user["User Title"] === "Senior GCFA" ||
    user["User Title"] === "Director"
  );
};

// Calculate average weight per FTE
export const calculateAverageWeightPerFTE = (users: User[]): number => {
  let totalWeight = 0;
  let totalFTE = 0;

  users.forEach(user => {
    const userFTE = FTE_VALUES[user["User Title"]] || 0;
    totalFTE += userFTE;
    totalWeight += user.totalWeight || 0;
  });

  return totalFTE > 0 ? totalWeight / totalFTE : 0;
};

// Read Excel file and set data, filtering users if necessary
export const readExcelFile = (file: File, setData: (data: any[]) => void, sheetName: string): void => {
  const reader = new FileReader();
  reader.onload = (e: ProgressEvent<FileReader>) => {
    const data = new Uint8Array(e.target?.result as ArrayBuffer);
    const workbook = XLSX.read(data, { type: 'array' });
    const sheet = workbook.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json<User>(sheet);

    // Debugging output
    console.log(json);

    // If reading users, filter them by title
    if (sheetName === "GCFA_User") {
      const filteredData = filterUsers(json);
      console.log(filteredData);
      setData(filteredData);
    } else {
      setData(json);
    }
  };
  reader.readAsArrayBuffer(file);
};

// Group awards by department, aggregating their total weight
export const groupAwardsByDept = (awards: Award[]): Record<string, { key: string; usr: string; dept: string; totalWeight: number }> => {
  return awards.reduce((acc, award) => {
    const deptKey = `${award["Contract Admin"]} ${award["Dept Name"]}`;
    const weight = parseFloat(award["Weight_Total"]);

    if (!acc[deptKey]) {
      acc[deptKey] = { key: deptKey, usr: award["Contract Admin"], dept: award["Dept Name"], totalWeight: 0 };
    }
    acc[deptKey].totalWeight += weight;

    return acc;
  }, {} as Record<string, { key: string; usr: string; dept: string; totalWeight: number }>);
};

// Group users by their title
export const groupUsersByTitle = (users: User[]): Record<string, User[]> => {
  return users.reduce((acc, user) => {
    if (!acc[user["User Title"]]) {
      acc[user["User Title"]] = [];
    }
    acc[user["User Title"]].push(user);
    return acc;
  }, {} as Record<string, User[]>);
};