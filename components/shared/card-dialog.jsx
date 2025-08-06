'use client'

import { Button } from '@/components/catalyst/button'
import { Dialog, DialogActions, DialogBody, DialogTitle } from '@/components/catalyst/dialog'
import { useState } from 'react'
import { PlusIcon, PencilSquareIcon } from '@heroicons/react/16/solid'

export default function CardDialog({
  // Mode configuration
  mode = "new", // "new" or "edit"
  
  // Button configuration
  buttonText,
  buttonProps = {},
  
  // Dialog configuration
  dialogTitle,
  dialogSize = "md",
  
  // Content configuration
  children, // Form fields content
  
  // Form handling
  onSubmit,
  submitButtonText,
  cancelButtonText = "Anuluj",
  
  // Additional props
  className = "",
  disabled = false
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Configure defaults based on mode
  const modeConfig = {
    new: {
      icon: PlusIcon,
      defaultButtonText: "Nowy",
      defaultDialogTitle: "Nowy element",
      defaultSubmitText: "Utwórz"
    },
    edit: {
      icon: PencilSquareIcon,
      defaultButtonText: "Edytuj",
      defaultDialogTitle: "Edytuj element",
      defaultSubmitText: "Zapisz"
    }
  }

  const config = modeConfig[mode] || modeConfig.new
  const ButtonIcon = config.icon

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    
    if (!onSubmit) {
      console.warn("No onSubmit handler provided to Card");
      return;
    }

    setIsLoading(true);
    
    try {
      const formData = new FormData(event.currentTarget);
      await onSubmit(formData, { setIsOpen, setIsLoading });
    } catch (error) {
      console.error("Form submission failed:", error);
      // Keep dialog open on error so user can retry
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={className}>
      <Button 
        outline 
        type="button" 
        onClick={() => setIsOpen(true)}
        disabled={disabled}
        {...buttonProps}
      >
        <ButtonIcon className="size-5" />
        <span className="sm:inline ml-2">
          {buttonText || config.defaultButtonText}
        </span>
      </Button>

      <Dialog 
        open={isOpen} 
        onClose={setIsOpen} 
        as="form" 
        onSubmit={handleFormSubmit}
        size={dialogSize}
      >
        <DialogTitle>
          {dialogTitle || config.defaultDialogTitle}
        </DialogTitle>
        <DialogBody>
          {children}
        </DialogBody>
        <DialogActions>
          <Button 
            plain 
            type="button" 
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
          >
            {cancelButtonText}
          </Button>
          <Button 
            type="submit" 
            disabled={isLoading}
          >
            {isLoading ? 'Zapisywanie...' : (submitButtonText || config.defaultSubmitText)}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}