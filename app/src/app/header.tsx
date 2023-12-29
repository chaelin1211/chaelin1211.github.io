"use client";
import React, { useState } from "react";
import { Dialog, Popover } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { CommonMultiSelect } from "@/src/app/notion/notion-result";
import Image from "next/image";
import { usePathname } from "next/navigation";

const Header: React.FC<{ category: CommonMultiSelect[] }> = (props: {
  category: CommonMultiSelect[];
}) => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header>
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5 flex">
            <span className="sr-only">Chaelin&aposs Blog</span>
            <Image width={40} height={40} src={"/logo.png"} alt={"logo"} />
            <p className={"text-sm self-center font-semibold"}>Chaelin</p>
          </Link>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <Popover.Group className="hidden lg:flex">
          {props.category.map((post) => (
            <Link
              key={post.id}
              href={`/${post.name}`}
              className={`header ${
                pathname === "/" + post.name ? "active" : ""
              } first:rounded-l-full first:pl-6 last:pr-6 px-3 last:rounded-r-full py-2 text-sm`}
            >
              {post.name}
            </Link>
          ))}
        </Popover.Group>
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          {/*<a href="#" className="text-sm font-semibold leading-6 text-gray-900">*/}
          {/*  Log in <span aria-hidden="true">&rarr;</span>*/}
          {/*</a>*/}
        </div>
      </nav>
      <Dialog
        as="div"
        className="lg:hidden"
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
      >
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-bg_light dark:bg-bg_dark px-4 py-4 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5 flex">
              <span className="sr-only">Chaelin&aposs Blog</span>
              <Image width={40} height={40} src={"/logo.png"} alt={"logo"} />
              <p className={"text-sm self-center font-semibold"}>Chaelin</p>
            </Link>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 "
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                {props.category.map((post) => (
                  <Link
                    key={post.id}
                    onClick={() => setMobileMenuOpen(false)}
                    href={`/${post.name}`}
                    className="-mx-3 block rounded-lg px-3 py-2 text-xs font-md leading-7"
                  >
                    {post.name}
                  </Link>
                ))}
              </div>
              {/*<div className="py-6">*/}
              {/*  <a*/}
              {/*    href="#"*/}
              {/*    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"*/}
              {/*  >*/}
              {/*    Log in*/}
              {/*  </a>*/}
              {/*</div>*/}
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  );
};

export default Header;
