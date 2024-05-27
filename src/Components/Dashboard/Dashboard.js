import React, { useState } from "react";
import axios from "axios";
import Logo from "../../Assets/img/logos.png";
import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Background from "../../Assets/img/Nike5.mov";


export default function Dashboard() {
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);

  const handleToggleDropdown = (index) => {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index);
  };

  

  const navigation = [
    {
      name: "Training Input",
      href: "/Machine1",
      current: true,
    },
    {
      name: "Validation - Matrix Input",
      href: "#",
      current: false,
    },
    {
      name: "Dashboard",
      href: "#",
      current: false,
    },
  ];

  return (
    <>
      <Disclosure as="nav" className="bg-gray-800">
        {({ open }) => (
          <>
            <div className="sticky top-0 z-50 bg-gray-800">
              <div className="mx-auto max-w-full px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                  <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                    <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                      <span className="absolute -inset-0.5" />
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                      )}
                    </Disclosure.Button>
                  </div>
                  <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                    <div className="flex flex-shrink-0 items-center">
                      <a href="/">
                        <img
                          className="h-10 w-36" // Menambahkan class untuk ukuran penuh
                          src={Logo}
                          alt="Your Company"
                        />
                      </a>
                    </div>
                    <div className="hidden sm:ml-6 sm:block">

                    </div>
                  </div>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                    <Menu as="div" className="relative ml-3">
                      <div>

                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                      </Transition>
                    </Menu>
                  </div>
                </div>
              </div>
            </div>


            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-1 px-2 pb-3 pt-2">
                {navigation.map((item, index) => (
                  <DropdownItem
                    key={item.name}
                    item={item}
                    isOpen={openDropdownIndex === index}
                    onToggle={() => handleToggleDropdown(index)}
                  />
                ))}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
      
    </>
  );
}

function DropdownItem({ item, isOpen, onToggle }) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className="text-white bg-gray-800 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-800 font-medium rounded-lg text-sm px-2.5 py-2.5 text-center inline-flex items-center dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
        type="button"
      >
        {item.name}
      </button>
      {isOpen && (
        <div className="z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 absolute mt-1">
          <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
            {item.subItems.map((subItem, index) => (
              <li key={index}>
                <a
                  href={subItem.href}
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                >
                  {subItem.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
