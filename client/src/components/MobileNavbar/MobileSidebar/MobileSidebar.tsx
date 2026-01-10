import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import {
  firstDividerList,
  secondDividerList,
  thirdDividerList,
} from "@/utils/mobileSidebarCategories";
import { IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router-dom";
import { IoCloseOutline } from "react-icons/io5";

const style = {
  width: "100%",
  margin: "2px",
  overflow: "hidden",
  borderRadius: "5px",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "start",
  ":hover": {
    background: "#EDE5FA",
  },
};

const MobileSidebar = ({ showSidebar, setShowSidebar }) => {
  const DrawerList = (
    <div>
      <Box
        sx={{ width: 250, fontSize: "14px", overflowX: "hidden", overflowY: "hidden" }}
        role="presentation"
      >
        <List>
          {firstDividerList.map((word) => (
            <ListItem key={word.text} disablePadding>
              <Link to={word.to} className="w-full" onClick={() => setShowSidebar(false)}>
                <ListItemButton
                  sx={{
                    width: "100%",
                    margin: "2px",
                    color: "#6d28d2",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "start",
                    ":hover": {
                      background: "#EDE5FA",
                    },
                  }}
                >
                  <div className="flex w-full items-center justify-between">
                    <p>{word.text}</p>
                  </div>
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
        </List>
        <Divider sx={{ border: "1px solid gray-100" }} />
        <List>
          <ListItemButton sx={style}>
            Certification preparation <IoIosArrowForward />
          </ListItemButton>
        </List>
        <Divider />
        <List>
          <List sx={{ width: "100%", marginLeft: "25px", fontWeight: 700, color: "gray" }}>
            Most popular
          </List>
          {secondDividerList.map((text) => (
            <ListItem key={text} disablePadding>
              <ListItemButton sx={style}>
                <p>{text}</p>
                <IoIosArrowForward />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          <List sx={{ width: "100%", marginLeft: "25px", fontWeight: 700, color: "gray" }}>
            More from Udemy
          </List>
          {thirdDividerList.map((text) => (
            <ListItem key={text} disablePadding>
              <ListItemButton sx={style} onClick={() => setShowSidebar(false)}>
                {text}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
      <div
        className="fixed left-[260px] top-5 z-[1301] cursor-pointer rounded-full bg-white p-2 shadow-md hover:bg-gray-100"
        onClick={() => setShowSidebar(false)}
      >
        <IoCloseOutline size={20} className="text-gray-600" />
      </div>
    </div>
  );

  return (
    <div>
      <Drawer open={showSidebar} onClose={() => setShowSidebar(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
};

export default MobileSidebar;
