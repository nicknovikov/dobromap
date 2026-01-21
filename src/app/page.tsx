'use client'

import KonvaMap from "@/components/konvamap";
import { MapRegion } from "@/types";
import { Button } from "@heroui/button";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/modal";
import { useState } from "react";

export default function Home() {

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const [ regionTitle, setRegionTitle ] = useState("");

    function onRegionClick(region: MapRegion) {
        setRegionTitle(region.title);
        onOpen();
    }

    return (
        <main className="h-screen bg-sky-950">
            <KonvaMap className="fixed left-0 top-0 right-0 bottom-0" onRegionClick={ onRegionClick } />
            <Modal
                backdrop="opaque"
                classNames={{
                    body: "py-6",
                    backdrop: "bg-[#292f46]/50 backdrop-opacity-40",
                    base: "border-[#292f46] bg-[#19172c] dark:bg-[#19172c] text-[#a8b0d3]",
                    header: "border-b-[1px] border-[#292f46]",
                    footer: "border-t-[1px] border-[#292f46]",
                    closeButton: "hover:bg-white/5 active:bg-white/10",
                    }}
                isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                <>
                    <ModalHeader className="flex flex-col gap-1">{ regionTitle }</ModalHeader>
                    <ModalBody>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pulvinar risus non
                        risus hendrerit venenatis. Pellentesque sit amet hendrerit risus, sed porttitor
                        quam.
                    </p>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam pulvinar risus non
                        risus hendrerit venenatis. Pellentesque sit amet hendrerit risus, sed porttitor
                        quam.
                    </p>
                    <p>
                        Magna exercitation reprehenderit magna aute tempor cupidatat consequat elit dolor
                        adipisicing. Mollit dolor eiusmod sunt ex incididunt cillum quis. Velit duis sit
                        officia eiusmod Lorem aliqua enim laboris do dolor eiusmod. Et mollit incididunt
                        nisi consectetur esse laborum eiusmod pariatur proident Lorem eiusmod et. Culpa
                        deserunt nostrud ad veniam.
                    </p>
                    </ModalBody>
                    <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                        Закрыть
                    </Button>
                    </ModalFooter>
                </>
                )}
            </ModalContent>
            </Modal>
        </main>
    );
}