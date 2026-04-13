import React from "react";
import Footer from "@/components/footer/Footer";
import SettingsSideBar from "./SideBar";

const SettingsLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="w-full container mx-auto max-w-screen-2xl px-4 md:px-8 xl:px-4 2xl:px-4">
        <main className="w-full flex flex-row overflow-hidden   pt-2 gap-2 ">
          <SettingsSideBar />

          <div className="w-full h-[calc(100vh-100px)] ml-3 overflow-y-auto overflow-x-hidden pl-2 pt-0 pb-1 rounded-lg flex flex-col">
            <div className="flex flex-col gap-10 flex-1 min-h-0">{children}</div>
          </div>
        </main>
      </div>

      {/* <Footer /> */}
    </>
  );
};

export default SettingsLayout;
