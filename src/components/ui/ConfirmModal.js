"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { motion } from "framer-motion";

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Êtes-vous sûr ?",
  description = "Cette action est irréversible.",
}) {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        {/* Background flouté */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 backdrop-blur-none"
          enterTo="opacity-100 backdrop-blur-sm"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 backdrop-blur-sm"
          leaveTo="opacity-0 backdrop-blur-none"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        </Transition.Child>

        {/* Contenu animé */}
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-90 translate-y-4"
            enterTo="opacity-100 scale-100 translate-y-0"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100 translate-y-0"
            leaveTo="opacity-0 scale-90 translate-y-4"
          >
            <Dialog.Panel
              as={motion.div}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-gray-900 max-w-md w-full rounded-2xl p-6 shadow-xl ring-1 ring-black/10 space-y-4"
            >
              <Dialog.Title className="text-lg font-bold text-gray-900 dark:text-white">
                {title}
              </Dialog.Title>
              <Dialog.Description className="text-sm text-gray-600 dark:text-gray-300">
                {description}
              </Dialog.Description>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition"
                >
                  Annuler
                </button>
                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className="px-4 py-2 rounded-lg text-sm bg-red-600 text-white hover:bg-red-700 transition"
                >
                  Confirmer
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
