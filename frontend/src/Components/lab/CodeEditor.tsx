import { Editor } from "@monaco-editor/react";
import { useEffect, useRef, useState } from "react";
import { editor } from 'monaco-editor';
import { Select } from "antd";


const PROGRAMMING_LANGUAGES = ["javascript", "sql"];

export function CodeEditor({ handleCodeOnChange }: { handleCodeOnChange: (codeSnippet: string) => void }) {
    const [code, setCode] = useState("");
    const [language, setLanguage] = useState("sql");
    const [codeEditorWidth, setCodeEditorWidth] = useState<string | null>("90vw");
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);


    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 1640) {
                setCodeEditorWidth(`${1080}px`);
            } else {
                setCodeEditorWidth(`${window.innerWidth * 0.9}px`);
            }
        }

        window.addEventListener("resize", handleResize);
        window.addEventListener("load", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        }
    }, []);

    function handleEditorOnMount(editor: editor.IStandaloneCodeEditor) {
        if (editorRef.current) {
            editorRef.current = editor;
            editor.focus();
        }
    }

    function onLanguageChange(selectedLanguage: string) {
        setLanguage(selectedLanguage);
    }

    if (codeEditorWidth === null) {
        return
    }

    return (
        <div className="flex flex-col gap-4">
            <LanguageSelector language={language} onLanguageChange={onLanguageChange} />
            <Editor
                className="py-4 px-2 bg-zinc-900 rounded-md"
                height={"300px"}
                width={codeEditorWidth}
                theme="vs-dark"
                language={language}
                value={code}
                onChange={(value) => {
                    value && setCode(value);
                    value && handleCodeOnChange(value);
                }}
                onMount={handleEditorOnMount}
                options={{
                    quickSuggestions: {
                        other: false,
                        comments: false,
                        strings: false
                    },
                    parameterHints: {
                        enabled: false
                    },
                    suggestOnTriggerCharacters: false,
                    acceptSuggestionOnEnter: "off",
                    tabCompletion: "off",
                    wordBasedSuggestions: "off"
                }}

            />
        </div>
    )
}

function LanguageSelector({ language, onLanguageChange }: { language: string, onLanguageChange: (language: string) => void }) {
    return (
        <Select defaultValue={language} onChange={(selectedLanguage) => onLanguageChange(selectedLanguage)} className="w-max">
            {PROGRAMMING_LANGUAGES.map((lang) => (
                <Select.Option key={lang} value={lang}>{lang}</Select.Option>
            ))}
        </Select>
    )
}