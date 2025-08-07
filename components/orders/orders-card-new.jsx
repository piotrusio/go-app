"use client";

import { useState, useEffect } from 'react'
import { Button } from '@/components/catalyst/button'
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@/components/catalyst/dialog'
import { Field, Label } from '@/components/catalyst/fieldset'
import { Combobox, ComboboxOption, ComboboxLabel } from '@/components/catalyst/combobox'
import { PlusIcon } from '@heroicons/react/16/solid'

export function OrdersCardNew() {
  const [isOpen, setIsOpen] = useState(false)
  const [customers, setCustomers] = useState([])
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchCustomers() {
      if (isOpen && customers.length === 0) {
        setLoading(true)
        try {
          const response = await fetch('/api/customers/codes')
          if (!response.ok) {
            throw new Error('Failed to fetch customers')
          }
          const customerCodes = await response.json()
          setCustomers(customerCodes)
        } catch (error) {
          console.error('Failed to fetch customers:', error)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchCustomers()
  }, [isOpen, customers.length])

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
        <DialogBody>
          <Field>
            <Label>Klient</Label>
            <Combobox 
              name="customer" 
              value={selectedCustomer}
              onChange={setSelectedCustomer}
              options={customers} 
              displayValue={(customer) => customer?.customer_code} 
              placeholder={loading ? "Ładowanie..." : "Wybierz klienta..."}
              disabled={loading}
            >
              {(customer) => (
                <ComboboxOption key={customer.customer_id} value={customer}>
                  <ComboboxLabel>{customer.customer_code}</ComboboxLabel>
                </ComboboxOption>
              )}
            </Combobox>
          </Field>
        </DialogBody>
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