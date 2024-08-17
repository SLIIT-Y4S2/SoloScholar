import { Editor } from "@monaco-editor/react";
import { useEffect, useRef, useState } from "react";
import { editor } from 'monaco-editor';
import { Select } from "antd";
import { useLabSessionContext } from "../../provider/lab/LabSessionContext";

interface CodeEditorProps {
    readonly currentSnippet: string;
    readonly handleCodeOnChange: (codeSnippet: string) => void;
}

const PROGRAMMING_LANGUAGES = ["javascript", "sql"];

export function CodeEditor({ handleCodeOnChange, currentSnippet }: CodeEditorProps) {
    const [code, setCode] = useState(currentSnippet);
    const [language, setLanguage] = useState("sql");
    const [codeEditorWidth, setCodeEditorWidth] = useState<string | null>("1136px");
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

    const { isAnsForCurrQuesCorrect, currentQuestionIndex, questions } = useLabSessionContext();


    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 1280) {
                setCodeEditorWidth(`${1136}px`);
            } else {
                setCodeEditorWidth(`${window.innerWidth * 0.9}px`);
            }
        }

        window.addEventListener("load", handleResize);
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        }
    }, []);

    useEffect(() => {
        setCode(questions[currentQuestionIndex].current_answer ?? " ");
    }, [isAnsForCurrQuesCorrect, currentQuestionIndex, questions]);

    function handleEditorOnMount(editor: editor.IStandaloneCodeEditor) {
        if (editorRef.current) {
            editorRef.current = editor;
            editor.focus();
        }

        if (window.innerWidth > 1280) {
            setCodeEditorWidth(`${1136}px`);
        } else {
            setCodeEditorWidth(`${window.innerWidth * 0.9}px`);
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
            <div className="flex flex-row justify-between">
                <p className="font-semibold text-base">
                    Provide your answer in below code editor.
                </p>
                <LanguageSelector language={language} onLanguageChange={onLanguageChange} />
            </div>
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
                        strings: false,
                    },
                    domReadOnly: isAnsForCurrQuesCorrect ?? false,
                    readOnly: isAnsForCurrQuesCorrect ?? false,
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

function LanguageSelector({ language, onLanguageChange }: Readonly<{ language: string, onLanguageChange: (language: string) => void }>) {
    return (
        <Select defaultValue={language} onChange={(selectedLanguage) => onLanguageChange(selectedLanguage)} className="w-max min-w-[100px]">
            {PROGRAMMING_LANGUAGES.map((lang) => (
                <Select.Option key={lang} value={lang}>{lang.toUpperCase()}</Select.Option>
            ))}
        </Select>
    )
}