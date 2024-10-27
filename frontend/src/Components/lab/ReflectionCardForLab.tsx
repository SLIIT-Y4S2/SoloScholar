import TextArea from "antd/es/input/TextArea";

export default function ReflectionCardForLab({ onChange }: { readonly onChange: (value: string) => void }) {
    return (
        <div className="bg-white flex flex-col mx-auto px-8 py-4 w-full  max-h-[800] h-max rounded-2xl">
            <p className="font-semibold my-2">
                Write a small reflection on the answer you provided.
            </p>
            <TextArea
                className="overflow-visible bg-sky-950 text-white w-full p-4 custom-scrollbar hover:bg-sky-950 focus:bg-sky-950 max-w-[1440px]"
                autoSize={{ minRows: 4, maxRows: 8 }}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}
