import React, { useEffect, useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import ApexCharts from 'apexcharts';
import ReactApexChart from 'react-apexcharts';
import { TEChart } from "tw-elements-react";

const Visualization = () => {
    const [data, setData] = useState([]);
    const [data2, setData2] = useState([]);
    const [chartData, setChartData] = useState({ series: [], labels: [] });
    const [chartData2, setChartData2] = useState({ series: [], labels: [] });
    const [totalTrainingPlanFactory1, setTotalTrainingPlanFactory1] = useState(0);
    const [totalTrainingActualFactory1, setTotalTrainingActualFactory1] = useState(0);
    const [totalTrainingPlanFactory2, setTotalTrainingPlanFactory2] = useState(0);
    const [totalTrainingActualFactory2, setTotalTrainingActualFactory2] = useState(0);
    const [averageTrainingPercentage, setAverageTrainingPercentage] = useState(0);
    const [averageUnTrainingPercentage, setAverageUnTrainingPercentage] = useState(0);
    const [totalExcellentFactory1, setTotalExcellentFactory1] = useState(0);
    const [totalExcellentFactory2, setTotalExcellentFactory2] = useState(0);
    const [totalDeficientFactory1, setTotalDeficientFactory1] = useState(0);
    const [totalDeficientFactory2, setTotalDeficientFactory2] = useState(0);
    const [totalExcellentLINE, setTotalExcellentLINE] = useState({});
    const [totalDeficientLINE, setTotalDeficientLINE] = useState({});
    const [totalValLINE, setTotalValLINE] = useState({});
    const [totalTrainLINE, setTotalTrainLINE] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://172.16.206.4:1000/api/training');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const jsonData = await response.json();

                // Filter the required columns and ensure DATE is formatted correctly
                const filteredData = jsonData.map(row => ({
                    ID: row.ID,
                    FACTORY: row.FACTORY,
                    LINE: row.LINE,
                    DATE: formatDate(row.DATE),
                    'TRAINING PLAN': row['TRAINING PLAN'],
                    'TRAINING ACTUAL': Number(row['TRAINING ACTUAL']) || 0  // Ensure 'TRAINING ACTUAL' is a number
                }));

                setData(filteredData);

                for (let i = 1; i <= 91; i++) {
                    if (i >= 63 && i <= 89) continue; // Skip numbers between 63 and 89
                    totalTrainLINE[i] = 0;
                }

                filteredData.forEach(row => {
                    const { LINE } = row;
                    if (LINE && totalTrainLINE.hasOwnProperty(LINE)) {
                        totalTrainLINE[LINE] += row['TRAINING ACTUAL'];
                    }
                });

                setTotalTrainLINE(totalTrainLINE);
            } catch (error) {
                console.error('Error fetching training data:', error);
            }
        };

        const fetchData2 = async () => {
            try {
                const response = await fetch('http://172.16.206.4:1000/api/validation');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const jsonData = await response.json();

                // Filter the required columns and ensure DATE is formatted correctly
                const filteredData = jsonData.map(row => ({
                    ID: row.ID,
                    FACTORY: row.FACTORY,
                    LINE: row.LINE,
                    DATE: formatDate(row.DATE),
                    NIK: row.NIK,
                    NAME: row.NAME,
                    'MAIN PROCESS': row['MAIN PROCESS'],
                    PROCESS: row.PROCESS,
                    'VALIDATION STATUS': row['VALIDATION STATUS'],
                    SCORE: row.SCORE
                }));

                setData2(filteredData);
            } catch (error) {
                console.error('Error fetching validation data:', error);
            }
        };

        fetchData();
        fetchData2();
    }, []);

    console.log('Data 1:', data)
    console.log('Data 2:', data2)

    useEffect(() => {
        if (data.length === 0) return;

        const totalTrainingPlanFactory1 = data
            .filter(row => parseInt(row.FACTORY) === 1)
            .reduce((total, row) => total + parseInt(row['TRAINING PLAN']), 0);
        setTotalTrainingPlanFactory1(totalTrainingPlanFactory1)

        const totalTrainingActualFactory1 = data
            .filter(row => parseInt(row.FACTORY) === 1)
            .reduce((total, row) => total + parseInt(row['TRAINING ACTUAL']), 0);
        setTotalTrainingActualFactory1(totalTrainingActualFactory1)

        const totalTrainingPlanFactory2 = data
            .filter(row => parseInt(row.FACTORY) === 2)
            .reduce((total, row) => total + parseInt(row['TRAINING PLAN']), 0);
        setTotalTrainingPlanFactory2(totalTrainingPlanFactory2)

        const totalTrainingActualFactory2 = data
            .filter(row => parseInt(row.FACTORY) === 2)
            .reduce((total, row) => total + parseInt(row['TRAINING ACTUAL']), 0);
        setTotalTrainingActualFactory2(totalTrainingActualFactory2)

        const averageTrainingPercentage = (
            ((totalTrainingActualFactory1 / totalTrainingPlanFactory1 * 100) +
                (totalTrainingActualFactory2 / totalTrainingPlanFactory2 * 100)) / 2
        ).toFixed(1);

        setAverageTrainingPercentage(averageTrainingPercentage)

        const averageUnTrainingPercentage = (
            (
                ((totalTrainingPlanFactory1 - totalTrainingActualFactory1) / totalTrainingPlanFactory1 * 100) +
                ((totalTrainingPlanFactory2 - totalTrainingActualFactory2) / totalTrainingPlanFactory2 * 100)
            ) / 2
        ).toFixed(1);
        setAverageUnTrainingPercentage(averageUnTrainingPercentage)

        const totalExcellentFactory1 = data2
            .filter(row => parseInt(row.FACTORY) === 1 && parseInt(row.SCORE) > 75)
            .length;
        setTotalExcellentFactory1(totalExcellentFactory1);

        const totalExcellentFactory2 = data2
            .filter(row => parseInt(row.FACTORY) === 2 && parseInt(row.SCORE) > 75)
            .length;
        setTotalExcellentFactory2(totalExcellentFactory2);

        const totalDeficientFactory1 = data2
            .filter(row => parseInt(row.FACTORY) === 1 && parseInt(row.SCORE) <= 75)
            .length;
        setTotalDeficientFactory1(totalDeficientFactory1);

        const totalDeficientFactory2 = data2
            .filter(row => parseInt(row.FACTORY) === 2 && parseInt(row.SCORE) <= 75)
            .length;
        setTotalDeficientFactory2(totalDeficientFactory2);

        setChartData({
            series: [parseFloat(averageTrainingPercentage), parseFloat(averageUnTrainingPercentage)],
            labels: ['Trained', 'Untrained']
        });

        for (let i = 1; i <= 91; i++) {
            if (i >= 63 && i <= 89) continue; // Skip numbers between 63 and 89
            const countExcellent = data2.filter(row => parseInt(row.LINE) === i && parseInt(row.SCORE) > 75).length;
            totalExcellentLINE[i] = countExcellent || 0;

            const countDeficient = data2.filter(row => parseInt(row.LINE) === i && parseInt(row.SCORE) <= 75).length;
            totalDeficientLINE[i] = countDeficient || 0;
        }

        setTotalExcellentLINE(totalExcellentLINE);
        setTotalDeficientLINE(totalDeficientLINE);

        for (let i = 1; i <= 91; i++) {
            if (i >= 63 && i <= 89) continue; // Skip numbers between 63 and 89
            const count = data2.filter(row => parseInt(row.LINE) === i && row['VALIDATION STATUS'] === 'DONE').length;
            totalValLINE[i] = count || 0;
        }

        setTotalValLINE(totalValLINE);

        console.log(chartData2)
    }, [data]);
    const buildTooltip = (props, options) => {
        // Implementasi fungsi buildTooltip
    };
    useEffect(() => {
        if (chartData.series.length === 0) return;

        const buildChart = (selector, options) => {
            const chart = new ApexCharts(document.querySelector(selector), options());
            chart.render();
            return chart;
        };

        const chartOptions1 = () => ({
            chart: {
                height: 400,
                type: 'pie',
                zoom: {
                    enabled: false,
                },
            },
            series: chartData.series,
            labels: chartData.labels,
            title: {
                text: 'TRAINING TOTAL JX2',
                align: 'center',
                margin: 50,
                style: {
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#333',
                },
            },
            dataLabels: {
                style: {
                    fontSize: '20px',
                    fontFamily: 'Inter, ui-sans-serif',
                    fontWeight: '400',
                    colors: ['#fff', '#fff', '#1f2937'],
                },
                dropShadow: {
                    enabled: false,
                },
                formatter: (value) => `${value.toFixed(1)} %`,
            },
            plotOptions: {
                pie: {
                    dataLabels: {
                        offset: -15,
                    },
                },
            },
            legend: {
                show: true,
                position: 'bottom',
                labels: {
                    colors: ['#000'],
                    useSeriesColors: false,
                },
            },
            stroke: {
                width: 4,
            },
            grid: {
                padding: {
                    top: -10,
                    bottom: -14,
                    left: -9,
                    right: -9,
                },
            },
            tooltip: {
                enabled: false,
            },
            states: {
                hover: {
                    filter: {
                        type: 'none',
                    },
                },
            },
            colors: ['#c2410c', '#f97316'],
            stroke: {
                colors: ['rgb(255, 255, 255)'],
            },
        });

        const chart1 = buildChart('#hs-pie-chart-1', chartOptions1);

        // Cleanup function to destroy the chart instances
        return () => {
            if (chart1) {
                chart1.destroy();
            }
        };
    }, [chartData]);

    const options = {
        colors: ["#1A56DB", "#FDBA8C"],
        series: [
            {
                name: "Excellent (>75)",
                color: "#c2410c",
                data: [
                    { x: "JX2", y: totalExcellentFactory1 + totalExcellentFactory2 },
                ],
            },
            {
                name: "Deficient (<=75)",
                color: "#f97316",
                data: [
                    { x: "JX2", y: totalDeficientFactory1 + totalDeficientFactory2 },
                ],
            },
        ],
        chart: {
            type: "bar",
            height: 320, // Ensure this is a number
            fontFamily: "Inter, sans-serif",
            toolbar: {
                show: false,
            },
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: "70%",
                borderRadiusApplication: "end",
                borderRadius: 8,
            },
        },
        tooltip: {
            shared: true,
            intersect: false,
            style: {
                fontFamily: "Inter, sans-serif",
            },
        },
        states: {
            hover: {
                filter: {
                    type: "darken",
                    value: 1,
                },
            },
        },
        stroke: {
            show: true,
            width: 0,
            colors: ["transparent"],
        },
        grid: {
            show: false,
            strokeDashArray: 4,
            padding: {
                left: 2,
                right: 2,
                top: -14,
            },
        },
        dataLabels: {
            enabled: false,
        },
        legend: {
            show: false,
        },
        xaxis: {
            floating: false,
            labels: {
                show: true,
                style: {
                    fontFamily: "Inter, sans-serif",
                    cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
                },
            },
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
        },
        yaxis: {
            show: true, // Show y-axis on the left
        },
        fill: {
            opacity: 1,
        },
    };
    

    const series = options.series && options.series.length > 0 ? options.series : [];

    const options2 = {
        xaxis: {
            show: true,
            categories: Array.from({ length: 91 }, (_, index) => index + 1)
                .filter(number => !(number >= 63 && number <= 89)),
            labels: {
                show: true,
                style: {
                    fontFamily: "Inter, sans-serif",
                    cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400',
                },
            },
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
        },
        yaxis: {
            show: true,
            labels: {
                show: true,
                style: {
                    fontFamily: "Inter, sans-serif",
                    cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400',
                },
                formatter: function (value) {
                    return '' + value;
                },
            },
        },
        chart: {
            sparkline: {
                enabled: false,
            },
            height: "100%",
            width: "100%",
            type: "area",
            fontFamily: "Inter, sans-serif",
            dropShadow: {
                enabled: false,
            },
            toolbar: {
                show: false,
            },
        },
        tooltip: {
            enabled: true,
            x: {
                show: false,
            },
        },
        fill: {
            type: "gradient",
            gradient: {
                opacityFrom: 0.55,
                opacityTo: 0,
                shade: "#1C64F2",
                gradientToColors: ["#1C64F2"],
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            width: 6,
        },
        legend: {
            show: false,
        },
        grid: {
            show: false,
        },
    };
    const series2 = [
        {
            name: "Excellent (>75)",
            data: Object.values(totalExcellentLINE),
            color: "#1A56DB",
        },
        {
            name: "Deficient (<=75)",
            data: Object.values(totalDeficientLINE),
            color: "#7E3BF2",
        },
    ];

    const xValues = Array.from({ length: 91 }, (_, index) => index + 1)
        .filter(number => !(number >= 63 && number <= 89));
    const yValues = Object.values(totalValLINE);
    const yValues2 = Object.values(totalTrainLINE);
    const optionsValTra = {
        colors: ["#1A56DB", "#FDBA8C"],
        series: [
            {
                name: "Validation",
                color: "#f87171",
                data: xValues.map((x, index) => ({ x: x.toString(), y: yValues[index] })),
            },
            {
                name: "Training",
                color: "#dc2626",
                data: xValues.map((x, index) => ({ x: x.toString(), y: yValues2[index] })),
            },
        ],
        chart: {
            type: "bar",
            height: 320, // Ensure this is a number
            fontFamily: "Inter, sans-serif",
            toolbar: {
                show: false,
            },
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: "70%",
                borderRadiusApplication: "end",
                borderRadius: 8,
            },
        },
        tooltip: {
            shared: true,
            intersect: false,
            style: {
                fontFamily: "Inter, sans-serif",
            },
        },
        states: {
            hover: {
                filter: {
                    type: "darken",
                    value: 1,
                },
            },
        },
        stroke: {
            show: true,
            width: 0,
            colors: ["transparent"],
        },
        grid: {
            show: false,
            strokeDashArray: 4,
            padding: {
                left: 2,
                right: 2,
                top: -14,
            },
        },
        dataLabels: {
            enabled: false,
        },
        legend: {
            show: false,
        },
        xaxis: {
            floating: false,
            labels: {
                show: true,
                style: {
                    fontFamily: "Inter, sans-serif",
                    cssClass: 'text-xs font-normal fill-gray-500 dark:fill-gray-400'
                },
            },
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
        },
        yaxis: {
            show: true, // Show y-axis
        },
        fill: {
            opacity: 1,
        },
    };
    

    const seriesValTra = optionsValTra.series && optionsValTra.series.length > 0 ? optionsValTra.series : [];

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}/${month}/${day}`;
    };

    console.log('Excellent:', totalTrainLINE)



    return (
        <>
            <main className="flex justify-center items-start min-h-screen bg-gray-200 py-12">
                <div className="max-w-full w-full px-4 sm:px-6 lg:px-8">
                    <h1 className="sr-only">Page title</h1>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className="col-span-1 bg-gray-100">
                            <section aria-labelledby="section-2-title" className="rounded-lg bg-white shadow">
                                <h2 className="sr-only" id="section-2-title">Section title</h2>
                                <div className="p -6">
                                    <div id="hs-pie-chart-1" className="w-full h-full"></div>
                                </div>
                            </section>
                        </div>
                        <div className="col-span-1 bg-gray-100">
                            <section aria-labelledby="section-1-title" className="rounded-lg bg-white shadow">
                                <h2 className="sr-only" id="section-1-title">Section title</h2>
                                <div className="text-center mb-6 py-6">
                                    <h2 className="text-lg font-bold">UPDATE ON THE SPOT</h2>
                                </div>
                                <div className="mx-auto max-w-full px-6 lg:px-1 ">
                                    <div className="px-4 sm:px-6 lg:px-8">
                                        <div className="mt-8 flow-root">
                                            <div className="relative -mx-4 -my-2 overflow-y-scroll overflow-x-scroll sm:-mx-6 lg:-mx-8">
                                                <div className="inline-block min-w-full align-middle sm:px-6 lg:px-8">
                                                    <div className="shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                                                        <div className="max-h-[70vh] max-w-full">
                                                            <table className="min-w-full divide-y divide-neutral-950 border border-slate-500">
                                                                <thead className="bg-slate-300">
                                                                    <tr className="sticky top-0 text-white z-10 bg-gray-900 whitespace-nowrap">
                                                                        <th scope="col" rowSpan={2} className="bg-gray-900 px-3 py-3.5 text-center text-sm font-semibold">FACTORY</th>
                                                                        <th scope="col" colSpan={6} className="bg-gray-900 px-3 py-3.5 text-center text-sm font-semibold">PROGRESS</th>
                                                                    </tr>
                                                                    <tr className="sticky top-12 text-white bg-gray-600 z-10 whitespace-nowrap">
                                                                        <th scope="col" className="sticky left-0 z-30 px-3 py-3.5 text-center text-sm font-semibold">QTY MP</th>
                                                                        <th scope="col" className="sticky left-0 z-30 px-3 py-3.5 text-center text-sm font-semibold">QTY ACTUAL</th>
                                                                        <th scope="col" className="sticky left-0 z-30 px-3 py-3.5 text-center text-sm font-semibold">TRAINED</th>
                                                                        <th scope="col" className="sticky left-0 z-30 px-3 py-3.5 text-center text-sm font-semibold">UNTRAINED</th>
                                                                    </tr>
                                                                    <tr className="sticky top-12 text-gray-900 bg-orange-600 z-10">
                                                                        <th scope="col" className="sticky left-0 z-30 px-3 py-3.5 text-center text-sm font-semibold">TOTAL</th>
                                                                        <th scope="col" className="sticky left-0 z-30 px-3 py-3.5 text-center text-sm font-semibold">{totalTrainingPlanFactory1 + totalTrainingPlanFactory2}</th>
                                                                        <th scope="col" className="sticky left-0 z-30 px-3 py-3.5 text-center text-sm font-semibold">{totalTrainingActualFactory1 + totalTrainingActualFactory2}</th>
                                                                        <th scope="col" className="sticky left-0 z-30 px-3 py-3.5 text-center text-sm font-semibold">{averageTrainingPercentage}%</th>
                                                                        <th scope="col" className="sticky left-0 z-30 px-3 py-3.5 text-center text-sm font-semibold">{averageUnTrainingPercentage}%</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody className="divide-y divide-neutral-950 bg-white">
                                                                    <tr>
                                                                        <td className="bg-gray-50 whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">F1</td>
                                                                        <td className="bg-gray-50 whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">{totalTrainingPlanFactory1}</td>
                                                                        <td className="bg-gray-50 whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">{totalTrainingActualFactory1}</td>
                                                                        <td className="bg-gray-50 whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">{(totalTrainingActualFactory1 / totalTrainingPlanFactory1 * 100).toFixed(1)}%</td>
                                                                        <td className="bg-gray-50 whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">{((totalTrainingPlanFactory1 - totalTrainingActualFactory1) / totalTrainingPlanFactory1 * 100).toFixed(1)}%</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="bg-gray-50 whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">F2</td>
                                                                        <td className="bg-gray-50 whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">{totalTrainingPlanFactory2}</td>
                                                                        <td className="bg-gray-50 whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">{totalTrainingActualFactory2}</td>
                                                                        <td className="bg-gray-50 whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">{(totalTrainingActualFactory2 / totalTrainingPlanFactory2 * 100).toFixed(1)}%</td>
                                                                        <td className="bg-gray-50 whitespace-nowrap py-4 pl-4 pr-3 text-xs text-center font-medium text-gray-900 sm:pl-6">{((totalTrainingPlanFactory2 - totalTrainingActualFactory2) / totalTrainingPlanFactory2 * 100).toFixed(1)}%</td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                        <div className="col-span-1 bg-gray-100">
                            <section aria-labelledby="section-2-title" className="rounded-lg bg-white shadow">
                                <div className="text-center py-6">
                                    <h2 className="text-lg font-bold">MATRIX TRAINING JX2</h2>
                                </div>
                                <ReactApexChart options={options} series={options.series} type="bar" height={320} />
                            </section>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 py-6">
                        <div className="col-span-1 bg-gray-100">
                            <section aria-labelledby="section-1-title" className="rounded-lg bg-white shadow">
                                <div className="text-center py-6">
                                    <h2 className="text-lg font-bold">TRAINING - VALIDATION JX2 [LINE]</h2>
                                </div>
                                <ReactApexChart options={optionsValTra} series={optionsValTra.series} type="bar" height={320} />
                            </section>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4 py-1.5">
                        <div className="col-span-1 bg-gray-100">
                            <section aria-labelledby="section-1-title" className="rounded-lg bg-white shadow">
                                <div className="text-center py-6">
                                    <h2 className="text-lg font-bold">MATRIX TRAINING JX2 [LINE]</h2>
                                </div>
                                <ReactApexChart options={options2} series={series2} type="area" height="100%" width="100%" />
                            </section>
                        </div>
                    </div>
                </div>

            </main>
        </>
    );
};

export default Visualization;

