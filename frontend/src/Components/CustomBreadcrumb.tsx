import { Breadcrumb } from "antd";
import { useLocation } from "react-router-dom";

// Format path for breadcrumbs
function formatPathForBreadcrumb(path: string) {
    const segments = path
        .split("/")
        .map((path) => path.trim().replace(/-/g, " "));

    let currentPath = "";
    return segments.map((segment) => {
        if (segment !== "") {
            currentPath += `/${segment.replace(/ /g, "-")}`; // reconstruct path with original hyphens
            return {
                title: segment.charAt(0).toUpperCase() + segment.slice(1),
                href: currentPath,
            };
        } else {
            return {};
        }
    });
}

export default function CustomBreadcrumb() {
    // Get the current location
    const { pathname } = useLocation();

    const pathSegments = formatPathForBreadcrumb(pathname);

    return <Breadcrumb style={{ margin: "16px 0" }} items={[{ title: "Module" }, ...pathSegments]} />;
}
