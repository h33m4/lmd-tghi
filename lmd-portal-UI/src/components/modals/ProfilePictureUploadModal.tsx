/* eslint-disable @next/next/no-img-element */
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
// import UploadIcon from "../../../public/assets/icons/image_upload.svg";
import BaseModal, { BaseModalRef } from "./BaseModal";
import ReactCrop, { Crop, PixelCrop } from "react-image-crop";
import { canvasPreview, centerAspectCrop } from "@/utils/helper_functions";
import "react-image-crop/dist/ReactCrop.css";
import PrimaryButton from "../buttons/PrimaryButton";
import { PhotoIcon } from "@heroicons/react/24/outline";
import { Button } from "../ui/button";

type Props = {
  onCloseModal: (data: File | null) => void;
  buttonComponent: React.JSX.Element;
};

function PictureUploadModal({ onCloseModal, buttonComponent }: Props) {
  const [componentState, setComponentState] = useState<
    "idle" | "loading" | "error"
  >("idle");
  const [finalImageBlob, setFinalImageBlob] = useState<Blob>();
  const [uploadedImageSrc, setUploadedImageSrc] = useState("");
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const imageProperties = {
    aspect: 10 / 10,
    scale: 1,
    rotate: 0,
  };

  const baseModalRef = useRef<BaseModalRef>(null);

  // Reset state
  function resetState() {
    setUploadedImageSrc("");
  }

  useEffect(() => {
    if (!imgRef.current) return;
    if (!previewCanvasRef.current) return;
    canvasPreview(
      imgRef.current,
      previewCanvasRef.current,
      completedCrop!,
      imageProperties.scale,
      imageProperties.rotate
    );
  }, [completedCrop, imageProperties.rotate, imageProperties.scale]);

  //Submit handler
  async function submitHandler() {
    setComponentState("loading");
    previewCanvasRef.current?.toBlob(async (blob) => {
      if (!blob) return;
      setFinalImageBlob(blob);
      setComponentState("loading");
      onCloseModal(new File([blob], "image.png", { type: "image/png" }));
      baseModalRef.current?.closeModal();
      setComponentState("idle");
    });
  }

  //Modal Component
  function ModalComponent() {
    const onDrop = useCallback((acceptedFiles: File[]) => {
      setCrop(undefined); // Makes crop preview update between images.
      const reader = new FileReader();
      reader.addEventListener("load", () =>
        setUploadedImageSrc(reader.result?.toString() || "")
      );
      reader.readAsDataURL(acceptedFiles[0]);
    }, []);

    function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
      if (imageProperties.aspect) {
        const { width, height } = e.currentTarget;
        setCrop(centerAspectCrop(width, height, imageProperties.aspect));
      }
    }

    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
      onDrop,
      accept: {
        "image/*": [],
      },
      maxFiles: 1,
      noClick: true,
      maxSize: 5242880, //5mb
    });

    return (
      <div
        style={{ height: "50.5vh" }}
        className={`rounded-[13px] bg-th-textbox-fill mx-[20px]  my-[20px] ${
          isDragActive
            ? "border-[1px] border-border "
            : "border-[0.5px] border-border"
        } overflow-y-auto h-full  transition-all duration-100`}
      >
        {/* Render when an image has not yet been uploaded */}
        {!uploadedImageSrc && (
          <div
            className=" flex flex-col justify-center items-center gap-3 h-full border-dashed border dark:bg-[#09090b] bg-[#f7f8fc]"
            {...getRootProps()}
          >
            <input {...getInputProps()} />

            <div className="h-[110px] w-[110px] rounded-full flex flex-row justify-center items-center bg-green/20">
              <PhotoIcon className="h-14 w-14 text-green" />
            </div>

            <div>
              {isDragActive ? (
                <h1>Drop it here...</h1>
              ) : (
                <div className="flex flex-col justify-center items-center gap-2">
                  <h1>Drag &apos;n&apos; drop your image here</h1>
                  <p>or</p>
                  <Button
                    onClick={open}
                    disabled={false}
                    variant={"dark-blue"}
                    title={"Browse from files"}
                  >
                    Browse from files
                  </Button>
                </div>
              )}
            </div>

            <p className="text-xs text-th-text-lmh-dark-blue">
              Image uploaded should not be above 5mb in size
            </p>
          </div>
        )}

        {/* Render this when an image has been uploaded */}
        {uploadedImageSrc && (
          <div className="flex flex-col justify-center items-center">
            <ReactCrop
              crop={crop}
              onChange={(_, percentCrop) => setCrop(percentCrop)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={imageProperties.aspect}
            >
              <img
                ref={imgRef}
                alt="Crop me"
                src={uploadedImageSrc}
                style={{
                  transform: `scale(${imageProperties.scale}) rotate(${imageProperties.rotate}deg)`,
                  width: "100%",
                  height: "50vh",
                  objectFit: "contain",
                  objectPosition: "center",
                }}
                onLoad={onImageLoad}
              />
            </ReactCrop>
          </div>
        )}

        {/* preview */}
        {completedCrop && (
          <canvas
            className="hidden"
            ref={previewCanvasRef}
            style={{
              border: "1px solid black",
              objectFit: "contain",
              width: completedCrop.width,
              height: completedCrop.height,
            }}
          />
        )}
      </div>
    );
  }

  return (
    <>
      <BaseModal
        ref={baseModalRef}
        isCtaDisabled={false}
        size="small"
        onCloseModal={(val) => {
          resetState();
          //setModalState(val);
        }}
        onOpenModal={(val) => {
          //setModalState(val);
        }}
        isLoading={componentState === "loading"}
        buttonComponent={buttonComponent}
        title="Upload Image"
        ctaTitle={uploadedImageSrc ? "Crop Image" : ""}
        ctaOnClicked={() => {
          submitHandler();
        }}
        components={ModalComponent()}
      />
    </>
  );
}

export default PictureUploadModal;
