import React from "react";

import { Metadata } from "next";
import RequestAccessForm from "@/components/forms/RequestAccessForm";
import { metaObject } from "@/config/site.config";

export const metadata = {
  ...metaObject("Request Access"),
};

const RequestAccessPage = () => {
  return (
    <>
      <RequestAccessForm />
    </>
  );
};

export default RequestAccessPage;
