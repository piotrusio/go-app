"use client";

import { useState } from 'react'
import { Button } from '@/components/catalyst/button'
import { Dialog, DialogActions, DialogDescription, DialogTitle } from '@/components/catalyst/dialog'
import { PlusIcon } from '@heroicons/react/16/solid'

export function CustomersNewCard() {
  let [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button outline type="button" onClick={() => setIsOpen(true)}>
        <PlusIcon className="size-5" />
        <span className="sm:inline">Nowy</span>
      </Button>
      <Dialog open={isOpen} onClose={setIsOpen}>
        <DialogTitle>Nowy Klient</DialogTitle>
        <DialogDescription>
          Funkcjonalność dodawania klientów jest w trakcie implementacji. Wkrótce będzie dostępna.
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