import { Skeleton } from "antd";
import { Content } from "antd/es/layout/layout";

export function QuestionCardForLabSkeleton() {
    const active = true;
    const size = "default";
    return (
        <div className="flex flex-col gap-3 w-[1200px]">
            <div className="w-36">
                <Skeleton.Button active={active} size={size} block={true} />
            </div>
            <Content className="bg-white py-6 px-6 rounded-2xl flex flex-col gap-4">
                {/* <Skeleton title={true} /> */}
                <Skeleton paragraph={{ rows: 2 }} active={active} />
                <br />
                <Skeleton paragraph={{ rows: 1 }} active={active} title={false} />
                <Content className="w-full h-[150px] border-2 rounded-2xl" />
                <div className="flex flex-row justify-between gap-2">
                    <Skeleton active={active} paragraph={{ rows: 1 }} title={false} />
                    <div className="w-36">
                        <Skeleton.Button active={active} size={size} block={true} />
                    </div>
                </div>
            </Content>
        </div>
    );
}