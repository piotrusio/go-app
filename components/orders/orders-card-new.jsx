"use client";

import { useState } from 'react'
import { Button } from '@/components/catalyst/button'
import { Dialog, DialogActions, DialogDescription, DialogTitle } from '@/components/catalyst/dialog'
import { PlusIcon } from '@heroicons/react/16/solid'

export function OrdersCardNew() {
  let [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button outline type="button" onClick={() => setIsOpen(true)}>
        <PlusIcon className="size-5" />
        <span className="sm:inline">Zamów</span>
      </Button>
      <Dialog open={isOpen} onClose={setIsOpen}>
        <DialogTitle>Nowe Zamówienie</DialogTitle>
        <DialogDescription>
          Funkcjonalność dodawania zamówień jest w trakcie implementacji. Wkrótce będzie dostępna.
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