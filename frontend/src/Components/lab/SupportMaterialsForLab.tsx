import { useLabContext } from "../../provider/LabContext";

export function SupportMaterialsForLab() {
    const { realWorldScenario, supportMaterials, isLoading } = useLabContext();
    if (isLoading) {
        return <div>Loading...</div>;
    }
    return (
        <div className="bg-white flex flex-col mx-auto p-8 w-full max-w-[1200px] max-h-[800] h-max rounded-2xl gap-4">
            <h2 className="text-2xl font-bold">Scenario</h2>
            <p className="font-normal text-base">{realWorldScenario}</p>
            {supportMaterials.relationalSchema && (
                <div className="flex flex-col gap-4">
                    <h2 className="text-2xl font-bold">Relational Schema</h2>
                    {Object.keys(supportMaterials.relationalSchema).map((tableName) => {
                        return (
                            <div key={tableName} className="flex flex-col gap-2">
                                <h3 className="text-lg font-medium">{tableName}</h3>
                                <table className="table-fixed border-2 text-center">
                                    <thead>
                                        <tr>
                                            <th className="border-2 border-black px-4 py-2">Column Name</th>
                                            <th className="border-2 border-black px-4 py-2">Type</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {supportMaterials.relationalSchema && supportMaterials.relationalSchema[tableName].map((column) => {
                                            return (
                                                <tr key={column.name} className="border-2">
                                                    <td className="border-2 border-black px-4 py-2">{column.name}</td>
                                                    <td className="border-2 border-black px-4 py-2">{column.type}</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        );
                    }
                    )}
                </div>
            )}
            {supportMaterials.tables && (
                <div className="flex flex-col gap-4">
                    <h2 className="text-2xl font-bold border-black">Tables</h2>
                    {supportMaterials.tables.map((table) => {
                        return (
                            <div key={table.tableName} className="flex flex-col gap-2">
                                <h3 className="text-lg font-medium ">{table.tableName}</h3>
                                <table className="table-fixed border-2 text-center">
                                    <thead>
                                        {table.columns.map((column) => {
                                            return <th key={column.name} scope="col" className="border-2 border-black px-4 py-2">{column.name}</th>;
                                        })}

                                    </thead>
                                    <tbody>
                                        {table.rows.map((row, index) => {
                                            return (
                                                <tr key={index} className="border-2">
                                                    {table.columns.map((column) => {
                                                        return (
                                                            <td key={column.name} className="border-2 border-black px-4 py-2">{row[column.name]}</td>
                                                        );
                                                    })}
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        );
                    })}
                </div>
            )}
            {supportMaterials.jsonDocument && (
                <div>
                    <h2 className="text-2xl font-bold">JSON Document</h2>
                    <p className="font-normal text-base">{JSON.stringify(supportMaterials.jsonDocument, null, 2)}</p>
                </div>
            )}
        </div>
    );
}
