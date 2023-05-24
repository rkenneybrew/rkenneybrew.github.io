export declare type ExecWorkerOptions = {
    name?: string;
    cwd?: string;
    env?: object;
    callbacks?: boolean;
    execPath?: string;
    sleep?: number;
};
export default function functionExecSync(options: ExecWorkerOptions, filePath: string): any;
