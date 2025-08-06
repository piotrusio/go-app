"use client";

import { useState } from 'react'
import { Button } from '@/components/catalyst/button'
import { Dialog, DialogActions, DialogDescription, DialogTitle } from '@/components/catalyst/dialog'
import { PencilSquareIcon } from '@heroicons/react/16/solid'

export default function CustomerCardEdit() {
  let [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button outline type="button" onClick={() => setIsOpen(true)}>
        <PencilSquareIcon className="size-5" />
        <span className="sm:inline ml-2">Edytuj</span>
      </Button>
      <Dialog open={isOpen} onClose={setIsOpen}>
        <DialogTitle>Edycja Klienta</DialogTitle>
        <DialogDescription>
          Funkcjonalność edycji danych klienta jest w trakcie implementacji. Wkrótce będzie dostępna.
        </DialogDescription>
        <DialogActions>
          <Button plain onClick={() => setIsOpen(false)}>
            Zamknij
          </Button>
          {/* <Button onClick={() => setIsOpen(false)}>Utwórz</Button> */}
        </DialogActions>
      </Dialog>
    </>
  )
}