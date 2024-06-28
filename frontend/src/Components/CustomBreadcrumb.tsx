import { Breadcrumb } from "antd";
import { Link } from "react-router-dom";

interface BreadCrumbItem {
    title: string;
    path: string;
}

interface BreadcrumbProps {
    module: BreadCrumbItem;
    topic: BreadCrumbItem;
    materialType: BreadCrumbItem;
}

export default function CustomBreadcrumb({ module, topic, materialType }: BreadcrumbProps) {
    return (
        <Breadcrumb>
            <Breadcrumb.Item>
                <Link to="/">Modules</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
                <Link to={module.path}>{module.title}</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
                <Link to={topic.path}>{topic.title}</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
                <Link to={materialType.path}>{materialType.title}</Link>
            </Breadcrumb.Item>
        </Breadcrumb>
    )
}