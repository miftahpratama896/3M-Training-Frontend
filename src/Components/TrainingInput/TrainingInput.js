import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const TrainingInput = () => {
  const [data, setData] = useState([]);
  const [selectedFactory, setSelectedFactory] = useState("");
  const [selectedLine, setSelectedLine] = useState("");
  const [selectedMP, setSelectedMP] = useState("");
  const [rows, setRows] = useState([{ date: "", training: "" }]);
  const [trainingPlanOptions, setTrainingPlanOptions] = useState([]);

  useEffect(() => {
    const fetchTrainingData = async () => {
      try {
        const response = await fetch('http://172.16.206.4:1000/api/training');
        if (response.ok) {
          const data = await response.json();
          setData(data); // Store the fetched data
        } else {
          throw new Error('Failed to fetch training data.');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchTrainingData();
  }, []);

  useEffect(() => {
    if (selectedFactory && selectedLine) {
      const filteredData = data.filter(row => row.FACTORY === selectedFactory && row.LINE === selectedLine);
      const uniqueTrainingPlans = [...new Set(filteredData.map(row => row['TRAINING PLAN']))];
      setTrainingPlanOptions(uniqueTrainingPlans);
      setSelectedMP(uniqueTrainingPlans[0] || ""); // Set default value to the first option
    }
  }, [selectedFactory, selectedLine, data]);

  const handleFactoryChange = (event) => {
    setSelectedFactory(event.target.value);
    setSelectedLine(""); // Reset line selection when factory changes
  };

  const handleLineChange = (event) => {
    setSelectedLine(event.target.value);
  };

  const handleMPChange = (event) => {
    setSelectedMP(event.target.value);
  };

  console.log(data)

  const renderLineOptions = () => {
    if (selectedFactory === "1") {
      return data
        .filter(row => row.FACTORY === "1") // Filter data based on selectedFactory
        .map(row => (
          <option key={row.LINE} value={row.LINE}>
            {row.LINE}
          </option>
        ));
    } else if (selectedFactory === "2") {
      return data
        .filter(row => row.FACTORY === "2") // Filter data based on selectedFactory
        .map(row => (
          <option key={row.LINE} value={row.LINE}>
            {row.LINE}
          </option>
        ));
    }
    return null;
  };

  const handleDateChange = (index, value) => {
    const newRows = [...rows];
    newRows[index].date = value;
    setRows(newRows);
  };

  const handleTrainingChange = (index, value) => {
    const newRows = [...rows];
    newRows[index].training = value;
    setRows(newRows);
  };

  const addRow = () => {
    setRows([...rows, { date: "", training: "" }]);
  };

  const handleSave = async () => {
    try {
      const newData = rows.map((row, index) => ({
        ID: index + 1,
        FACTORY: selectedFactory,
        LINE: selectedLine,
        DATE: row.date,
        "ACTUAL TRAINING": row.training,
        MP: selectedMP
      }));

      const response = await fetch('http://172.16.206.4:1000/saveData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: newData })
      });

      if (response.ok) {
        const result = await response.json();
        alert(result.message); // Menampilkan notifikasi keberhasilan
        window.location.reload(); // Refresh halaman setelah berhasil menyimpan data
      } else {
        throw new Error('Gagal menyimpan data ke Excel.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan. Silakan coba lagi.');
    }
  };


  return (
    <>
      <main className="py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-1">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center py-3">
              <div className="sm:flex-auto">
                <h1 className="text-base font-semibold leading-6 text-gray-900">
                  Training
                </h1>
                <p className="mt-2 text-sm text-gray-700">
                  Training Input Form
                </p>
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-4">
                <div className="flex space-x-4">
                  <div>
                    <label htmlFor="factory" className="block text-sm font-medium text-gray-700">
                      FACTORY
                    </label>
                    <select
                      id="factory"
                      value={selectedFactory}
                      onChange={handleFactoryChange}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                      <option value="" disabled>Select a factory</option>
                      <option value="1">F1</option>
                      <option value="2">F2</option>
                    </select>
                  </div>
                  <div className="flex items-end space-x-2">
                    <div>
                      <label htmlFor="line" className="block text-sm font-medium text-gray-700">
                        LINE
                      </label>
                      <select
                        id="line"
                        value={selectedLine}
                        onChange={handleLineChange}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        disabled={!selectedFactory}
                      >
                        <option value="" disabled>Select a line</option>
                        {renderLineOptions()}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="mp" className="block text-sm font-medium text-gray-700">
                        TOTAL MP
                      </label>
                      <input
                        type="number"
                        id="mp"
                        value={selectedMP}
                        onChange={handleMPChange}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        disabled={!selectedFactory || !selectedLine}
                        min="0" // Nilai minimum yang dapat dimasukkan adalah 0
                      />
                    </div>
                    <button
                      onClick={handleSave}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flow-root">
              <div className="relative -mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                  <div className="shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                    <div className="max-h-[70vh] max-w-screen">
                      <table className="min-w-full divide-y divide-neutral-950 ">
                        <thead className="bg-slate-300">
                          <tr className="sticky top-0 text-white z-10 bg-gray-900 whitespace-nowrap">
                            <th
                              scope="col"
                              className="px-2 py-2 text-center text-sm font-semibold"
                            >
                              TRAINING DATE
                            </th>
                            <th
                              scope="col"
                              className="px-2 py-2 text-center text-sm font-semibold"
                            >
                              ACTUAL TRAINING
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y bg-white">
                          {rows.map((row, index) => (
                            <tr key={index}>
                              <td className="px-2 py-2 text-center">
                                <input
                                  type="date"
                                  value={row.date}
                                  onChange={(e) => handleDateChange(index, e.target.value)}
                                  className="mt-1 block w-full pl-3 pr-10 py-1 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                />
                              </td>
                              <td className="px-2 py-2 text-center">
                                <input
                                  type="text"
                                  value={row.training}
                                  onChange={(e) => handleTrainingChange(index, e.target.value)}
                                  className="mt-1 block w-full pl-3 pr-10 py-1 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <button
                        onClick={addRow}
                        className="mt-2 ml-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                      >
                        Add Data
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default TrainingInput;

