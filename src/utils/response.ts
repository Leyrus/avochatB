export class ResultOutput {
    static success = (data: any) => ({ ok: true, data })

	static error = (error: string) => ({ ok: false, data: null, message: error })
}
