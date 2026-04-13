import React from "react";

const FormError = ({ formError }: { formError: string }) => {
  return (
    <>
      {formError ? (
        <p className="text-red-500 text-sm th-font-light -mt-3">{formError}</p>
      ) : (
        ""
      )}
    </>
  );
};

export default FormError;
