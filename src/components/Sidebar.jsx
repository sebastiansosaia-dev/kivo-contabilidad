import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Factory,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react'

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/ventas', label: 'Ventas', icon: ShoppingCart },
  { path: '/inventario', label: 'Inventario', icon: Package },
  { path: '/produccion', label: 'Producción', icon: Factory },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <button className="sidebar-mobile-toggle" onClick={() => setMobileOpen(true)}>
        <Menu size={22} />
      </button>
      {mobileOpen && <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />}
      <aside className={`sidebar ${collapsed ? 'sidebar--collapsed' : ''} ${mobileOpen ? 'sidebar--mobile-open' : ''}`}
        style={{ width: collapsed ? 72 : 250 }}>
        <div className="sidebar__header">
          <div className="sidebar__logo">
            <div className="sidebar__logo-icon">K</div>
            {!collapsed && <span className="sidebar__logo-text">KIVO</span>}
          </div>
          <button className="sidebar__mobile-close" onClick={() => setMobileOpen(false)}>
            <X size={18} />
          </button>
        </div>
        <nav className="sidebar__nav">
          {navItems.map(({ path, label, icon: Icon }) => (
            <NavLink key={path} to={path} className={({ isActive }) => `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
              onClick={() => setMobileOpen(false)} title={collapsed ? label : undefined}>
              <Icon size={20} />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>
        <button className="sidebar__toggle" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
        {!collapsed && (
          <div className="sidebar__footer">
            <div className="sidebar__status">
              <span className="sidebar__status-dot" />
              Realtime activo
            </div>
          </div>
        )}
      </aside>
    </>
  )
}
