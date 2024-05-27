import React, { useState, useEffect, useCallback } from "react";
import debounce from 'lodash.debounce';

const fetchEmployeeData = async (id, setDataEmployee, setUpdating) => {
  try {
    setUpdating(true);
    const url = id ? `http://172.16.206.4:1000/api/employee?id=${id}` : 'http://172.16.206.4:1000/api/employee';
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      setDataEmployee(data);
    } else {
      throw new Error('Failed to fetch employee data.');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    setUpdating(false);
  }
};

const ValidationInput = () => {
  const [data, setData] = useState([]);
  const [dataTrainingProcess, setDataTrainingProcess] = useState([]);
  const [dataEmployee, setDataEmployee] = useState([]);
  const [selectedFactory, setSelectedFactory] = useState("");
  const [selectedLine, setSelectedLine] = useState("");
  const [selectedMP, setSelectedMP] = useState("");
  const [rows, setRows] = useState([{ date: "", NIK: "", NAME: "", "MAIN PROCESS": "", PROCESS: "", "VALIDATION STATUS": "", SCORE: "" }]); // Update initial state to match API data structure
  const [trainingPlanOptions, setTrainingPlanOptions] = useState([]);
  const [mainProcessOptions, setMainProcessOptions] = useState([]);
  const [processOptions, setProcessOptions] = useState([]);
  const [selectedNIK, setselectedNIK] = useState("");
  const [selectedName, setselectedName] = useState("");
  const [autoUpdate, setAutoUpdate] = useState(false);
  const [updating, setUpdating] = useState(false);

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

    const fetchTrainingProcessData = async () => {
      try {
        const response = await fetch('http://172.16.206.4:1000/api/training-process');
        if (response.ok) {
          const data = await response.json();
          setDataTrainingProcess(data); // Store the fetched data
        } else {
          throw new Error('Failed to fetch training data.');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchTrainingData();
    fetchTrainingProcessData();
  }, []);

  const fetchEmployeeData = async (id) => {
    try {
      setUpdating(true);
      const url = id ? `http://172.16.206.4:1000/api/employee?id=${id}` : 'http://172.16.206.4:1000/api/employee';
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setDataEmployee(data);
      } else {
        throw new Error('Failed to fetch employee data.');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setUpdating(false);
    }
  };

  const debouncedFetchEmployeeData = useCallback(debounce((nik) => {
    fetchEmployeeData(nik, setDataEmployee, setUpdating);
  }, 500), []);

  useEffect(() => {
    let intervalId;

    const fetchDataAndInterval = async () => {
      fetchEmployeeData(selectedNIK);

      intervalId = setInterval(() => {
        fetchEmployeeData(selectedNIK);
      }, 30000);
    };

    if (autoUpdate) {
      fetchDataAndInterval();
    } else {
      fetchEmployeeData(selectedNIK);
    }

    // Cleanup the interval on unmount or when dependencies change
    return () => clearInterval(intervalId);
  }, [autoUpdate, selectedNIK]);


  console.log('Training Pro:', dataEmployee)
  console.log('Training 1:', selectedNIK)
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

  useEffect(() => {
    if (selectedFactory && selectedLine) {
      const filteredData = data.filter(row => row.FACTORY === selectedFactory && row.LINE === selectedLine);
      const uniqueTrainingPlans = [...new Set(filteredData.map(row => row['TRAINING PLAN']))];
      setTrainingPlanOptions(uniqueTrainingPlans);
      setSelectedMP(uniqueTrainingPlans[0] || ""); // Set default value to the first option
    }
  }, [selectedFactory, selectedLine, data]);

  useEffect(() => {
    if (dataTrainingProcess.length > 0) {
      const columnNames = Object.keys(dataTrainingProcess[0]);
      setMainProcessOptions(columnNames);
    }
  }, [dataTrainingProcess]);

  const handleFactoryChange = (event) => {
    setSelectedFactory(event.target.value);
    setSelectedLine(""); // Reset line selection when factory changes
  };

  const handleLineChange = (event) => {
    setSelectedLine(event.target.value);
  };

  const handleDateChange = (index, value) => {
    const newRows = [...rows];
    newRows[index].date = value;
    setRows(newRows);
  };

  const handleNIKChange = (index, value) => {
    setselectedNIK(value);
    debouncedFetchEmployeeData(value);
    const newRows = [...rows];
    newRows[index].NIK = value;
    setRows(newRows);
  };

  const handleNameChange = (index, value) => {
    const newRows = [...rows];
    newRows[index].NAME = value;
    setRows(newRows);
  };

  const handleMainProcessChange = (index, value) => {
    const newRows = [...rows];
    newRows[index]["MAIN PROCESS"] = value;

    // Dapatkan opsi PROCESS berdasarkan MAIN PROCESS yang dipilih
    const selectedProcessOptions = dataTrainingProcess
      .filter(row => Object.keys(row).includes(value))
      .map(row => row[value]);

    setProcessOptions(selectedProcessOptions);
    newRows[index].PROCESS = ""; // Reset nilai PROCESS
    setRows(newRows);
  };

  const handleProcessChange = (index, value) => {
    const newRows = [...rows];
    newRows[index].PROCESS = value;
    setRows(newRows);
  };

  const handleValidationStatusChange = (index, value) => {
    const newRows = [...rows];
    newRows[index]["VALIDATION STATUS"] = value;

    if (value === 'NOT YET') {
      newRows[index].SCORE = 0;
    } else {
      newRows[index].SCORE = ''; // Reset score if status is not 'NOT YET'
    }

    setRows(newRows);
  };

  const handleScoreChange = (index, value) => {
    const newRows = [...rows];
    newRows[index].SCORE = value;
    setRows(newRows);
  };

  const addRow = () => {
    setRows([...rows, { date: "", NIK: "", NAME: "", "MAIN PROCESS": "", PROCESS: "", "VALIDATION STATUS": "", SCORE: "" }]);
  };

  const handleSave = async () => {
    try {
      const newData = rows.map((row, index) => ({
        ID: index + 1,
        FACTORY: selectedFactory,
        LINE: selectedLine,
        DATE: row.date,
        NIK: row.NIK,
        NAME: dataEmployee[0].NAME,
        "MAIN PROCESS": row["MAIN PROCESS"],
        PROCESS: row.PROCESS,
        "VALIDATION STATUS": row["VALIDATION STATUS"],
        SCORE: row.SCORE
      }));
      const response = await fetch('http://172.16.206.4:1000/saveDataValidation', {
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
  const nameValue = dataEmployee.length > 0 ? dataEmployee[0].NAME : '';

  return (
    <>
      <main className="py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-1">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="sm:flex sm:items-center py-3">
              <div className="sm:flex-auto">
                <h1 className="text-base font-semibold leading-6 text-gray-900">
                  Validation
                </h1>
                <p className="mt-2 text-sm text-gray-700">
                  Validation Input Form
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
                        {/* Render line options based on selected factory */}
                        {renderLineOptions()}
                      </select>
                    </div>
                    <button
                      onClick={handleSave}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-gray-900 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
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
                            {/* Update table headers to match API data structure */}
                            <th
                              scope="col"
                              className="px-2 py-2 text-center text-sm font-semibold"
                            >
                              VALIDATION DATE
                            </th>
                            <th
                              scope="col"
                              className="px-2 py-2 text-center text-sm font-semibold"
                            >
                              NIK
                            </th>
                            <th
                              scope="col"
                              className="px-2 py-2 text-center text-sm font-semibold"
                            >
                              NAME
                            </th>
                            <th
                              scope="col"
                              className="px-2 py-2 text-center text-sm font-semibold"
                            >
                              MAIN PROCESS
                            </th>
                            <th
                              scope="col"
                              className="px-2 py-2 text-center text-sm font-semibold"
                            >
                              PROCESS
                            </th>
                            <th
                              scope="col"
                              className="px-2 py-2 text-center text-sm font-semibold"
                            >
                              VALIDATION STATUS
                            </th>
                            <th
                              scope="col"
                              className="px-2 py-2 text-center text-sm font-semibold"
                            >
                              SCORE
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y bg-white">
                          {/* Map over rows state to render input fields for each row */}
                          {rows.map((row, index) => (
                            <tr key={index}>
                              {/* Update input fields to match API data structure */}
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
                                  value={selectedNIK}
                                  onChange={(e) => handleNIKChange(index, e.target.value.toString())} // Mengubah nilai menjadi string
                                  className="mt-1 block w-full pl-3 pr-10 py-1 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                />
                              </td>
                              <td className="px-2 py-2 text-center">
                                <input
                                  type="text"
                                  value={nameValue || 'Data Not Found'}
                                  onChange={(e) => handleNameChange(index, e.target.value)}
                                  className="mt-1 block w-full pl-3 pr-10 py-1 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                  readOnly={true}
                                />
                              </td>
                              <td className="px-2 py-2 text-center">
                                <select
                                  value={row["MAIN PROCESS"]}
                                  onChange={(e) => handleMainProcessChange(index, e.target.value)}
                                  className="mt-1 block w-full pl-3 pr-10 py-1 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                >
                                  <option value="" disabled>Select a main process</option>
                                  {mainProcessOptions.map((option, idx) => (
                                    <option key={idx} value={option}>
                                      {option}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td className="px-2 py-2 text-center">
                                <select
                                  value={row.PROCESS}
                                  onChange={(e) => handleProcessChange(index, e.target.value)}
                                  className="mt-1 block w-full pl-3 pr-10 py-1 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                  disabled={!row["MAIN PROCESS"]} // Disable jika MAIN PROCESS belum dipilih
                                >
                                  <option value="" disabled>Select a process</option>
                                  {processOptions.map((option, idx) => (
                                    <option key={idx} value={option}>
                                      {option}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td className="px-2 py-2 text-center">
                                <select
                                  value={row["VALIDATION STATUS"]}
                                  onChange={(e) => handleValidationStatusChange(index, e.target.value)}
                                  className="mt-1 block w-full pl-3 pr-10 py-1 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                >
                                  <option value="" disabled>Select validation status</option>
                                  <option value="DONE">DONE</option>
                                  <option value="NOT YET">NOT YET</option>
                                </select>
                              </td>
                              <td className="px-2 py-2 text-center">
                                <input
                                  type="number"
                                  value={row.SCORE}
                                  onChange={(e) => handleScoreChange(index, e.target.value)}
                                  className="mt-1 block w-full pl-3 pr-10 py-1 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                  readOnly={row["VALIDATION STATUS"] !== 'DONE'} // Set read-only jika validation status bukan 'DONE'
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <button
                        onClick={addRow}
                        className="mt-2 ml-2 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-gray-900 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
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

export default ValidationInput;



