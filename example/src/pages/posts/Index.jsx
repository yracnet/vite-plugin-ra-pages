import { Badge } from "@mui/icons-material";
import { ListGuesser, Menu, ResourceMenuItem } from "react-admin";

export default () => <ListGuesser />;

export const menu = {
  order: 10,
  icon: <Badge />,
  label: "Post Index",
  role: ["a"],
  query: {
    filter: {
      type: "Rock",
    },
  },
};

export const Menu = ({ resource }) => {
  return <ResourceMenuItem name={resource}></ResourceMenuItem>;
};

export const MyMenu = () => (
  <Menu>
    <Menu.DashboardItem />
    <Menu.ResourceItem name="posts" />
    <Menu.ResourceItem name="comments" />
    <Menu.ResourceItem name="users" />
    <Menu.Item
      to="/custom-route"
      primaryText="Miscellaneous"
      leftIcon={<LabelIcon />}
    />
  </Menu>
);
