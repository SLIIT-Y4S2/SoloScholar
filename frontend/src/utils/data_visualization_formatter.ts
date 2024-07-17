const getFormattedData = async (data: any, visualizationChoice: string) => {
  let formattedData: any;
  switch (visualizationChoice) {
    case "Bar Chart":
    // TODO
    case "Pie Chart":
      formattedData = await getPieChartFormattedData(data);
      break;
    case "Line Chart":
      // TODO
      break;
    case "Dougnout Chart":
      // TODO
      break;
    default:
      formattedData = data;
  }
  return await formattedData;
};

/**
 * Format data for pie chart.
 * @param data
 */
const getPieChartFormattedData = async (data: any) => {
  return data.map((datum: any) => {
    const keys = Object.keys(datum);
    return {
      name: `${keys[0]}-${datum[keys[0]]}`,
      value: datum[keys[1]],
    };
  });
};

export default getFormattedData;
