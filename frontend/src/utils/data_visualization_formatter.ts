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
  let formattedData: { xLabel?: string; yLabel?: string; values: Object[] };
  if (visualizationChoice === "Pie Chart") {
    formattedData = await getPieChartFormattedData(data);
  } else {
    formattedData = await getDefaultFormattedData(data);
  }
  return formattedData;
};

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
