import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import EnergyChart from "./EnergyChart";
import { fetchConsumptionData } from "../utils/ApiFunctions";

const HistoricalConsumption = ({ deviceId }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [consumptionData, setConsumptionData] = useState([]);
  const [chartType, setChartType] = useState("line");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const formattedDate = selectedDate.toISOString().split("T")[0];
        const data = await fetchConsumptionData(deviceId, formattedDate);
        setConsumptionData(data);
      } catch (error) {
        console.error("Error fetching consumption data:", error);
      }
    };

    fetchData();
  }, [selectedDate, deviceId]);

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h2>Historical Energy Consumption</h2>
      <div>
        <label>Select Date: </label>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="yyyy-MM-dd"
        />
      </div>
      <div>
        <label>Chart Type: </label>
        <select
          value={chartType}
          onChange={(e) => setChartType(e.target.value)}
        >
          <option value="line">Line Chart</option>
          <option value="bar">Bar Chart</option>
        </select>
      </div>
      {consumptionData.length > 0 ? (
        <EnergyChart data={consumptionData} chartType={chartType} />
      ) : (
        <p>No data available for the selected day.</p>
      )}
    </div>
  );
};

export default HistoricalConsumption;
