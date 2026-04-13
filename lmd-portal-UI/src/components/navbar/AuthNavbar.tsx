import React from "react";
import { IPageName } from "@/types";

import MobileRightSideDrawer from "../drawers/MobileRightSideDrawer";
import { ThemeButton } from "../buttons/ThemeButton";
import TabletNavSelector from "./TabletNavSelector";
import SearchModal from "../modals/SearchModal";
import NavButton from "./nav-button";
import UserProfileDropdown from "./user-profile-dropdown";
import HelpDropDown from "./help-dropdown";
import LmdLogo from "./LmdLogo";
import { useTourRef } from "@/context/tourContext";
import LmdAiAgentButton from "./lmdAiAgentButton";

type Props = {
  pageName?: IPageName;
};

const AuthNavbar = () => {
  return (
    <div className="flex-none border-b-[4px] border-primary w-full h-fit sticky top-0  z-50 bg-[#141d2c] backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="web-page-constraints-inner pl-4 pr-2.5 py-0.5  h-[51px] md:h-[45px] flex flex-row justify-between items-center border-b border-gray-dark ">
        <LmdLogo />

        <div className="items-center gap-2 hidden md:flex">
          <SearchModal />
        </div>

        {/* hamburger with right side bar for smaller screen */}
        <MobileRightSideDrawer />
      </div>

      <div className="hidden md:flex web-page-constraints-inner pl-4 pr-2.5 h-[31px] 2xl:h-[39px] 2xl:pt-[6px] justify-between items-center">
        <div className="h-full -mb-[8px] flex lg:hidden">
          <TabletNavSelector />
        </div>
        <div className="h-full  gap-2 -mb-[8px]  hidden lg:flex">
          <NavButton title="Home" href="/home" />
          <NavButton
            title="KPI Dashboard"
            href="/kpi-dashboard"
            tourRef="tour_kpi_dashboard"
          />
          <NavButton
            title="Country Programs"
            href="/country-programs"
            tourRef="tour_country_programs"
          />
          <NavButton
            title="AFF Dashboard"
            href="/aff-dashboard"
            tourRef="tour_aff_dashboard"
          />
          <NavButton
            title="Ext. KPI Dashboard"
            href="/external-kpi-dashboard"
            tourRef="tour_ext_kpi_dashboard"
          />

          <NavButton
            title="Learning Agenda"
            href="/learning-agenda"
            tourRef="tour_learning_agenda"
          />
        </div>
        <div className="h-full flex flex-row items-center gap-3.5  ">
          <LmdAiAgentButton />
          <div className="mt-[0.2rem] 2xl:mt-0">
            <HelpDropDown tourRef="tour_help_function" />
          </div>
          {/* <div className="mt-0.5">
            <Button
              variant={"ghost"}
              className="rounded-full h-7 w-7"
              size={"icon"}
            >
              <BellIcon className="h-[1.2rem] w-[1.2rem]  2xl:h-5 2xl:w-5" />
            </Button>
          </div> */}

          <div className="mt-[0.2rem] 2xl:mt-0">
            <ThemeButton tourRef="tour_theme_toggler" />
          </div>
          <UserProfileDropdown tourRef="tour_profile_settings" />
        </div>
      </div>
    </div>
  );
};

export default AuthNavbar;
