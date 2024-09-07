/**
 * Format data for visualization.
 * @param data
 * @param visualizationChoice
 * @returns formattedData
 */
const getFormattedData = (data: any[], visualizationChoice: string) => {
  let formattedData: {
    xLabel?: string;
    yLabel?: string;
    values?: Object[];
    tableColumns?: {
      title: string;
      dataIndex: string;
    }[];
    tableData?: any;
  };
  if (visualizationChoice === "Pie Chart") {
    formattedData = getPieChartFormattedData(data);
  } else if (visualizationChoice === "Table") {
    formattedData = getTableFormattedData(data);
  } else {
    formattedData = getDefaultFormattedData(data);
  }
  return formattedData;
};

/**
 * Format data for pie chart.
 * @param data
 */
const getPieChartFormattedData = (data: any[]) => {
  const formattedValues: any = data.map((datum: any) => {
    const keys = Object.keys(datum);
    return {
      name: `${datum[keys[0]]}`,
      value: datum[keys[1]],
    };
  });
  return {
    values: formattedValues,
  };
};

/**
 * Format data for table.
 * @param data
 */
const getTableFormattedData = (data: any[]) => {
  // Extract column definitions
  const keys: string[] = Object.keys(data[0]);
  const tableColumns: {
    title: string;
    dataIndex: string;
  }[] = keys.map((key) => ({
    title: key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    dataIndex: key,
  }));

  // Extract data
  const tableData = data.map((datum: any) => {
    const formattedDatum: any = {};
    keys.forEach((key) => {
      formattedDatum[key] = datum[key];
    });
    return formattedDatum;
  });
  return { tableColumns, tableData };
};

/**
 * Format data for all other charts since all adhere to the same format.
 * @param data
 */
const getDefaultFormattedData = (data: any[]) => {
  const keys: string[] = Object.keys(data[0]);
  const formattedValues: {
    xValue: string | number;
    yValue: string | number;
  }[] = data.map((datum: any) => ({
    xValue: datum[keys[0]],
    yValue: datum[keys[1]],
  }));
  return {
    xLabel: keys[0],
    yLabel: keys[1],
    values: formattedValues,
  };
};

export default getFormattedData;
