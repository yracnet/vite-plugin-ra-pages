import {
  Dashboard,
  ExpandLess,
  ExpandMore,
  People,
  Settings,
  Work,
} from "@mui/icons-material";
import {
  Collapse,
  Divider,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
} from "@mui/material";
import { useState } from "react";

const MenuParent = ({ leftIcon, label, children }) => {
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <>
      <MenuItem onClick={handleToggle}>
        {leftIcon && <ListItemIcon>{leftIcon}</ListItemIcon>}
        <ListItemText>{label}</ListItemText>
        <ListItemIcon>{open ? <ExpandLess /> : <ExpandMore />}</ListItemIcon>
      </MenuItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <MenuList sx={{ ml: 2 }}>{children}</MenuList>
      </Collapse>
    </>
  );
};

const MenuSimple = ({ leftIcon, label, onClick }) => (
  <MenuItem onClick={onClick}>
    {leftIcon && <ListItemIcon>{leftIcon}</ListItemIcon>}
    <ListItemText>{label}</ListItemText>
  </MenuItem>
);

export const NestedMenu = ({ onMenuClick }) => {
  return (
    <MenuList>
      <MenuSimple
        onClick={onMenuClick}
        leftIcon={<Dashboard />}
        label="Dashboard"
      />

      <MenuParent label="Usuarios" leftIcon={<People />}>
        <MenuSimple
          onClick={onMenuClick}
          leftIcon={<People />}
          label="Ver Todos"
        />

        <MenuParent label="Listar Todo" leftIcon={<People />}>
          <MenuSimple
            onClick={onMenuClick}
            leftIcon={<People />}
            label="Ver Activos"
          />
          <MenuSimple
            onClick={onMenuClick}
            leftIcon={<People />}
            label="Ver inactivos"
          />
        </MenuParent>
        <MenuSimple
          onClick={onMenuClick}
          leftIcon={<People />}
          label="Crear Usuario"
        />
      </MenuParent>

      <MenuParent label="Configuración" leftIcon={<Settings />}>
        <MenuSimple
          onClick={onMenuClick}
          leftIcon={<Settings />}
          label="Preferencias"
        />
        <MenuSimple
          onClick={onMenuClick}
          leftIcon={<Settings />}
          label="Seguridad"
        />
      </MenuParent>

      <Divider />

      <MenuSimple onClick={onMenuClick} leftIcon={<Work />} label="Proyectos" />
    </MenuList>
  );
};
