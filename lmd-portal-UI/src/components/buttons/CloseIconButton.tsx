import React from "react";
import { X } from "lucide-react";
import { Button } from "../ui/button";

type Props = {
  onClicked: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
};
const CloseIconButton = ({ onClicked }: Props) => {
  return (
    <Button
      onClick={onClicked}
      type="button"
      className="rounded-full"
      variant={"ghost"}
      size={"icon"}
    >
      <X className="h-4 w-4" />
    </Button>
  );
};

export default CloseIconButton;
