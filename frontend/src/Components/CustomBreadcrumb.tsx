import { Breadcrumb } from "antd";
import { ItemType } from "antd/es/breadcrumb/Breadcrumb";
import { Link, useLocation } from "react-router-dom";

// // Format path for breadcrumbs
// function formatPathForBreadcrumb(path: string) {
//     const segments = path
//         .split("/")
//         .map((path) => path.trim().replace(/-/g, " "));

//     let currentPath = "";
//     return segments.map((segment) => {
//         if (segment !== "") {
//             currentPath += `/${segment.replace(/ /g, "-")}`; // reconstruct path with original hyphens
//             return {
//                 title: segment.charAt(0).toUpperCase() + segment.slice(1),
//                 href: currentPath,
//             };
//         } else {
//             return {};
//         }
//     });
// }

// export default function CustomBreadcrumb() {
//     // Get the current location
//     const { pathname } = useLocation();

//     const pathSegments = formatPathForBreadcrumb(pathname);

//     return <Breadcrumb items={[{ title: "Module" }, ...pathSegments]} />;
// }

const CustomBreadcrumb = () => {
  const location = useLocation();
  const pathSnippets = location.pathname.split("/").filter((i) => i);

  const items = [
    { path: "/", title: "Modules" },
    ...pathSnippets.map((_, index) => {
      const path = `/${pathSnippets.slice(0, index + 1).join("/")}`;
      const title =
        pathSnippets[index].charAt(0).toUpperCase() +
        pathSnippets[index].slice(1).replace(/-/g, " ");
      return { path, title };
    }),
  ];
  function itemRender(route: ItemType, _: unknown, routes: ItemType[]) {
    const isNotLink =
      route?.path === routes[items.length - 1]?.path ||
      (route?.path === routes[2]?.path && route?.title !== "Discussion forum");

    return isNotLink ? (
      <span>{route.title}</span>
    ) : (
      <Link to={route.path ?? "/"}>{route.title}</Link>
    );
  }

  return (
    <Breadcrumb
      style={{ margin: "16px 0" }}
      itemRender={itemRender}
      items={items}
    />
  );
};

export default CustomBreadcrumb;
