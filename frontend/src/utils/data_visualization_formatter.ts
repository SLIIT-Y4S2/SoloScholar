/**
 * Format data for visualization.
 * @param data
 * @param visualizationChoice
 * @returns formattedData
 */
const getFormattedData = async (
  data: Object[],
  visualizationChoice: string
) => {
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
    formattedData = await getPieChartFormattedData(data);
  } else if (visualizationChoice === "Table") {
    formattedData = await getTableFormattedData(data);
  } else {
    formattedData = await getDefaultFormattedData(data);
  }
  return formattedData;
};

/**
 * TODO Define a function to check for data types and no.of keys in the input data. Accordingly appropriate
 * data formatting function should be called.
 */

/**
 * Format data for pie chart.
 * @param data
 */
const getPieChartFormattedData = async (data: any) => {
  const formattedValues: any = data.map((datum: any) => {
    const keys = Object.keys(datum);
    return {
      name: `${keys[0]}-${datum[keys[0]]}`,
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
const getTableFormattedData = async (data: any) => {
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
const getDefaultFormattedData = async (data: Object[]) => {
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
