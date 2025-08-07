'use client'

import Image from 'next/image'

import { Navbar, NavbarSection, NavbarSpacer } from '@/components/catalyst/navbar'
import { Sidebar, SidebarBody, SidebarHeader, SidebarHeading, SidebarItem, SidebarLabel, SidebarSection } from '@/components/catalyst/sidebar'
import { SidebarLayout } from '@/components/catalyst/sidebar-layout'
import { 
  DocumentTextIcon, MapIcon, RectangleGroupIcon, BuildingOfficeIcon, SwatchIcon,
  DocumentDuplicateIcon, Square3Stack3DIcon, TruckIcon, HomeIcon
} from '@heroicons/react/20/solid'
import { usePathname } from 'next/navigation'

export function AppLayout({ children }) {

  let pathname = usePathname()

  return (
    <SidebarLayout
      sidebar={
        <Sidebar>
          <SidebarHeader>
            <Image src="/logo.png" alt="Logo" width={120} height={50} className="dark:invert" />
          </SidebarHeader>
          <SidebarBody>
            <SidebarSection>
              <SidebarItem href="/home" current={pathname.startsWith('/home')}>
                <HomeIcon />
                <SidebarLabel>Home</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
            <SidebarSection>
              <SidebarHeading>Produkty</SidebarHeading>
              <SidebarItem href="/fabrics" current={pathname.startsWith('/fabrics')}>
                <SwatchIcon />
                <SidebarLabel>Tkaniny</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/carpets" current={pathname.startsWith('/carpets')}>
                <Square3Stack3DIcon />
                <SidebarLabel>Dywany</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/samples" current={pathname.startsWith('/samples')}>
                <MapIcon />
                <SidebarLabel>Próbniki</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/decors" current={pathname.startsWith('/decors')}>
                <RectangleGroupIcon />
                <SidebarLabel>AlmiDecor</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
            <SidebarSection>
              <SidebarHeading>Kontrahenci</SidebarHeading>
              <SidebarItem href="/customers" current={pathname.startsWith('/customers')}>
                <BuildingOfficeIcon />
                <SidebarLabel>Klienci</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/suppliers" current={pathname.startsWith('/suppliers')}>
                <TruckIcon />
                <SidebarLabel>Dostawcy</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
            <SidebarSection>
              <SidebarHeading>Sprzedaż</SidebarHeading>
              <SidebarItem href="/orders" current={pathname.startsWith('/orders')}>
                <DocumentDuplicateIcon />
                <SidebarLabel>Zamówienia</SidebarLabel>
              </SidebarItem>
              <SidebarItem href="/invoices" current={pathname.startsWith('/invoices')}>
                <DocumentTextIcon />
                <SidebarLabel>Faktury</SidebarLabel>
              </SidebarItem>
            </SidebarSection>
          </SidebarBody>
        </Sidebar>
      }
    >
      {children}
    </SidebarLayout>
  )
}