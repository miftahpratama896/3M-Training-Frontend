import { useState, useEffect, Fragment } from "react";
import { useHistory } from "react-router-dom";
import Background from "../../Assets/img/Nike5.mov";
import {
  CloudArrowUpIcon,
  FingerPrintIcon,
  LockClosedIcon,
} from "@heroicons/react/20/solid";

export default function DashboardCenter() {
  // Function to handle export button click
  const handleExportExcel = () => {
    fetch('http://172.16.206.4:1000/api/exportExcel')
      .then(response => {
        // Check if response is successful
        if (response.ok) {
          // Trigger file download
          response.blob().then(blob => {
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'training_data.xlsx');
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
          });
        } else {
          console.error('Failed to export Excel data');
        }
      })
      .catch(error => console.error('Error:', error));
  };

  const posts = [
    {
      id: 1,
      title: 'Training Input',
      href: '/TrainingInput',
      description:
        'Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel. Iusto corrupti dicta.',
      imageUrl:
        'https://i.pinimg.com/564x/5b/84/c3/5b84c3c56bb73eff07e9aa00c3b50dee.jpg',
      date: '',
      datetime: '2020-03-16',
      author: {
        name: '',
        imageUrl:
          'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
    },
    {
      id: 1,
      title: 'Validation - Matrix Input',
      href: '/ValidationInput',
      description:
        'Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel. Iusto corrupti dicta.',
      imageUrl:
        'https://i.pinimg.com/564x/f9/4a/84/f94a8475da9d28c0ae32af99ee44c27a.jpg',
      date: '',
      datetime: '2020-03-16',
      author: {
        name: '',
        imageUrl:
          'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
    }, {
      id: 1,
      title: 'Monitoring Training and Validation - Matrix',
      href: '/Visualization',
      description:
        'Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel. Iusto corrupti dicta.',
      imageUrl:
        'https://i.pinimg.com/564x/81/b4/56/81b4569b556493c6ac378585113f06ce.jpg',
      date: '',
      datetime: '2020-03-16',
      author: {
        name: '',
        imageUrl:
          'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      },
    },
  ]
  
  return (
    <>
      <div className="bg-white">
        <main>
          {/* Feature section */}
          <div className="bg-white py-12 sm:py-12">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">ISQ 3M TRAINING FEATURES</h2>
                <p className="mt-2 text-lg leading-8 text-gray-600">
                  Learn how to grow your best quality product with our ISQ 3M-TRAINING.
                </p>
                <div className="flex justify-center mt-8">
                  <button className="bg-gray-800 text-white px-6 py-3 rounded-md hover:bg-gray-700" onClick={handleExportExcel}>
                    Export Data - Excel
                  </button>
                </div>
              </div>
              <div className="mx-auto mt-16 grid max-w-2xl auto-rows-fr grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                {posts.map((post) => (
                  <article
                    key={post.id}
                    className="relative isolate flex flex-col justify-end overflow-hidden rounded-2xl bg-gray-900 px-8 pb-8 pt-80 sm:pt-48 lg:pt-80"
                  >
                    <img src={post.imageUrl} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover" />
                    <div className="absolute inset-0 -z-10 bg-gradient-to-t from-gray-900 via-gray-900/40" />
                    <div className="absolute inset-0 -z-10 rounded-2xl ring-1 ring-inset ring-gray-900/10" />

                    <div className="flex flex-wrap items-center gap-y-1 overflow-hidden text-sm leading-6 text-gray-300">
                      <time dateTime={post.datetime} className="mr-8">
                        {post.date}
                      </time>

                    </div>
                    <h3 className="mt-3 text-lg font-semibold leading-6 text-white text-center">
                      <a href={post.href}>
                        <span className="absolute inset-0" />
                        {post.title}
                      </a>
                    </h3>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
