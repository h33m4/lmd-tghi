import React from "react";

import LiberiaFlag from "../../../../../public/assets/icons/country/Liberia.svg";
import EthiopiaFlag from "../../../../../public/assets/icons/country/Ethiopia.svg";
import Malawiflag from "../../../../../public/assets/icons/country/Malawi.svg";
import SierraLeonFlag from "../../../../../public/assets/icons/country/SierraLeone.svg";

const LiberiaIcon = () => {
  return (
    <div>
      <LiberiaFlag
        width="30"
        height="20"
        viewBox="0 0 300 173"
        className=" border-white mr-1"
      />
    </div>
  );
};

const MalawiIcon = () => {
  return (
    <div>
      <Malawiflag
        width="30"
        height="20"
        viewBox="0 0 300 173"
        className=" border-white mr-1"
      />
    </div>
  );
};

const EthiopiaIcon = () => {
  return (
    <div>
      <EthiopiaFlag
        width="30"
        height="20"
        viewBox="0 0 300 173"
        className=" border-white mr-1"
      />
    </div>
  );
};

const SierraLeoneIcon = () => {
  return (
    <div>
      <SierraLeonFlag
        width="30"
        height="20"
        viewBox="0 0 300 173"
        className=" border-white mr-1"
      />
    </div>
  );
};

export { LiberiaIcon, MalawiIcon, EthiopiaIcon, SierraLeoneIcon };
